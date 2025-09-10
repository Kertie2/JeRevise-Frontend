export const NIVEAUX = ['6e', '5e', '4e', '3e'] as const;

export const MATIERES = [
  'Mathématiques',
//   'Français', 
  'Histoire-Géographie',
//   'Sciences et Vie de la Terre',
//   'Physique-Chimie',
  'Anglais',
//   'Espagnol',
//   'Technologie',
//   'Arts plastiques',
//   'Éducation musicale',
//   'EPS'
] as const;

export const TYPES_PROGRAMMES = [
  { id: 'normal', nom: 'Programme normal', description: 'Cours selon le programme officiel' },
  { id: 'hors_programme', nom: 'Hors programme', description: 'Contenus complémentaires' },
  { id: 'brevet', nom: 'Spécial Brevet', description: 'Sujets et préparation brevet' }
] as const;

export const STATUTS_CHAPITRE = {
  non_commence: { label: 'Non commencé', color: 'new' },
  en_cours: { label: 'En cours', color: 'warning' },
  acquis: { label: 'Acquis', color: 'info' },
  maitrise: { label: 'Maîtrisé', color: 'success' },
  a_revoir: { label: 'À revoir', color: 'error' }
} as const;

export const NIVEAUX_BADGES = {
  debutant: { nom: 'Débutant', badge: '🌱', seuil: 0 },
  progression: { nom: 'En progression', badge: '📈', seuil: 60 },
  confirme: { nom: 'Confirmé', badge: '👍', seuil: 70 },
  avance: { nom: 'Avancé', badge: '⭐', seuil: 80 },
  expert: { nom: 'Expert', badge: '🏆', seuil: 90 }
} as const;