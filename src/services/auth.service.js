import api from './api';

// Login contra endpoint JWT ***

export const login = async (email, password) => {
  try {
    // Ya NO usamos btoa() ni "Basic". Enviamos las credenciales limpias al backend.
    // El backend las validará y nos devolverá un Token JWT real.
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.token) {
      // Guardamos el token JWT puro (sin "Bearer ", el api.js se encargará de eso)
      localStorage.setItem('auth_token', response.data.token);
      
      // Guardamos datos del usuario
      const userData = {
        nombre: response.data.nombre,
        email: response.data.email,
        rol: response.data.rol
      };
      localStorage.setItem('user_data', JSON.stringify(userData));
    }
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
  // Se deja vacio pues el interceptor ya inyecta el token
  // Se mantiene para evitar el tener que ir codigoc por codigo y eliminar su uso
    return {};
};
