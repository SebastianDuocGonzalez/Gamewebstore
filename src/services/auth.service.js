import api from './api';

// Login contra endpoint JWT ***

export const login = async (email, password) => {
  
  //Login contra endpoint JWT ***
  // El backend JWT espera { email, password } en el body.
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Devuelve { token, rol, nombre, email }
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
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
