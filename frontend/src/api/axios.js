import axios from 'axios';

// ===============================
// 🔗 CONFIGURATION DE BASE API
// ===============================
const API_BASE_URL = "https://bambou-glow-up-production-4407.up.railway.app/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  }
});


// ===============================
// 🔐 INTERCEPTEUR : INJECTION TOKEN
// ===============================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bambou_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ⚠ Automatic fix: détecter multipart et laisser Axios gérer le content-type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ===============================
// ⚠ INTERCEPTEUR : GESTION ERREURS
// ===============================
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Token expiré / invalide
          localStorage.removeItem('bambou_token');
          localStorage.removeItem('bambou_admin');

          if (!window.location.pathname.startsWith('/admin/login')) {
            window.location.href = '/admin/login';
          }
          break;

        case 403:
          console.warn('Accès refusé:', data?.message);
          break;

        case 404:
          console.warn('Ressource introuvable:', data?.message);
          break;

        case 409:
          // Ne pas spammer des erreurs système
          break;

        case 500:
          console.error('Erreur serveur:', data?.message);
          break;

        default:
          console.warn('Erreur API:', data?.message);
      }

      return Promise.reject({
        message: data?.message || "Une erreur est survenue",
        status,
        data: data?.data || null,
      });
    }

    // ============================
    // 🌐 Erreurs réseau
    // ============================
    if (error.request) {
      console.error("Erreur réseau:", error.message);
      return Promise.reject({
        message: "Problème de connexion réseau",
        status: 0,
      });
    }

    // ============================
    // ❌ Erreur interne inconnue
    // ============================
    console.error("Erreur interne:", error.message);

    return Promise.reject({
      message: "Une erreur inattendue est survenue",
      status: -1,
    });
  }
);


// ===============================
// 🔧 FONCTIONS UTILITAIRES AUTH
// ===============================
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
