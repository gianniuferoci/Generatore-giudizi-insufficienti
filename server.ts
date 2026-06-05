import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { TeacherFormState } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || process.env.CUSTOM_GEMINI_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiEnabled: !!ai });
});

// Generate evaluation text endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const formState: TeacherFormState = req.body.formState;
    if (!formState) {
      return res.status(400).json({ error: "Dati modulo mancanti" });
    }

    if (!ai) {
      return res.status(500).json({ 
        error: "Il servizio di Generazione AI non è configurato. Aggiungi un nuovo Secret con nome 'CUSTOM_GEMINI_KEY' e incolla il valore della tua Chiave API." 
      });
    }

    // Build descriptions of checked items to feed to the AI
    const detailsList: string[] = [];
    const name = formState.studentName.trim() || (formState.studentGender === 'M' ? "l'alunno" : "l'alunna");
    const genderWord = formState.studentGender === 'M' ? "Maschile (alunno/studente)" : "Femminile (alunna/studentessa)";

    if (formState.mancanza_studio.checked) {
      detailsList.push(`Mancanza di studio (Intensità: ${formState.mancanza_studio.intensity})`);
    }
    if (formState.mancanza_applicazione.checked) {
      detailsList.push(`Mancanza di applicazione teorico-pratica (Intensità: ${formState.mancanza_applicazione.intensity})`);
    }
    if (formState.carenze_base.checked) {
      detailsList.push(`Carenze di base e lacune pregresse (Intensità: ${formState.carenze_base.intensity})`);
    }
    if (formState.difficolta_comprensione.checked) {
      detailsList.push(`Difficoltà di comprensione dei contenuti (Intensità: ${formState.difficolta_comprensione.intensity})`);
    }
    if (formState.difficolta_rielaborazione.checked) {
      const sub = formState.difficolta_rielaborazione.suboptions;
      const subSelected: string[] = [];
      if (sub.analisi) subSelected.push("Analisi");
      if (sub.sintesi) subSelected.push("Sintesi");
      if (sub.strutturazione_logica) subSelected.push("Strutturazione logica");
      if (sub.applicazione_conoscenze) subSelected.push("Applicazione delle conoscenze");
      if (sub.argomentazione_scritta) subSelected.push("Argomentazione scritta");
      
      const subString = subSelected.length > 0 ? ` [Sotto-aspetti deficitari: ${subSelected.join(", ")}]` : "";
      detailsList.push(`Difficoltà di rielaborazione (Intensità: ${formState.difficolta_rielaborazione.intensity})${subString}`);
    }
    if (formState.metodo_studio.checked) {
      const sub = formState.metodo_studio.suboptions;
      const subSelected: string[] = [];
      if (sub.studio_mnemonico) subSelected.push("Studio mnemonico");
      if (sub.discontinuita_lavoro) subSelected.push("Discontinuità nel ritmo di lavoro ordinario");
      if (sub.difficolta_organizzativa) subSelected.push("Difficoltà organizzativa dei tempi/materiali");
      if (sub.approccio_superficiale) subSelected.push("Approccio superficiale");

      const subString = subSelected.length > 0 ? ` [Sotto-aspetti deficitari: ${subSelected.join(", ")}]` : "";
      detailsList.push(`Metodo di studio inadeguato (Intensità: ${formState.metodo_studio.intensity})${subString}`);
    }
    if (formState.scarsa_partecipazione.checked) {
      detailsList.push(`Scarsa partecipazione o passività in classe (Intensità: ${formState.scarsa_partecipazione.intensity})`);
    }
    if (formState.lessico_povero.checked) {
      detailsList.push(`Lessico povero o produzione scritta debole (Intensità: ${formState.lessico_povero.intensity})`);
    }

    if (detailsList.length === 0) {
      return res.json({ 
        aiText: "Attenzione: non hai selezionato alcuna voce dal modulo. Per preghiera, seleziona almeno un'indicazione prima di procedere con la generazione AI." 
      });
    }

    const notesStr = formState.notes.trim() ? `Contesto/Note aggiuntive libere fornite dall'insegnante: "${formState.notes.trim()}"` : "Nessuna nota aggiuntiva fornita.";
    const subjectStr = formState.subject.trim() ? `Materia: ${formState.subject.trim()}` : "Generica del consiglio di classe";

    // Build a precise instructions context
    let toneInstruction = "";
    if (formState.tone === "pedagogico") {
      toneInstruction = `Stile PEDAGOGICO / COSTRUTTIVO. Cerca di essere incoraggiante, empatico ma al contempo molto chiaro e fermo sulle criticità individuate. Elabora approfonditamente ciascun indicatore di insufficienza con finezza pedagogica, proponendo esplicitamente percorsi individualizzati e metodologie di recupero (studio costante, tutoraggio, pianificazione strutturata dei tempi). Non essere frettoloso: scrivi un testo articolato, ricco di sfumature, motivante e completo (circa 150-250 parole).`;
    } else if (formState.tone === "formale") {
      toneInstruction = `Stile FORMALE / BUROCRATICO. Usa il linguaggio tipico dei verbali scolastici ufficiali dei Consigli di Classe italiani. Sii solenne, autorevole, preciso, tecnicamente accurato, impersonale ma ricco e approfondito nella descrizione concettuale dei deficit e delle relative dinamiche cognitive. Scrivi un testo esteso, formale ed elegante che dettagli accuratamente ogni indicatore selezionato senza tralasciare i dettagli o i sotto-aspetti (circa 150-250 parole).`;
    } else {
      toneInstruction = `Stile SINTETICO / DIRETTO. Scrivi una sintesi mirata, chiara ed efficace che racchiuda tutti gli indicatori, ideale per limiti di spazio del Registro Elettronico (comunque completa e grammaticalmente ineccepibile, circa 70-110 parole).`;
    }

    const systemInstruction = `Sei un luminare della pedagogia e un esperto dirigente scolastico italiano, rinomato per l'eccellenza e la profondità dei tuoi giudizi valutativi intermedi e finali.
Il tuo compito principale è formulare una relazione/giudizio d'insufficienza scolastica che sia fluida, discorsiva, autorevole e di altissimo spessore culturale e pedagogico. Non devi limitarti a un riassunto telegrafico di poche righe in croce: devi esporre un quadro valutativo dettagliato, esaustivo e pedagogicamente profondo che colleghi armoniosamente tutti gli indicatori selezionati dall'insegnante.

REGOLE ESSENZIALI DI SCRITTURA:
1. ITALIANO ECCELSO: Sii impeccabile nella scelta lessicale, nella coerenza sintattica e nell'uso del congiuntivo e dei connettori logici.
2. COESIONE E FLUIDITÀ: Niente elenchi puntati né frasi slegate. Unisci gli aspetti in una narrazione coesa e fluente, eliminando la percezione meccanica della checklist.
3. MASSIMO DETTAGLIO: Non riassumere eccessivamente! Ogni indicatore spuntato con la propria intensità (lieve, moderato, grave) e relativi sotto-aspetti deve essere trattato con parole dedicate, ampliando il concetto e spiegandone l'impatto sul profitto dello studente.
4. COERENZA DI GENERE: Adatta rigorosamente la grammatica al genere: ${genderWord}. Se il nome è indicato come "${name}", usa preferibilmente quel nome o pronomi coerenti.
5. AMBIENTAZIONE DISCIPLINARE: Applica la trattazione alla specifica disciplina indicata: "${subjectStr}".
6. CONTROLLO DI STILE: Segui con assoluto rigore questa indicazione stilistica: ${toneInstruction}
7. NOTE LIBERE: Integra in modo organico le note libere del docente: "${notesStr}".
8. OUTPUT DIRETTO: Non aggiungere commenti introduttivi (es. "Ecco il giudizio richiesto:"), saluti, intestazioni fittizie o formattazione markdown grezza. Fornisci direttamente ed unicamente il testo del giudizio, pronto per essere utilizzato.`;

    const prompt = `Si prega di generare la motivazione dell'insufficienza per ${name} (${genderWord}) basandoti su queste informazioni scolastiche precise:
- ${detailsList.join('\n- ')}
- ${notesStr}
- ${subjectStr}
- Stile desiderato: ${formState.tone.toUpperCase()}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const aiText = response.text || "La generazione ha restituito un testo vuoto. Riprova.";
    res.json({ aiText });

  } catch (error: any) {
    console.error("Errore durante la generazione AI:", error);
    res.status(500).json({ 
      error: `Errore nella chiamata a Gemini API: ${error.message || error}` 
    });
  }
});

async function run() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on internal port ${PORT}`);
  });
}

run();
