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

  // Al cargar la página, verificamos si hay sesión guardada en localStorage
  useEffect(() => {
    // Intentamos recuperar el usuario del localStorage
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
        try {
            const parsedUser = JSON.parse(savedUser);
            dispatch({ type: 'LOGIN_SUCCESS', payload: parsedUser });
        } catch (e) {
            console.error("Error al leer usuario guardado", e);
            localStorage.removeItem('user_data');
            localStorage.removeItem('auth_token');
        }
    }
  }, []);

const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // 1. Generamos el token "Basic Auth" manualmente
      // btoa() convierte un string a Base64
      const token = 'Basic ' + btoa(email + ':' + password);

      // 2. Llamamos al servicio (Asumimos que authLogin usa axios/fetch internamente)
      // Nota: Tu auth.service debería aceptar este token o usar las credenciales para la llamada inicial.
      const userData = await authLogin(email, password); 

      // 3. ¡PASO CRÍTICO! Guardamos el token y el usuario en el navegador
      // Esto permite que otras páginas (como Crear Producto) recuperen el token.
      localStorage.setItem('auth_token', token);
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
    
    if (authLogout) authLogout(); // Llamada opcional si tu servicio hace algo extra
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