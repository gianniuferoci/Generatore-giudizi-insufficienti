import { useState, useEffect } from 'react';
import { TeacherFormState } from './types';
import { EvaluationForm } from './components/EvaluationForm';
import { ResultPanel } from './components/ResultPanel';
import { generateStaticText } from './components/StaticGenerator';
import { GraduationCap, HelpCircle, GraduationCap as CapIcon, Github } from 'lucide-react';

const INITIAL_STATE: TeacherFormState = {
  studentName: '',
  studentGender: 'M',
  subject: '',
  tone: 'pedagogico',
  
  mancanza_studio: { id: 'mancanza_studio', label: 'Mancanza di studio', checked: true, intensity: 'moderato' },
  mancanza_applicazione: { id: 'mancanza_applicazione', label: 'Mancanza di applicazione teorico-pratica', checked: false, intensity: 'lieve' },
  carenze_base: { id: 'carenze_base', label: 'Carenze di base / lacune pregresse', checked: false, intensity: 'moderato' },
  difficolta_comprensione: { id: 'difficolta_comprensione', label: 'Difficoltà di comprensione dei contenuti', checked: true, intensity: 'lieve' },
  
  difficolta_rielaborazione: {
    id: 'difficolta_rielaborazione',
    label: 'Difficoltà di rielaborazione',
    checked: false,
    intensity: 'lieve',
    suboptions: {
      analisi: false,
      sintesi: false,
      strutturazione_logica: false,
      applicazione_conoscenze: false,
      argomentazione_scritta: false
    }
  },
  
  metodo_studio: {
    id: 'metodo_studio',
    label: 'Metodo di studio inadeguato',
    checked: false,
    intensity: 'moderato',
    suboptions: {
      studio_mnemonico: false,
      discontinuita_lavoro: false,
      difficolta_organizzativa: false,
      approccio_superficiale: false
    }
  },
  
  scarsa_partecipazione: { id: 'scarsa_partecipazione', label: 'Scarsa partecipazione in classe', checked: false, intensity: 'lieve' },
  lessico_povero: { id: 'lessico_povero', label: 'Lessico povero / produzione scritta debole', checked: false, intensity: 'lieve' },
  
  notes: ''
};

export default function App() {
  const [formState, setFormState] = useState<TeacherFormState>(INITIAL_STATE);
  const [staticText, setStaticText] = useState<string>('');
  const [aiText, setAiText] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [hasGeneratedBefore, setHasGeneratedBefore] = useState<boolean>(false);
  const [isAiStale, setIsAiStale] = useState<boolean>(false);

  // Re-generate static text on form changes
  useEffect(() => {
    const computed = generateStaticText(formState);
    setStaticText(computed);
    if (hasGeneratedBefore) {
      setIsAiStale(true);
    }
  }, [formState]);

  // Debounced automatic AI recalculation when the teacher modifies values
  useEffect(() => {
    if (!hasGeneratedBefore) return;

    const delayDebounceFn = setTimeout(() => {
      handleGenerateAi(formState);
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [formState, hasGeneratedBefore]);

  const handleGenerateAi = async (stateToUse?: any) => {
    const activeState = stateToUse && typeof stateToUse === 'object' && 'studentName' in stateToUse ? stateToUse : formState;
    setIsAiLoading(true);
    setAiError(null);
    setIsAiStale(false);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formState: activeState })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Errore di rete generico');
      }
      
      setAiText(data.aiText);
      setHasGeneratedBefore(true);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Si è verificato un errore inaspettato.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      
      {/* Sleek Interface Top Navigation Header */}
      <header className="bg-white border-b border-slate-200 py-5 px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Elegant DocenteAI style logo */}
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
              AI
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                DocenteAI <span className="font-medium text-slate-400 text-sm hidden sm:inline-block ml-2 border-l border-slate-200 pl-2">Verbale & Giudizio Smart</span>
              </h1>
              <p className="text-xs text-slate-500">Generatore intelligente di proposizioni e motivazioni per l'insufficienza scolastica</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
            </span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Elaborazione dinamica AI attiva
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Form */}
          <main className="lg:col-span-7 bg-white p-6 border border-slate-200 rounded-2xl shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Compila l'Osservazione</h2>
              <p className="text-xs text-slate-500">Imposta i dati anagrafici e seleziona i parametri del comportamento o profitto dell'alunno.</p>
            </div>
            
            <EvaluationForm formState={formState} onChange={setFormState} />
          </main>

          {/* Right Column - Results Comparison */}
          <aside className="lg:col-span-5 space-y-6">
            <ResultPanel 
              staticText={staticText} 
              aiText={aiText}
              isAiLoading={isAiLoading}
              aiError={aiError}
              onGenerateAi={handleGenerateAi}
              isAiStale={isAiStale}
            />
          </aside>

        </div>
        
        {/* Footer info card */}
        <footer className="mt-12 pt-6 border-t border-slate-200 text-center space-y-2">
          <p className="text-xs text-slate-400">
            In conformità alle linee guida pedagogiche scolastiche. I testi generati sono raccomandazioni bozza che il docente è invitato a convalidare prima dell'inserimento formale sul Registro Elettronico.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 text-[10px] text-slate-400/80">
            <span>Powered by Gemini 3.5 Flash &bull; DocenteAI</span>
            <span>&bull;</span>
            <span className="text-slate-400/60 font-mono tracking-wider">Autore: Gem3.5ftgL</span>
          </div>
        </footer>
      </div>

    </div>
  );
}
