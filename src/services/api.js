import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_BASE_URL = `${API_URL}/api`;

// Configuración global de axios
axios.defaults.baseURL = API_BASE_URL;

// Endpoints para Candidatos
export const candidatosApi = {
    getAll: () => axios.get('/candidatos'),
    getById: (id) => axios.get(`/candidatos/${id}`),
    create: (data) => axios.post('/candidatos', data),
    update: (id, data) => axios.put(`/candidatos/${id}`, data),
    delete: (id) => axios.delete(`/candidatos/${id}`)
};

// Endpoints para Partidos
export const partidosApi = {
    getAll: () => axios.get('/partidos'),
    getById: (id) => axios.get(`/partidos/${id}`),
    create: (data) => axios.post('/partidos', data),
    update: (id, data) => axios.put(`/partidos/${id}`, data),
    delete: (id) => axios.delete(`/partidos/${id}`)
};

// Endpoints para Temas
export const temasApi = {
    getAll: () => axios.get('/temas'),
    getById: (id) => axios.get(`/temas/${id}`),
    create: (data) => axios.post('/temas', data),
    update: (id, data) => axios.put(`/temas/${id}`, data),
    delete: (id) => axios.delete(`/temas/${id}`)
};

// Endpoints para Propuestas
export const propuestasApi = {
    getAll: () => axios.get('/propuestas'),
    getById: (id) => axios.get(`/propuestas/${id}`),
    create: (data) => axios.post('/propuestas', data),
    update: (id, data) => axios.put(`/propuestas/${id}`, data),
    delete: (id) => axios.delete(`/propuestas/${id}`)
};

// Endpoints para Historial Político
export const historialApi = {
    getByCandidato: (candidatoId) => axios.get(`/historial/candidato/${candidatoId}`),
    create: (data) => axios.post('/historial', data),
    update: (id, data) => axios.put(`/historial/${id}`, data),
    delete: (id) => axios.delete(`/historial/${id}`)
};

export default {
    candidatosApi,
    partidosApi,
    temasApi,
    propuestasApi,
    historialApi
};