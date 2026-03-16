import axios from 'axios';

// Instancia base de axios para todas las llamadas a la API
const api = axios.create({
    baseURL: '/api',
    timeout: 30000,
});

// Interceptor: agrega automáticamente el JWT en cada request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor: manejo global de errores 401 (sesión expirada)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ── Memoriales ───────────────────────────────────────────────────────────────
export const crearMemorial = (datos) => api.post('/memorials', datos);
export const obtenerMemorial = (slug) => api.get(`/memorials/${slug}`);
export const listarMisMemoriales = () => api.get('/memorials');
export const actualizarTema = (id, tema, colorFondo) =>
    api.put(`/memorials/${id}/theme`, { tema, colorFondo });

export const subirFotos = (id, formData) =>
    api.post(`/memorials/${id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const subirVideo = (id, formData) =>
    api.post(`/memorials/${id}/videos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const subirMusica = (id, formData) =>
    api.post(`/memorials/${id}/music`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const eliminarFoto = (memorialId, fotoId) =>
    api.delete(`/memorials/${memorialId}/photos/${fotoId}`);

export const actualizarMemorial = (id, datos) => api.put(`/memorials/${id}`, datos);
export const eliminarMemorial = (id) => api.delete(`/memorials/${id}`);
export const actualizarFoto = (memorialId, fotoId, datos) => api.put(`/memorials/${memorialId}/photos/${fotoId}`, datos);
export const actualizarVideo = (memorialId, videoId, datos) => api.put(`/memorials/${memorialId}/videos/${videoId}`, datos);
export const eliminarVideo = (memorialId, videoId) => api.delete(`/memorials/${memorialId}/videos/${videoId}`);
export const eliminarMusica = (id) => api.delete(`/memorials/${id}/music`);
// ── Auth ─────────────────────────────────────────────────────────────────────
export const registrar = (datos) => api.post('/auth/register', datos);
export const login = (datos) => api.post('/auth/login', datos);
export const obtenerPerfil = () => api.get('/auth/me');

// ── QR ───────────────────────────────────────────────────────────────────────
export const obtenerQRData = (slug) => api.get(`/qr/${slug}/data`);

// ── Pagos (Suscripciones) ────────────────────────────────────────────────────
export const crearPreferenciaPago = (planId) => api.post('/payments/create-preference', { planId });

// ── Admin ────────────────────────────────────────────────────────────────────
export const obtenerUsuariosAdmin = () => api.get('/admin/usuarios');
export const actualizarPlanAdmin = (userId, datos) => api.put(`/admin/usuarios/${userId}`, datos);
export const eliminarUsuarioAdmin = (userId) => api.delete(`/admin/usuarios/${userId}`);

export default api;
