import api from './api';
import { getAuthHeader } from './auth.service';

const API_URL = '/productos';

// Obtener todos los productos (Público)
const getAllProducts = () => {
  return api.get(API_URL);
};

// Obtener un producto por ID (Público)
const getProductById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

// Crear producto (ADMIN - Requiere Auth)
const createProduct = (productData) => {
  return api.post(API_URL, productData, {
    headers: getAuthHeader() // <--- ¡Aquí está la magia! Enviamos el token
  });
};

// Actualizar producto (ADMIN - Requiere Auth)
const updateProduct = (id, productData) => {
  return api.put(`${API_URL}/${id}`, productData, {
    headers: getAuthHeader()
  });
};

// Eliminar producto (ADMIN - Requiere Auth)
const deleteProduct = (id) => {
  return api.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader()
  });
};

const ProductService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

export default ProductService;