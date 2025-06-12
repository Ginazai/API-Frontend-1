import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081', // cambia según tu puerto/API
  headers: {
    'Content-Type': 'application/json',
  },
});
//request login
export const register = (formData) => api.post('/register', formData);
export const login = (credentials) => api.post('/login', credentials);
//request usuarios
export const getUsuarios = (token) =>
  api.get('/usuarios', { headers: { Authorization: `Bearer ${token}` } });
export const createUsuario = (token, formData) =>
	    api.post('/usuarios', formData, {
          headers: {
			Authorization: `Bearer ${token}` // Asegúrate de pasar el token aquí
          },
        });
export const updateUsuario = (token, id, formData) =>
	api.put(`/usuarios/${id}`, formData, {
        headers: {
			Authorization: `Bearer ${token}` // Asegúrate de pasar el token aquí
        },
	});
export const getUsuarioRoles = (token, id) =>
	api.get(`/usuarios/${id}/roles`, {
		        headers: {
            Authorization: `Bearer ${token}` // Asegúrate de pasar el token aquí
        },
    });
//request productos
export const getProductos = (token) => 
  api.get('/productos', { headers: { Authorization: `Bearer ${token}` } });
export const updateProducto = (id, formData, token) => 
  api.put(`/productos/${id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
export const createProducto = (formData, token) =>
	api.post('/productos', formData, { headers: { Authorization: `Bearer ${token}` } });
export const deleteProducto = (id, token) =>
	api.delete(`/productos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const getProductoCategorias = (id, token) => 
  api.get(`/productos/${id}/categorias`, { headers: { Authorization: `Bearer ${token}` } });
export const updateProductoCategorias = (id, formData, token) => 
  api.put(`/productos/${id}/categorias`, formData, { headers: { Authorization: `Bearer ${token}` } });
//request categorias
export const getCategorias = (token) => 
  api.get('/categorias', { headers: { Authorization: `Bearer ${token}` } });
export const createCategoria = (formData, token) =>
	api.post('/categorias', formData, { headers: { Authorization: `Bearer ${token}` } });
export const updateCategoria = (id, formData, token) =>
	api.put(`/categorias/${id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
export default api;
