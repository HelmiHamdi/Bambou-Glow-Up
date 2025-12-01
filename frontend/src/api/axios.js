import axios from 'axios';

// Configuration de base de l'API
const API_BASE_URL = "https://bambou-glow-up-production.up.railway.app/api";
const API = axios.create({
  baseURL:API_BASE_URL,
    headers: {
    "Content-Type": "application/json",
    }
});


// Intercepteur pour ajouter le token aux requêtes
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bambou_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs HTTP
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expiré ou invalide
          localStorage.removeItem('bambou_token');
          localStorage.removeItem('bambou_admin');
          if (window.location.pathname !== '/admin/login') {
            window.location.href = '/admin/login';
          }
          break;
          
        case 403:
          console.error('Accès refusé:', data.message);
          break;
          
        case 404:
          console.error('Ressource non trouvée:', data.message);
          break;
          
        case 409:
          // CORRECTION : Ne pas logger l'erreur 409 (conflit d'email) comme une erreur système
          // Cette erreur est gérée spécifiquement dans le composant
          break;
          
        case 500:
          console.error('Erreur serveur:', data.message);
          break;
          
        default:
          console.error('Erreur:', data.message);
      }
      
      // Retourner l'erreur formatée
      return Promise.reject({
        message: data.message || 'Une erreur est survenue',
        status,
        data: data.data || null
      });
    } else if (error.request) {
      // Erreur réseau
      console.error('Erreur réseau:', error.message);
      return Promise.reject({
        message: 'Problème de connexion réseau',
        status: 0
      });
    } else {
      // Autre erreur
      console.error('Erreur:', error.message);
      return Promise.reject({
        message: 'Une erreur inattendue est survenue',
        status: -1
      });
    }
  }
);

// Méthodes utilitaires
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('bambou_token', token);
  } else {
    localStorage.removeItem('bambou_token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('bambou_token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('bambou_token');
  localStorage.removeItem('bambou_admin');
};

export default API;