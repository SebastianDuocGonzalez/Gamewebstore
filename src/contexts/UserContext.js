import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { login as authLogin, logout as authLogout, getCurrentUser } from '../services/auth.service';

const UserContext = createContext();

const initialState = {
  user: null, // Objeto usuario completo { nombre, email, rol, ... }
  isAuthenticated: false,
  isLoading: false,
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

  // Al cargar la página, verificamos si hay sesión guardada
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    }
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const userData = await authLogin(email, password);
      // userData debe venir del backend con el campo "rol" (ADMIN, TRABAJADOR, CLIENTE)
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      return { success: true, rol: userData.rol };
    } catch (error) {
      const msg = error.response?.status === 401 ? 'Credenciales incorrectas' : 'Error de conexión';
      dispatch({ type: 'SET_ERROR', payload: msg });
      return { success: false, message: msg };
    }
  };

  const logout = () => {
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