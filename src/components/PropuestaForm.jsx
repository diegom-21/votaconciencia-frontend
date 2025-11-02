import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // opcional, para estilos


const PropuestaForm = ({ fetchPropuestas, onClose }) => {
    const [candidatos, setCandidatos] = useState([]);
    const [temas, setTemas] = useState([]);
    const [formData, setFormData] = useState({
        candidato_id: '',
        tema_id: '',
        titulo_propuesta: ''
    });
    const [loading, setLoading] = useState(false); // Estado para el loader
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener candidatos
        const fetchCandidatos = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/candidatos`);
                setCandidatos(response.data);
            } catch (error) {
                console.error('Error al obtener los candidatos:', error);
            }
        };

        // Obtener temas
        const fetchTemas = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/temas`);
                setTemas(response.data);
            } catch (error) {
                console.error('Error al obtener los temas:', error);
            }
        };

        fetchCandidatos();
        fetchTemas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Mostrar loader
        try {
            await axios.post('/api/propuestas', formData);

            Swal.fire({
                icon: 'success',
                title: '¡Propuesta creada!',
                text: 'El resumen fue generado correctamente.',
                timer: 2000,
                showConfirmButton: false
            });

            // Cerrar el modal tras éxito
            if (typeof onClose === 'function') {
                onClose();
            }

            // Refrescar la tabla
            if (typeof fetchPropuestas === 'function') {
                fetchPropuestas();
            }
        } catch (error) {
            console.error('Error al crear la propuesta:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al crear la propuesta. Intenta de nuevo.'
            });
        } finally {
            setLoading(false); // Ocultar loader
        }
    };


    // Mostrar mensajes si no hay datos disponibles
    const candidatosArray = Array.isArray(candidatos) ? candidatos : [];
    const temasArray = Array.isArray(temas) ? temas : [];

    return (
        <div className="container mx-auto p-4">
            {loading && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center space-y-4">
                        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                        <p className="text-lg font-semibold text-gray-700">Generando resumen con IA...</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Seleccionar Candidato</label>
                    <select
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        value={formData.candidato_id}
                        onChange={(e) => setFormData({ ...formData, candidato_id: e.target.value })}
                        required
                    >
                        <option value="">Seleccione un candidato</option>
                        {candidatosArray.length > 0 ? (
                            candidatosArray.map((candidato) => (
                                <option key={candidato.candidato_id} value={candidato.candidato_id}>
                                    {candidato.nombre} {candidato.apellido}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No hay candidatos disponibles</option>
                        )}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Seleccionar Tema</label>
                    <select
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        value={formData.tema_id}
                        onChange={(e) => setFormData({ ...formData, tema_id: e.target.value })}
                        required
                    >
                        <option value="">Seleccione un tema</option>
                        {temasArray.length > 0 ? (
                            temasArray.map((tema) => (
                                <option key={tema.tema_id} value={tema.tema_id}>
                                    {tema.nombre_tema}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>No hay temas disponibles</option>
                        )}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Título de la Propuesta</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        value={formData.titulo_propuesta}
                        onChange={(e) => setFormData({ ...formData, titulo_propuesta: e.target.value })}
                        required
                    />
                </div>
                <p className="text-sm text-gray-500">El resumen será generado automáticamente por la IA.</p>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Crear Propuesta
                </button>
            </form>
        </div>
    );
};

export default PropuestaForm;
