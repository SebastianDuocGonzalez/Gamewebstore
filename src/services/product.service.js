import api from './api';

const API_URL = '/productos';

// Obtener todos los productos (Público)
const getAllProducts = () => {
  return api.get(API_URL);
};

// Obtener un producto por ID (Público)
const getProductById = (id) => {
  return api.get(`${API_URL}/${id}`);
};

// Crear producto (ADMIN)
// NOTA: Ya no pasamos { headers: ... } porque el interceptor lo hace.
const createProduct = (productData) => {
  return api.post(API_URL, productData);
};

// Actualizar producto (ADMIN)
const updateProduct = (id, productData) => {
  return api.put(`${API_URL}/${id}`, productData);
};

// Eliminar producto (ADMIN)
const deleteProduct = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

const ProductService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

export default ProductService;