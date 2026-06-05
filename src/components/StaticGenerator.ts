import { TeacherFormState, Intensity } from '../types';

export function generateStaticText(state: TeacherFormState): string {
  const name = state.studentName.trim() || (state.studentGender === 'M' ? "l'alunno" : "l'alunna");
  const pronoun = state.studentGender === 'M' ? 'Egli' : 'Ella';
  const prefix = state.studentGender === 'M' ? 'lo' : 'la';
  const prep = state.studentGender === 'M' ? 'dell\'alunno' : 'dell\'alunna';
  const subjectStr = state.subject.trim() ? ` in ${state.subject.trim()}` : '';

  const sentences: string[] = [];

  // Introduction
  if (state.studentName.trim()) {
    sentences.push(`In merito al rendimento scolastico registrato${subjectStr}, si formulano le seguenti osservazioni riguardanti ${name}.`);
  } else {
    sentences.push(`In merito al rendimento scolastico registrato${subjectStr}, si evidenziano alcune criticità nel percorso di apprendimento.`);
  }

  // 1. Mancanza di studio
  if (state.mancanza_studio.checked) {
    const intensity = state.mancanza_studio.intensity;
    if (intensity === 'lieve') {
      sentences.push(`${pronoun} mostra una parziale discontinuità nello studio della materia, che risulta talvolta frammentario e non sempre regolare.`);
    } else if (intensity === 'moderato') {
      sentences.push(`Lo studio individuale si presenta superficiale e non costante, limitando l'assimilazione autonoma delle nozioni trattate.`);
    } else {
      sentences.push(`Si riscontra una sistematica e persistente mancanza di impegno e studio domestico, causa primaria del mancato raggiungimento degli obiettivi.`);
    }
  }

  // 2. Mancanza di applicazione teorico-pratica
  if (state.mancanza_applicazione.checked) {
    const intensity = state.mancanza_applicazione.intensity;
    if (intensity === 'lieve') {
      sentences.push(`Si osserva qualche incertezza nell'applicare autonomamente le regole e le conoscenze teoriche a contesti pratici o esercizi.`);
    } else if (intensity === 'moderato') {
      sentences.push(`Il passaggio dalla teoria all'applicazione pratica risulta difficoltoso, evidenziando limiti significativi nell'eseguire consegne operative.`);
    } else {
      sentences.push(`Esiste una marcata e continua difficoltà nell'utilizzare gli strumenti operativi e nel tradurre le conoscenze teoriche in abilità pratiche.`);
    }
  }

  // 3. Carenze di base
  if (state.carenze_base.checked) {
    const intensity = state.carenze_base.intensity;
    if (intensity === 'lieve') {
      sentences.push(`Il percorso è rallentato da lievi lacune pregresse che richiedono ulteriore consolidamento.`);
    } else if (intensity === 'moderato') {
      sentences.push(`Si evidenziano diffuse lacune e carenze conoscitive nelle basi della materia, che impediscono una progressione fluida.`);
    } else {
      sentences.push(`Il quadro conoscitivo generale è gravemente compromesso da profonde lacune pregresse mai colmate, che ostacolano l'acquisizione di nuove competenze.`);
    }
  }

  // 4. Difficoltà di comprensione dei contenuti
  if (state.difficolta_comprensione.checked) {
    const intensity = state.difficolta_comprensione.intensity;
    if (intensity === 'lieve') {
      sentences.push(`Compone in modo faticoso le nuove informazioni, incontrando qualche sporadica difficoltà di comprensione di fronte ai concetti più complessi.`);
    } else if (intensity === 'moderato') {
      sentences.push(`Mostra tempi di comprensione lenti, faticando ad assimilare in modo compiuto le spiegazioni e i nuclei fondanti della disciplina.`);
    } else {
      sentences.push(`Si registrano serietà e costanti difficoltà nella comprensione delle tematiche illustrate, anche con continue spiegazioni semplificate.`);
    }
  }

  // 5. Difficoltà di rielaborazione
  if (state.difficolta_rielaborazione.checked) {
    const intensity = state.difficolta_rielaborazione.intensity;
    const sub = state.difficolta_rielaborazione.suboptions;
    const selectedSubs: string[] = [];
    if (sub.analisi) selectedSubs.push("l'analisi dei dati");
    if (sub.sintesi) selectedSubs.push("la sintesi dei concetti");
    if (sub.strutturazione_logica) selectedSubs.push("la strutturazione logica delle idee");
    if (sub.applicazione_conoscenze) selectedSubs.push("l'applicazione autonoma delle conoscenze");
    if (sub.argomentazione_scritta) selectedSubs.push("l'argomentazione scritta");

    let subText = "";
    if (selectedSubs.length > 0) {
      if (selectedSubs.length === 1) {
        subText = `, in particolare per quanto concerne ${selectedSubs[0]}`;
      } else {
        const last = selectedSubs.pop();
        subText = `, specialmente nelle attività di ${selectedSubs.join(', ')} e ${last}`;
      }
    }

    if (intensity === 'lieve') {
      sentences.push(`La rielaborazione personale dei contenuti è scolastica e prevalentemente ripetitiva${subText}.`);
    } else if (intensity === 'moderato') {
      sentences.push(`Si evidenziano difficoltà nel rielaborare autonomamente le informazioni apprese, che vengono esposte in modo meccanico e poco personale${subText}.`);
    } else {
      sentences.push(`L'alunno non è in grado di rielaborare in modo critico o personale i contenuti didattici proposti${subText}, fermandosi ad un livello estremamente parziale.`);
    }
  }

  // 6. Metodo di studio inadeguato
  if (state.metodo_studio.checked) {
    const intensity = state.metodo_studio.intensity;
    const sub = state.metodo_studio.suboptions;
    const selectedSubs: string[] = [];
    if (sub.studio_mnemonico) selectedSubs.push("uno studio meramente mnemonico");
    if (sub.discontinuita_lavoro) selectedSubs.push("una forte discontinuità nel ritmo di lavoro");
    if (sub.difficolta_organizzativa) selectedSubs.push("una carente organizzazione dei materiali e dei tempi di studio");
    if (sub.approccio_superficiale) selectedSubs.push("un approccio superficiale ai testi e alle consegne");

    let subText = "";
    if (selectedSubs.length > 0) {
      if (selectedSubs.length === 1) {
        subText = `, caratterizzato da ${selectedSubs[0]}`;
      } else {
        const last = selectedSubs.pop();
        subText = `, che si traduce in ${selectedSubs.join(', ')} e ${last}`;
      }
    }

    if (intensity === 'lieve') {
      sentences.push(`Il metodo di studio necessita di essere meglio affinato ed organizzato${subText} per risultare pienamente produttivo.`);
    } else if (intensity === 'moderato') {
      sentences.push(`Si riscontra un approccio metodologico inadeguato o inefficace${subText}, che non permette di ottimizzare l'impegno profuso.`);
    } else {
      sentences.push(`Il metodo di studio risulta del tutto disorganico e inadatto alle richieste della disciplina${subText}, determinando un'acquisizione fragile e instabile.`);
    }
  }

  // 7. Scarsa partecipazione in classe
  if (state.scarsa_partecipazione.checked) {
    const intensity = state.scarsa_partecipazione.intensity;
    if (intensity === 'lieve') {
      sentences.push(`In classe la partecipazione al dialogo educativo è prevalentemente passiva, sebbene formalmente corretta.`);
    } else if (intensity === 'moderato') {
      sentences.push(`L'interazione durante le lezioni è sporadica; ${name} tende a distrarsi o interviene solo se espressamente sollecitato.`);
    } else {
      sentences.push(`L'atteggiamento in classe è costantemente passivo e disinteressato, mostrando un distacco evidente dalle attività proposte.`);
    }
  }

  // 8. Lessico povero / produzione scritta debole
  if (state.lessico_povero.checked) {
    const intensity = state.lessico_povero.intensity;
    if (intensity === 'lieve') {
      sentences.push(`La produzione linguistica o scritta è semplice, talvolta limitata da un vocabolario non sempre ricco.`);
    } else if (intensity === 'moderato') {
      sentences.push(`Si riscontra un lessico settoriale debole e una produzione scritta frammentaria, con difficoltà nel formulare frasi sintatticamente complesse.`);
    } else {
      sentences.push(`L'esposizione e gli scritti evidenziano una grave povertà lessicale, errori formali ricorrenti e una generale incapacità di strutturare tesi coerenti.`);
    }
  }

  // Additional custom notes
  if (state.notes.trim()) {
    sentences.push(`Si annota inoltre che: ${state.notes.trim()}.`);
  }

  // Conclusion / pedagogical advice
  if (state.tone === 'pedagogico') {
    sentences.push(`Si raccomanda vivamente di pianificare momenti di recupero mirati e di adottare un piano di studio costante per favorire un progressivo e soddisfacente miglioramento.`);
  } else if (state.tone === 'formale') {
    sentences.push(`Pertanto, la valutazione complessiva risulta insufficiente rispetto agli obiettivi formativi minimi stabiliti dalla programmazione d'istituto.`);
  } else {
    // sintetico
    sentences.push(`Necessario recupero mirato.`);
  }

  return sentences.join(' ');
}
