import api from './api';

const API_URL = '/ordenes';

// Crear una nueva orden (Checkout del carrito)
const createOrder = (items) => {
  // El backend espera una lista de objetos. 
  // Aseguramos que los datos vayan limpios.
  const orderItems = items.map(item => ({
    id: item.id,
    nombre: item.nombre,
    precio: item.precio,
    cantidad: item.cantidad
  }));
  
  return api.post(API_URL, orderItems);
};

// Obtener órdenes del usuario logueado (Historial de compras)
const getMyOrders = () => {
  return api.get(`${API_URL}/mis-ordenes`);
};

// Obtener TODAS las órdenes (Solo Admin/Trabajador)
const getAllOrders = () => {
  return api.get(API_URL);
};

const OrderService = {
  createOrder,
  getMyOrders,
  getAllOrders
};

export default OrderService;