import React, { useState } from 'react';
import { Copy, Sparkles, RefreshCw, AlertCircle, CheckCircle, Flame, FileText } from 'lucide-react';
import { TeacherFormState } from '../types';

interface ResultPanelProps {
  staticText: string;
  aiText: string;
  isAiLoading: boolean;
  aiError: string | null;
  onGenerateAi: () => void;
  isAiStale?: boolean;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  staticText,
  aiText,
  isAiLoading,
  aiError,
  onGenerateAi,
  isAiStale = false
}) => {
  const [copiedType, setCopiedType] = useState<'static' | 'ai' | null>(null);

  const handleCopy = (text: string, type: 'static' | 'ai') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2000);
  };

  const getCharCount = (text: string) => text.length;

  return (
    <div className="space-y-6 lg:sticky lg:top-6">
      
      {/* Dynamic Comparison Panel banner */}
      <div className="bg-sky-900 text-white p-5 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-sky-800 rounded-full opacity-40 blur-xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 -translate-x-4 translate-y-4 w-32 h-32 bg-sky-500 rounded-full opacity-35 blur-xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <span className="bg-sky-500/30 text-sky-200 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border border-sky-400/20">
            Due Soluzioni a Confronto
          </span>
          <h3 className="text-lg font-bold">Confronto Statica vs. AI Fluida</h3>
          <p className="text-xs text-sky-100 leading-relaxed">
            La <strong>Soluzione Statica</strong> assembla le frasi in tempo reale. 
            La <strong>Soluzione AI Fluida</strong> rielabora le informazioni rendendole idonee, discorsive e naturali secondo il tono pedagogico o formale scelto.
          </p>
        </div>
      </div>

      {/* 2. Soluzione AI Fluida (Dynamic Option) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4 relative overflow-hidden">
        
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 relative">
              <Sparkles className="w-4 h-4" />
              {/* Pulsing indicator */}
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-indigo-500 pulse-glowing" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                Soluzione AI Fluida <span className="text-[10px] font-bold bg-indigo-50 text-indigo-705 px-1.5 py-0.5 rounded-full border border-indigo-100">Live</span>
              </h3>
              <p className="text-xs text-slate-400">Rielaborato fluidamente con Gemini 3.5</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onGenerateAi()}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-350 text-white font-bold rounded-lg text-xs shadow-xs transition-all cursor-pointer transform active:scale-98"
          >
            {isAiLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Elaborazione...
              </>
            ) : aiText ? (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                Rigenera AI
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Genera con AI
              </>
            )}
          </button>
        </div>

        {/* AI Output Area with Custom Lined notebook theme lines */}
        {isAiLoading ? (
          <div className="bg-slate-50 border border-slate-100 p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-3 min-h-[140px] animate-pulse">
            <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700">Il motore AI sta unendo i descrittori...</p>
              <p className="text-[11px] text-slate-400">Unione fluida in corso secondo il tono selezionato</p>
            </div>
          </div>
        ) : aiError ? (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-xs text-rose-800">Errore Generazione AI</span>
              <p className="text-xs text-rose-700 leading-relaxed">{aiError}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Verifica la chiave di configurazione GEMINI_API_KEY nei Secrets.
              </p>
            </div>
          </div>
        ) : aiText ? (
          <div className="space-y-3">
            {/* Lined paper simulation card */}
            <div className={`bg-[#fafbfd] border border-slate-200/80 p-6 rounded-xl text-slate-700 text-[15px] notebook-lines whitespace-pre-wrap font-medium relative shadow-inner transition-all duration-305 ${isAiStale ? 'opacity-55 saturate-50 border-amber-200' : ''}`}>
              {aiText}
              {isAiStale && (
                <div className="absolute inset-0 bg-amber-55/10 backdrop-blur-[0.5px] flex items-center justify-center pointer-events-none rounded-xl">
                  <span className="bg-amber-100/95 text-amber-900 border border-amber-300/70 shadow-xs text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                    Sincronizzazione AI in corso...
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="font-medium text-slate-400">Lunghezza: <strong>{getCharCount(aiText)}</strong> caratteri</span>
              <button
                type="button"
                onClick={() => handleCopy(aiText, 'ai')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                  copiedType === 'ai'
                    ? 'bg-green-50 border-green-200 text-green-700 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-250 text-slate-750'
                }`}
              >
                {copiedType === 'ai' ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    Copiato!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copia Proposizione AI
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-2 min-h-[140px]">
            <Sparkles className="w-7 h-7 text-slate-300" />
            <p className="text-xs font-semibold text-slate-500">Genera con AI per un testo scorrevole</p>
            <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">Trasforma la checklist spuntata in una proposizione coerente dal linguaggio fluido.</p>
          </div>
        )}
      </div>

      {/* 1. Soluzione Statica (Classical Algorithm) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-4 relative">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Soluzione Statica Automatica</h3>
              <p className="text-xs text-slate-400">Aggiornato in tempo reale</p>
            </div>
          </div>
          
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-250/60 px-2 py-0.5 rounded">
            Immediata
          </span>
        </div>

        {/* Static Output Area with Notebook theme lines */}
        <div className="space-y-3">
          <div className="bg-[#fafbfd] border border-slate-200/80 p-6 rounded-xl text-slate-600 text-[15px] notebook-lines whitespace-pre-wrap font-medium shadow-inner">
            {staticText}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="font-medium text-slate-400">Lunghezza: <strong>{getCharCount(staticText)}</strong> caratteri</span>
            <button
              type="button"
              onClick={() => handleCopy(staticText, 'static')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                copiedType === 'static'
                  ? 'bg-green-50 border-green-200 text-green-700 shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-250 text-slate-750'
              }`}
            >
              {copiedType === 'static' ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  Copiato!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copia Testo Base
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
