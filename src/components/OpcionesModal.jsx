import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OpcionesModal = ({ isOpen, onClose, preguntaId }) => {
    const [opciones, setOpciones] = useState([]);
    const [opcionesEditadas, setOpcionesEditadas] = useState([]);
    const [nuevaOpcion, setNuevaOpcion] = useState({ texto_opcion: '', es_correcta: false });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && preguntaId) {
            fetchOpciones();
        }
    }, [isOpen, preguntaId]);

    const fetchOpciones = async () => {
        try {
            const response = await axios.get(`/api/trivias/opciones/pregunta/${preguntaId}`);
            setOpciones(response.data);
            setOpcionesEditadas(response.data);
        } catch (error) {
            console.error('Error al obtener las opciones:', error);
            setError('Error al cargar las opciones');
        }
    };

    const handleUpdateOpcionLocal = (opcionId, nuevosDatos) => {
        setOpcionesEditadas(prev => 
            prev.map(opcion => 
                opcion.opcion_id === opcionId ? { ...opcion, ...nuevosDatos } : opcion
            )
        );
    };

    const handleAddOpcionLocal = () => {
        if (!nuevaOpcion.texto_opcion.trim()) return;
        
        const nuevaOpcionConId = {
            ...nuevaOpcion,
            opcion_id: `temp_${Date.now()}`,
            pregunta_id: preguntaId,
            isNew: true
        };
        
        setOpcionesEditadas(prev => [...prev, nuevaOpcionConId]);
        setNuevaOpcion({ texto_opcion: '', es_correcta: false });
    };

    const handleDeleteOpcionLocal = (opcionId) => {
        setOpcionesEditadas(prev => prev.filter(o => o.opcion_id !== opcionId));
    };

    const handleGuardarCambios = async () => {
        setLoading(true);
        setError('');
        
        try {
            // Primero eliminar opciones que ya no están
            const opcionesOriginalesIds = opciones.map(o => o.opcion_id);
            const opcionesEditadasIds = opcionesEditadas.filter(o => !o.isNew).map(o => o.opcion_id);
            const opcionesParaEliminar = opcionesOriginalesIds.filter(id => !opcionesEditadasIds.includes(id));
            
            for (const opcionId of opcionesParaEliminar) {
                await axios.delete(`/api/trivias/opciones/${opcionId}`);
            }
            
            // Actualizar opciones existentes
            for (const opcion of opcionesEditadas.filter(o => !o.isNew)) {
                await axios.put(`/api/trivias/opciones/${opcion.opcion_id}`, {
                    texto_opcion: opcion.texto_opcion,
                    es_correcta: opcion.es_correcta
                });
            }
            
            // Crear nuevas opciones
            for (const opcion of opcionesEditadas.filter(o => o.isNew)) {
                await axios.post('/api/trivias/opciones', {
                    pregunta_id: preguntaId,
                    texto_opcion: opcion.texto_opcion,
                    es_correcta: opcion.es_correcta
                });
            }
            
            setSuccessMessage('Cambios guardados exitosamente');
            await fetchOpciones();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            setError('Error al guardar los cambios');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-gray-900">Opciones de la Pregunta</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
                            <p className="text-sm text-green-700">{successMessage}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {opcionesEditadas.map((opcion, index) => (
                            <div key={opcion.opcion_id} className={`p-4 rounded-lg border ${opcion.es_correcta ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name={`opcion_${preguntaId}`}
                                            checked={opcion.es_correcta}
                                            onChange={(e) => {
                                                // Solo una opción puede ser correcta
                                                const nuevasOpciones = opcionesEditadas.map((opt, idx) => ({
                                                    ...opt,
                                                    es_correcta: idx === index
                                                }));
                                                setOpcionesEditadas(nuevasOpciones);
                                            }}
                                            className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                                        />
                                        <label className="ml-2 text-sm text-gray-600">
                                            {opcion.es_correcta ? 'Correcta' : 'Incorrecta'}
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={opcion.texto_opcion}
                                        onChange={(e) => handleUpdateOpcionLocal(opcion.opcion_id, {
                                            texto_opcion: e.target.value
                                        })}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0D80F2] focus:border-[#0D80F2] text-sm"
                                        placeholder="Texto de la opción"
                                    />
                                    <button
                                        onClick={() => handleDeleteOpcionLocal(opcion.opcion_id)}
                                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                                        title="Eliminar opción"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Formulario para nueva opción */}
                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                            <div className="flex items-center space-x-3">
                                
                                <input
                                    type="text"
                                    value={nuevaOpcion.texto_opcion}
                                    onChange={(e) => setNuevaOpcion({
                                        ...nuevaOpcion,
                                        texto_opcion: e.target.value
                                    })}
                                    placeholder="Nueva opción"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-[#0D80F2] focus:border-[#0D80F2] text-sm"
                                />
                                <button
                                    onClick={handleAddOpcionLocal}
                                    disabled={!nuevaOpcion.texto_opcion.trim()}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] rounded-md hover:bg-[#0A6AC8] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-lg">
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cerrar
                        </button>
                        <button
                            onClick={handleGuardarCambios}
                            disabled={loading}
                            className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                            {loading && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                            )}
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpcionesModal;
