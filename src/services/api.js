import axios from 'axios';

// 1. Definir la URL base
// Si existe la variable de entorno (Render), usa esa. Si no, usa localhost, ideal para desarrollo local.
const BASE_URL = process.env.REACT_APP_API_URL || 'https://gameplaystore.onrender.com/api/v1';
//const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';
// 2. Crear instancia de Axios configurada
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Interceptor Mágico (Opcional pero recomendado)
// Esto inyecta el Token de Auth en CADA petición automáticamente.
// Ya no tendrás que poner { headers: getAuthHeader() } en cada llamada.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;