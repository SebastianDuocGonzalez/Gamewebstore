import axios from 'axios';

// Si existe la variable de entorno (Render), usa esa. Si no, usa localhost, ideal para desarrollo local.
const BASE_URL = process.env.REACT_APP_API_URL || 'https://gameplaystore.onrender.com/api/v1';
//const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTOR DE SOLICITUDES (REQUEST) ---
// Antes de enviar cualquier petición, verifica si hay token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Inyectamos el token Bearer automáticamente
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR DE RESPUESTAS (RESPONSE) ---
// Si el token expiró (403/401), podemos cerrar sesión automáticamente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Opcional: Si el token vence, forzar logout
        // localStorage.removeItem('token');
        // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;