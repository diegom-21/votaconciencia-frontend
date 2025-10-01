import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Modal from './Modal';

const HistorialSection = ({ candidatoId, onClose }) => {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHistorial, setEditingHistorial] = useState(null);

    useEffect(() => {
        if (candidatoId) {
            fetchHistorial();
        }
    }, [candidatoId]);

    const fetchHistorial = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`http://localhost:3000/api/historial/candidato/${candidatoId}`);
            setHistorial(response.data);
        } catch (error) {
            console.error('Error al cargar historial:', error);
            setError('Error al cargar el historial político');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setError(null);
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            if (editingHistorial) {
                await axios.put(
                    `http://localhost:3000/api/historial/${editingHistorial.historial_id}`, 
                    formData,
                    { headers }
                );
            } else {
                await axios.post(
                    'http://localhost:3000/api/historial', 
                    { ...formData, candidato_id: candidatoId },
                    { headers }
                );
            }
            setIsModalOpen(false);
            fetchHistorial();
        } catch (error) {
            console.error('Error al guardar el historial:', error);
            setError('Error al guardar el registro');
        }
    };

    const handleDelete = async (historialId) => {
        if (window.confirm('¿Está seguro de que desea eliminar este registro histórico?')) {
            try {
                setError(null);
                const token = localStorage.getItem("token");
                await axios.delete(
                    `http://localhost:3000/api/historial/${historialId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                fetchHistorial();
            } catch (error) {
                console.error('Error al eliminar el registro:', error);
                setError('Error al eliminar el registro');
            }
        }
    };

    const HistorialForm = ({ onSubmit, initialData, onCancel }) => {
        const [formData, setFormData] = useState({
            cargo: '',
            institucion: '',
            ano_inicio: '',
            ano_fin: ''
        });

        useEffect(() => {
            if (initialData) {
                setFormData(initialData);
            }
        }, [initialData]);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(formData);
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">
                        Cargo
                    </label>
                    <input
                        type="text"
                        id="cargo"
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    />
                </div>

                <div>
                    <label htmlFor="institucion" className="block text-sm font-medium text-gray-700 mb-1">
                        Institución
                    </label>
                    <input
                        type="text"
                        id="institucion"
                        name="institucion"
                        value={formData.institucion}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="ano_inicio" className="block text-sm font-medium text-gray-700 mb-1">
                            Año de Inicio
                        </label>
                        <input
                            type="number"
                            id="ano_inicio"
                            name="ano_inicio"
                            value={formData.ano_inicio}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                        />
                    </div>

                    <div>
                        <label htmlFor="ano_fin" className="block text-sm font-medium text-gray-700 mb-1">
                            Año de Fin
                        </label>
                        <input
                            type="number"
                            id="ano_fin"
                            name="ano_fin"
                            value={formData.ano_fin}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] rounded-lg hover:bg-[#0A6AC8]"
                    >
                        {initialData ? 'Actualizar' : 'Guardar'} Registro
                    </button>
                </div>
            </form>
        );
    };

    HistorialForm.propTypes = {
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        initialData: PropTypes.shape({
            cargo: PropTypes.string,
            institucion: PropTypes.string,
            ano_inicio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            ano_fin: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        })
    };

    if (loading) {
        return <div className="p-4">Cargando historial político...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-800">Historial Político</h2>
                    <button
                        onClick={onClose}
                        className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cerrar
                    </button>
                </div>
                <button
                    onClick={() => {
                        setEditingHistorial(null);
                        setIsModalOpen(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] rounded-lg hover:bg-[#0A6AC8]"
                >
                    Agregar Registro
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            {historial.length === 0 ? (
                <p className="text-gray-500">No hay registros históricos</p>
            ) : (
                <div className="space-y-4">
                    {historial.map((entry) => (
                        <div
                            key={entry.historial_id}
                            className="p-4 border rounded-lg bg-white shadow-sm"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-medium">{entry.cargo}</h4>
                                    <p className="text-sm text-gray-600">
                                        {entry.institucion} ({entry.ano_inicio} - {entry.ano_fin || 'Presente'})
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingHistorial(entry);
                                            setIsModalOpen(true);
                                        }}
                                        className="p-2 text-gray-600 hover:text-[#0D80F2]"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(entry.historial_id)}
                                        className="p-2 text-gray-600 hover:text-red-500"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingHistorial ? 'Editar Registro Histórico' : 'Agregar Registro Histórico'}
            >
                <HistorialForm
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                    initialData={editingHistorial}
                />
            </Modal>
        </div>
    );
};

HistorialSection.propTypes = {
    candidatoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClose: PropTypes.func.isRequired
};

export default HistorialSection;