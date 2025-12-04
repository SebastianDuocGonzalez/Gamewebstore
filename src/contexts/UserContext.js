import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { login as authLogin, logout as authLogout, getCurrentUser } from '../services/auth.service';

const UserContext = createContext();

const initialState = {
  user: null, // Objeto usuario completo { nombre, email, rol, ... }
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGOUT':
      return { ...initialState };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Al cargar la página, verificamos si hay sesión guardada en localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    const token = localStorage.getItem('auth_token');
    if (savedUser && token) {
        try {
            const parsedUser = JSON.parse(savedUser);
            dispatch({ type: 'LOGIN_SUCCESS', payload: parsedUser });
        } catch (e) {
            localStorage.removeItem('user_data');
            localStorage.removeItem('auth_token');
            dispatch({ type: 'LOGOUT' });
        }
    } else {
        dispatch({ type: 'LOGOUT' });
    }
  }, []);

const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Usamos el auth.service que conecta con el endpoint JWT ***
      const response = await authLogin(email, password); 

     // El backend devuelve: { token: "...", rol: "ADMIN", nombre: "...", email: "..." }
      const userData = {
        nombre: response.nombre,
        email: response.email,
        rol: response.rol
      };

      // 3. ¡PASO CRÍTICO! Guardamos el token y el usuario en el navegador
      // Esto permite que otras páginas (como Crear Producto) recuperen el token.
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(userData));

      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      return { success: true, rol: userData.rol };

    } catch (error) {
      console.error("Login error:", error);
      const msg = error.response?.status === 401 
        ? 'Credenciales incorrectas' 
        : 'Error de conexión o servidor';
      
      dispatch({ type: 'SET_ERROR', payload: msg });
      return { success: false, message: msg };
    }
  };

const logout = () => {
    // Limpiamos todo al salir
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    authLogout();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  // Función Helper para verificar roles en cualquier componente
  const hasRole = (roleName) => {
    return state.user && state.user.rol === roleName;
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
    hasRole // Exportamos esta función para usarla en el Navbar y Rutas
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserContext;