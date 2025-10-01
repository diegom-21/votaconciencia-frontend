import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PropuestaForm = () => {
    const [candidatos, setCandidatos] = useState([]);
    const [temas, setTemas] = useState([]);
    const [formData, setFormData] = useState({
        candidato_id: '',
        tema_id: '',
        titulo_propuesta: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener candidatos
        const fetchCandidatos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/candidatos');
                setCandidatos(response.data);
            } catch (error) {
                console.error('Error al obtener los candidatos:', error);
            }
        };

        // Obtener temas
        const fetchTemas = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/temas');
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
        try {
            await axios.post('/api/propuestas', formData);
            alert('Propuesta creada exitosamente');
            navigate('/admin/propuestas');
        } catch (error) {
            console.error('Error al crear la propuesta:', error);
            alert('Hubo un error al crear la propuesta');
        }
    };

    // Mostrar mensajes si no hay datos disponibles
    const candidatosArray = Array.isArray(candidatos) ? candidatos : [];
    const temasArray = Array.isArray(temas) ? temas : [];

    return (
        <div className="container mx-auto p-4">
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
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Crear Propuesta
                </button>
            </form>
        </div>
    );
};

export default PropuestaForm;
