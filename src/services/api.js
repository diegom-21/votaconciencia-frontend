import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Cliente axios configurado
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Configuración global de axios
axios.defaults.baseURL = API_URL;



// Función para construir URL de imágenes
export const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return null;
    }
    
    // Si la ruta ya es completa (comienza con http), devolverla tal como está
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Si la ruta comienza con /uploads/, construir URL completa
    if (imagePath.startsWith('/uploads/')) {
        const fullUrl = `${API_URL}${imagePath}`;
        return fullUrl;
    }
    
    // Lógica adicional para limpiar y formatear la ruta (si es necesario)
    let cleanPath = imagePath;
    if (imagePath.startsWith('uploads/')) {
        cleanPath = imagePath.substring(8); // Remover "uploads/"
    }
    if (imagePath.startsWith('images/')) {
        cleanPath = `images/${cleanPath}`;
    } else if (!cleanPath.startsWith('images/')) {
        cleanPath = `images/${cleanPath}`;
    }
    
    // Nota: Usamos API_URL aquí para que use la variable de entorno
    // y no el hardcode 'http://localhost:3000'
    const fullUrl = `${API_URL}/uploads/${cleanPath}`; 
    
    return fullUrl;
};



// Endpoints para Candidatos
export const candidatosApi = {
    getAll: () => axios.get('/api/candidatos'),
    getById: (id) => axios.get(`/api/candidatos/${id}`),
    create: (data) => axios.post('/api/candidatos', data),
    update: (id, data) => axios.put(`/api/candidatos/${id}`, data),
    delete: (id) => axios.delete(`/api/candidatos/${id}`)
};

// Endpoints para Partidos
export const partidosApi = {
    getAll: () => axios.get('/api/partidos'),
    getById: (id) => axios.get(`/api/partidos/${id}`),
    create: (data) => axios.post('/api/partidos', data),
    update: (id, data) => axios.put(`/api/partidos/${id}`, data),
    delete: (id) => axios.delete(`/api/partidos/${id}`)
};

// Endpoints para Temas
export const temasApi = {
    getAll: () => axios.get('/api/temas'),
    getById: (id) => axios.get(`/api/temas/${id}`),
    create: (data) => axios.post('/api/temas', data),
    update: (id, data) => axios.put(`/api/temas/${id}`, data),
    delete: (id) => axios.delete(`/api/temas/${id}`)
};

// Endpoints para Propuestas
export const propuestasApi = {
    getAll: () => axios.get('/api/propuestas'),
    getById: (id) => axios.get(`/api/propuestas/${id}`),
    create: (data) => axios.post('/api/propuestas', data),
    update: (id, data) => axios.put(`/api/propuestas/${id}`, data),
    delete: (id) => axios.delete(`/api/propuestas/${id}`)
};

// Endpoints para Historial Político
export const historialApi = {
    getByCandidato: (candidatoId) => axios.get(`/historial/candidato/${candidatoId}`),
    create: (data) => axios.post('/historial', data),
    update: (id, data) => axios.put(`/historial/${id}`, data),
    delete: (id) => axios.delete(`/historial/${id}`)
};

// Endpoints para Recursos
export const recursosApi = {
    getAll: () => axios.get('/api/recursos'),
    getById: (id) => axios.get(`/api/recursos/${id}`),
    create: (data) => axios.post('/api/recursos', data),
    update: (id, data) => axios.put(`/api/recursos/${id}`, data),
    delete: (id) => axios.delete(`/api/recursos/${id}`)
};

// Endpoints para Trivias
export const triviasApi = {
    getAllTemas: () => axios.get('/api/trivias/temas'),
    getTemaById: (id) => axios.get(`/api/trivias/temas/${id}`),
    createTema: (data) => axios.post('/api/trivias/temas', data),
    updateTema: (id, data) => axios.put(`/api/trivias/temas/${id}`, data),
    deleteTema: (id) => axios.delete(`/api/trivias/temas/${id}`),
    getPreguntasByTema: (temaId) => axios.get(`/api/trivias/preguntas/tema/${temaId}`),
    createPregunta: (data) => axios.post('/api/trivias/preguntas', data),
    updatePregunta: (preguntaId, data) => axios.put(`/api/trivias/preguntas/${preguntaId}`, data),
    deletePregunta: (preguntaId) => axios.delete(`/api/trivias/preguntas/${preguntaId}`)
};

export default {
    candidatosApi,
    partidosApi,
    temasApi,
    propuestasApi,
    historialApi
};