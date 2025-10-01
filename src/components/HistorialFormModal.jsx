import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const HistorialFormModal = ({ isOpen, onClose, onSubmit, candidatoId, initialData }) => {
    const [formData, setFormData] = useState({
        cargo: '',
        institucion: '',
        ano_inicio: '',
        ano_fin: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                cargo: '',
                institucion: '',
                ano_inicio: '',
                ano_fin: ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        onSubmit({ ...formData, candidato_id: candidatoId });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-lg font-medium mb-4">
                    {initialData ? 'Editar Registro Histórico' : 'Agregar Historial'}
                </h2>
                <div className="space-y-4">
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
                            required
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

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] rounded-lg hover:bg-[#0A6AC8]"
                        >
                            Guardar Registro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

HistorialFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    candidatoId: PropTypes.string.isRequired,
    initialData: PropTypes.shape({
        cargo: PropTypes.string,
        institucion: PropTypes.string,
        ano_inicio: PropTypes.string,
        ano_fin: PropTypes.string
    })
};

export default HistorialFormModal;