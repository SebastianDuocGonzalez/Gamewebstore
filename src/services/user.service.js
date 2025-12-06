import api from './api';

// Obtener todos los usuarios (Solo ADMIN)
const getAllUsers = () => {
  return api.get('/users'); 
};

// Cambiar rol de usuario (Solo ADMIN)
const changeUserRole = (id, newRole) => {
  return api.put(`/users/${id}/rol`, { rol: newRole });
};

// Eliminar usuario (Solo ADMIN)
const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};

const UserService = {
  getAllUsers,
  changeUserRole,
  deleteUser
};

export default UserService;