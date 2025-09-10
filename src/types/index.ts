export interface User {
    id: number;
    nom: string;
    prenom: string;
    email?: string;
    identifiant?: string;
    role: 'professeur' | 'eleve';
    premiere_connexion?: boolean;
    first_login?: boolean;
    classe_id?: number;
  }
  
  export interface Classe {
    id: number;
    niveau: '6e' | '5e' | '4e' | '3e' | 'brevet';
    nom: string;
  }
  
  export interface Matiere {
    id: number;
    nom: string;
  }
  
  export interface Cours {
    id: number;
    titre: string;
    matiere: string;
    chapitre: string;
    fichier_url?: string;
    texte_ocr?: string;
    id_professeur: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface QCM {
    id: number;
    question: string;
    reponse_1: string;
    reponse_2: string;
    reponse_3: string;
    reponse_4: string;
    bonne_reponse: number;
    id_chapitre: string;
    id_professeur: number;
    valide: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface Score {
    id: number;
    id_eleve: number;
    id_qcm: number;
    reponse: number;
    correcte: boolean;
    temps_reponse?: number;
    created_at: string;
  }
  
  export interface DashboardStats {
    cours_crees: number;
    qcm_generes: number;
    qcm_valides: number;
    total_reponses_eleves: number;
    taux_validation_qcm: number;
  }
  
  export interface ChapitreProgression {
    nom: string;
    total_qcm: number;
    qcm_repondus: number;
    bonnes_reponses: number;
    pourcentage_completion: number;
    pourcentage_reussite: number;
    statut: 'non_commence' | 'en_cours' | 'maitrise' | 'acquis' | 'a_revoir';
  }