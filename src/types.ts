export type Intensity = 'lieve' | 'moderato' | 'grave';

export interface BaseItem {
  id: string;
  label: string;
  checked: boolean;
  intensity: Intensity;
}

export interface RielaborazioneSuboptions {
  analisi: boolean;
  sintesi: boolean;
  strutturazione_logica: boolean;
  applicazione_conoscenze: boolean;
  argomentazione_scritta: boolean;
}

export interface MetodoSuboptions {
  studio_mnemonico: boolean;
  discontinuita_lavoro: boolean;
  difficolta_organizzativa: boolean;
  approccio_superficiale: boolean;
}

export interface TeacherFormState {
  studentName: string;
  studentGender: 'M' | 'F';
  subject: string;
  tone: 'pedagogico' | 'formale' | 'sintetico';
  
  // Base items
  mancanza_studio: BaseItem;
  mancanza_applicazione: BaseItem;
  carenze_base: BaseItem;
  difficolta_comprensione: BaseItem;
  
  // Items with suboptions
  difficolta_rielaborazione: BaseItem & {
    suboptions: RielaborazioneSuboptions;
  };
  metodo_studio: BaseItem & {
    suboptions: MetodoSuboptions;
  };
  
  scarsa_partecipazione: BaseItem;
  lessico_povero: BaseItem;
  
  // Custom notes
  notes: string;
}

export interface GenerationRequest {
  formState: TeacherFormState;
}

export interface GenerationResponse {
  staticText: string;
  aiText?: string;
  error?: string;
}
