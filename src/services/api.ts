import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs d'auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/connexion';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: any, role: string) => {
    const endpoint = role === 'professeur' ? '/auth/login-prof' : '/auth/login-eleve';
    return api.post(endpoint, credentials);
  },
  register: (data: any, role: string) => {
    const endpoint = role === 'professeur' ? '/auth/register-prof' : '/auth/register-eleve';
    return api.post(endpoint, data);
  },
  getMatieres: () => api.get('/auth/matieres'),
  getClasses: () => api.get('/auth/classes'),
  configurerProfesseur: (data: any) => api.put('/auth/configurer-prof', data),
  setClasseEleve: (classe_id: number) => api.put('/auth/set-classe', { classe_id }),
};

export const coursAPI = {
  getMesCours: () => api.get('/cours/mes-cours'),
  creerCours: (formData: FormData) => api.post('/cours', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  creerCoursSpecial: (formData: FormData) => api.post('/cours/special', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getCoursParProgramme: (params: any) => api.get('/cours/par-programme', { params }),
};

export const qcmAPI = {
  traiterCours: (data: any) => api.post('/qcm/traiter-cours', data),
  getQCMEnAttente: () => api.get('/qcm/en-attente'),
  validerQCM: (qcm_id: number, data: any) => api.put(`/qcm/${qcm_id}/valider`, data),
  regenererQCM: (data: any) => api.post('/qcm/regenerer', data),
  getDashboardQCM: () => api.get('/qcm/dashboard'),
  getSuiviEleves: (params?: any) => api.get('/qcm/suivi-eleves', { params }),
  getDetailEleve: (eleve_id: number) => api.get(`/qcm/eleve/${eleve_id}`),
  getAnalyseClasses: () => api.get('/qcm/analyse-classes'),
  getQCMValidesParChapitre: (params: any) => api.get('/qcm/chapitre', { params }),
};

export const eleveAPI = {
  soumettreReponse: (data: any) => api.post('/eleve/reponse', data),
  getQCMDisponibles: (params: any) => api.get('/eleve/qcm', { params }),
  getChapitresDisponibles: () => api.get('/eleve/chapitres'),
  getDashboard: () => api.get('/eleve/dashboard'),
  getModeRevision: (params?: any) => api.get('/eleve/revision', { params }),
};

export const dashboardAPI = {
  getProfesseur: () => api.get('/dashboard/professeur'),
};

export const niveauAPI = {
  getQCMParNiveau: (params: any) => api.get('/niveau/qcm', { params }),
  getStatistiquesNiveau: () => api.get('/niveau/statistiques'),
};

export default api;