import React from 'react';
import { TeacherFormState, Intensity } from '../types';
import { 
  User, 
  BookOpen, 
  Sparkles, 
  CheckSquare, 
  Square, 
  HelpCircle,
  FileText,
  Bookmark
} from 'lucide-react';

interface EvaluationFormProps {
  formState: TeacherFormState;
  onChange: (newState: TeacherFormState) => void;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({ formState, onChange }) => {
  
  const handleGenderChange = (gender: 'M' | 'F') => {
    onChange({ ...formState, studentGender: gender });
  };

  const handleTextChange = (field: 'studentName' | 'subject' | 'notes', value: string) => {
    onChange({ ...formState, [field]: value });
  };

  const handleToneChange = (tone: 'pedagogico' | 'formale' | 'sintetico') => {
    onChange({ ...formState, tone });
  };

  const handleBaseCheckedChange = (itemKey: keyof TeacherFormState) => {
    const item = formState[itemKey] as any;
    if (item && typeof item === 'object' && 'checked' in item) {
      onChange({
        ...formState,
        [itemKey]: {
          ...item,
          checked: !item.checked
        }
      });
    }
  };

  const handleIntensityChange = (itemKey: keyof TeacherFormState, intensity: Intensity) => {
    const item = formState[itemKey] as any;
    if (item && typeof item === 'object' && 'intensity' in item) {
      onChange({
        ...formState,
        [itemKey]: {
          ...item,
          intensity
        }
      });
    }
  };

  // Suboptions togglers
  const handleRielaborazioneSubToggle = (subKey: keyof typeof formState.difficolta_rielaborazione.suboptions) => {
    onChange({
      ...formState,
      difficolta_rielaborazione: {
        ...formState.difficolta_rielaborazione,
        suboptions: {
          ...formState.difficolta_rielaborazione.suboptions,
          [subKey]: !formState.difficolta_rielaborazione.suboptions[subKey]
        }
      }
    });
  };

  const handleMetodoSubToggle = (subKey: keyof typeof formState.metodo_studio.suboptions) => {
    onChange({
      ...formState,
      metodo_studio: {
        ...formState.metodo_studio,
        suboptions: {
          ...formState.metodo_studio.suboptions,
          [subKey]: !formState.metodo_studio.suboptions[subKey]
        }
      }
    });
  };

  // Preset quick fill details
  const applyPreset = () => {
    onChange({
      ...formState,
      studentName: "Luca",
      studentGender: "M",
      subject: "Matematica",
      notes: "Mostra interesse a sprazzi, ma non fa mai i compiti a casa.",
      mancanza_studio: { id: 'mancanza_studio', label: 'Mancanza di studio', checked: true, intensity: 'moderato' },
      mancanza_applicazione: { id: 'mancanza_applicazione', label: 'Mancanza di applicazione teorico-pratica', checked: true, intensity: 'grave' },
      carenze_base: { id: 'carenze_base', label: 'Carenze di base / lacune pregresse', checked: false, intensity: 'lieve' },
      difficolta_comprensione: { id: 'difficolta_comprensione', label: 'Difficoltà di comprensione dei contenuti', checked: true, intensity: 'lieve' },
      difficolta_rielaborazione: {
        id: 'difficolta_rielaborazione',
        label: 'Difficoltà di rielaborazione',
        checked: true,
        intensity: 'lieve',
        suboptions: {
          analisi: true,
          sintesi: false,
          strutturazione_logica: false,
          applicazione_conoscenze: true,
          argomentazione_scritta: false
        }
      },
      metodo_studio: {
        id: 'metodo_studio',
        label: 'Metodo di studio inadeguato',
        checked: true,
        intensity: 'moderato',
        suboptions: {
          studio_mnemonico: true,
          discontinuita_lavoro: true,
          difficolta_organizzativa: false,
          approccio_superficiale: false
        }
      },
      scarsa_partecipazione: { id: 'scarsa_partecipazione', label: 'Scarsa partecipazione in classe', checked: false, intensity: 'lieve' },
      lessico_povero: { id: 'lessico_povero', label: 'Lessico povero / produzione scritta debole', checked: false, intensity: 'lieve' },
    });
  };

  // Helper render for general items
  const renderItemRaw = (
    itemKey: keyof TeacherFormState, 
    title: string, 
    hasSuboptions: boolean = false, 
    suboptionsRender?: React.ReactNode
  ) => {
    const item = formState[itemKey] as any;
    const isChecked = item.checked;
    
    return (
      <div className={`p-4 border rounded-xl transition-all duration-200 ${isChecked ? 'bg-slate-50/50 border-slate-300 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Label + Checkbox */}
          <button 
            type="button"
            onClick={() => handleBaseCheckedChange(itemKey)} 
            className="flex items-center gap-3 text-left focus:outline-hidden group self-start sm:self-auto cursor-pointer"
          >
            {isChecked ? (
              <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                <CheckSquare className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-md border-2 border-slate-300 shrink-0 flex items-center justify-center group-hover:border-slate-400 bg-white" />
            )}
            <span className={`font-semibold text-[14px] transition-colors ${isChecked ? 'text-slate-950' : 'text-slate-600'}`}>
              {title}
            </span>
          </button>

          {/* Intensity selector as Segmented Control style */}
          <div className={`flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-end sm:self-auto transition-all duration-150 ${isChecked ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {(['lieve', 'moderato', 'grave'] as Intensity[]).map((level) => {
              const isActive = item.intensity === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleIntensityChange(itemKey, level)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-xs border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        {/* Child Suboptions */}
        {hasSuboptions && isChecked && suboptionsRender && (
          <div className="mt-4 pt-4 border-t border-slate-200/60 animate-in fade-in slide-in-from-top-1 duration-200">
            {suboptionsRender}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Student Details Widget */}
      <div className="bg-slate-55 p-5 border border-slate-200 bg-linear-to-b from-white to-slate-50/50 rounded-2xl shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" /> Profilo Studente
          </h2>
          <button 
            type="button" 
            onClick={applyPreset}
            className="text-xs text-blue-650 hover:text-blue-700 font-bold flex items-center gap-1 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1.5 rounded-lg transition-all border border-blue-100 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Carica Esempio Luca
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6 space-y-1">
            <label className="block text-xs font-semibold text-slate-600">Nome Studente / Studentessa</label>
            <input 
              type="text" 
              placeholder="E.g. Mario, Sofia, o lascia vuoto..."
              value={formState.studentName}
              onChange={(e) => handleTextChange('studentName', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-250 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-medium"
            />
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="block text-xs font-semibold text-slate-600">Genere</label>
            <div className="grid grid-cols-2 gap-1.5 p-0.5 bg-slate-200/60 border border-slate-200/80 rounded-lg">
              <button
                type="button"
                onClick={() => handleGenderChange('M')}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${formState.studentGender === 'M' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-500 hover:text-slate-900'}`}
              >
                M (Alunno)
              </button>
              <button
                type="button"
                onClick={() => handleGenderChange('F')}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${formState.studentGender === 'F' ? 'bg-white shadow-xs text-pink-700' : 'text-slate-500 hover:text-slate-900'}`}
              >
                F (Alunna)
              </button>
            </div>
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="block text-xs font-semibold text-slate-600">Materia (Opzionale)</label>
            <input 
              type="text" 
              placeholder="Italiano, Scienze..."
              value={formState.subject}
              onChange={(e) => handleTextChange('subject', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-250 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Style & Tone Selector */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-slate-500" /> Stile del linguaggio per l'AI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'pedagogico',
              title: 'Pedagogico / Costruttivo',
              desc: 'Incoraggia il miglioramento mettendo in luce i deficit con delicatezza.'
            },
            {
              id: 'formale',
              title: 'Formale / Tecnico',
              desc: 'Tono burocratico e formale adatto ai verbali scolastici ufficiali.'
            },
            {
              id: 'sintetico',
              title: 'Sintetico',
              desc: 'Giudizio ristretto e d\'impatto, ideale per limiti di caratteri (Registro elettronico).'
            }
          ].map((toneOpt) => (
            <button
              key={toneOpt.id}
              type="button"
              onClick={() => handleToneChange(toneOpt.id as any)}
              className={`p-3.5 text-left border rounded-xl transition-all cursor-pointer ${
                formState.tone === toneOpt.id 
                  ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-500/10' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="font-semibold text-sm text-slate-850">{toneOpt.title}</div>
              <div className="text-xs text-slate-500 mt-1 leading-relaxed">{toneOpt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Checklist Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-550" /> Parametri di insufficienza
          </span>
          <span className="text-slate-500 font-bold pr-5">Tono</span>
        </div>

        <div className="space-y-3">
          {/* Mancanza di studio */}
          {renderItemRaw('mancanza_studio', 'Mancanza di studio')}

          {/* Mancanza di applicazione teorico-pratica */}
          {renderItemRaw('mancanza_applicazione', 'Mancanza di applicazione teorico-pratica')}

          {/* Carenze di base */}
          {renderItemRaw('carenze_base', 'Carenze di base / lacune pregresse')}

          {/* Difficoltà di comprensione dei contenuti */}
          {renderItemRaw('difficolta_comprensione', 'Difficoltà di comprensione dei contenuti')}

          {/* Difficoltà di rielaborazione (Con sotto voci) */}
          {renderItemRaw(
            'difficolta_rielaborazione', 
            'Difficoltà di rielaborazione', 
            true,
            (
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-500 mb-1">Seleziona sotto-aspetti deficitari:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'analisi', label: 'Analisi' },
                    { key: 'sintesi', label: 'Sintesi' },
                    { key: 'strutturazione_logica', label: 'Strutturazione logica' },
                    { key: 'applicazione_conoscenze', label: 'Applicazione delle conoscenze' },
                    { key: 'argomentazione_scritta', label: 'Argomentazione scritta' }
                  ].map((subOpt) => {
                    const isSubChecked = (formState.difficolta_rielaborazione.suboptions as any)[subOpt.key];
                    return (
                      <button
                        key={subOpt.key}
                        type="button"
                        onClick={() => handleRielaborazioneSubToggle(subOpt.key as any)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                          isSubChecked 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {subOpt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          )}

          {/* Metodo di studio inadeguato (Con sotto voci) */}
          {renderItemRaw(
            'metodo_studio', 
            'Metodo di studio inadeguato', 
            true,
            (
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-500 mb-1">Seleziona sotto-aspetti deficitari:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'studio_mnemonico', label: 'Studio mnemonico' },
                    { key: 'discontinuita_lavoro', label: 'Discontinuità nel lavoro' },
                    { key: 'difficolta_organizzativa', label: 'Difficoltà organizzativa' },
                    { key: 'approccio_superficiale', label: 'Approccio superficiale' }
                  ].map((subOpt) => {
                    const isSubChecked = (formState.metodo_studio.suboptions as any)[subOpt.key];
                    return (
                      <button
                        key={subOpt.key}
                        type="button"
                        onClick={() => handleMetodoSubToggle(subOpt.key as any)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                          isSubChecked 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {subOpt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          )}

          {/* Scarsa partecipazione in classe */}
          {renderItemRaw('scarsa_partecipazione', 'Scarsa partecipazione in classe')}

          {/* Lessico povero / produzione scritta debole */}
          {renderItemRaw('lessico_povero', 'Lessico povero / produzione scritta debole')}
        </div>
      </div>

      {/* Note Libere (Opzionale) */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs space-y-2">
        <label className="block text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" /> Note libere (Opzionale)
        </label>
        <span className="block text-xs text-slate-500">
          Aggiungi un contesto speciale (es. "alunno straniero", "ha mostrato impegno solo a fine quadrimestre", ecc.) o dettagli specifici che vuoi far rielaborare all'AI.
        </span>
        <textarea
          rows={3}
          placeholder="Aggiungi contesto aggiuntivo..."
          value={formState.notes}
          onChange={(e) => handleTextChange('notes', e.target.value)}
          className="w-full mt-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
        />
      </div>

    </div>
  );
};
