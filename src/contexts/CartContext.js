import React, { createContext, useContext, useReducer, useEffect } from 'react';

// =========================
// Cart Context - Manejo del estado del carrito
// =========================

const CartContext = createContext();

// Estados del carrito
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null
};

// Reducer para manejar acciones del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null
      };

    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let newItems;
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, cantidad: 1 }];
      }
      
      return {
        ...state,
        items: newItems,
        error: null
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, cantidad: action.payload.cantidad }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        error: null
      };

    case 'CALCULATE_TOTALS':
      const itemCount = state.items.reduce((total, item) => total + item.cantidad, 0);
      const total = state.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
      
      return {
        ...state,
        itemCount,
        total
      };

    default:
      return state;
  }
};

// Provider del contexto del carrito
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem('gamezone-cart');
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: cartData });
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Error al cargar el carrito' });
      }
    };

    loadCartFromStorage();
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('gamezone-cart', JSON.stringify(state.items));
    } else {
      localStorage.removeItem('gamezone-cart');
    }
  }, [state.items]);

  // Calcular totales cuando cambien los items
  useEffect(() => {
    dispatch({ type: 'CALCULATE_TOTALS' });
  }, [state.items]);

  // Funciones del carrito
  const addToCart = (product) => {
    try {
      dispatch({ type: 'ADD_ITEM', payload: product });
      return { success: true, message: 'Producto agregado al carrito' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al agregar producto al carrito' });
      return { success: false, message: 'Error al agregar producto al carrito' };
    }
  };

  const removeFromCart = (productId) => {
    try {
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
      return { success: true, message: 'Producto eliminado del carrito' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar producto del carrito' });
      return { success: false, message: 'Error al eliminar producto del carrito' };
    }
  };

  const updateQuantity = (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }
      
      dispatch({ 
        type: 'UPDATE_QUANTITY', 
        payload: { id: productId, cantidad: quantity } 
      });
      return { success: true, message: 'Cantidad actualizada' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al actualizar cantidad' });
      return { success: false, message: 'Error al actualizar cantidad' };
    }
  };

  const clearCart = () => {
    try {
      dispatch({ type: 'CLEAR_CART' });
      return { success: true, message: 'Carrito vaciado' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al vaciar carrito' });
      return { success: false, message: 'Error al vaciar carrito' };
    }
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.cantidad : 0;
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  // Calcular descuento Duoc (20% para emails @duocuc.cl)
  const calculateDiscount = (userEmail) => {
    if (userEmail && userEmail.includes('@duocuc.cl')) {
      return state.total * 0.2;
    }
    return 0;
  };

  // Calcular total con descuento
  const calculateTotalWithDiscount = (userEmail) => {
    const discount = calculateDiscount(userEmail);
    return state.total - discount;
  };

  const value = {
    // Estado
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    isLoading: state.isLoading,
    error: state.error,
    
    // Funciones
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    calculateDiscount,
    calculateTotalWithDiscount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export default CartContext;
