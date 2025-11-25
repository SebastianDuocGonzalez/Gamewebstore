import api from './api';

// Función para codificar usuario:contraseña a Base64

export const login = async (email, password) => {
  const token = 'Basic ' + window.btoa(email + ":" + password);
  
  try {
    // Usamos 'api' en lugar de 'axios'
    // Ya no hace falta poner la URL completa, solo la parte final
    const response = await api.get('/auth/me', {
      headers: { Authorization: token } // Aquí sí lo pasamos explícito porque aún no está en localStorage
    });
    
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('auth_token', token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('auth_token');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    return { Authorization: token };
  } else {
    return {};
  }
  
};

export const register = async (userData) => {
  try {
    // userData debe ser un objeto: { nombre, email, password }
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    // Propagamos el error para manejarlo en la vista
    throw error;
  }
};