import React, { useState, useEffect } from 'react';

const CronogramaForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        titulo_evento: '',
        fecha_evento: '',
        descripcion: '',
        tipo_evento: 'Debate',
        esta_publicado: true,
    });

    // Actualiza el formulario si hay datos iniciales (modo edición)
    useEffect(() => {
        if (initialData) {
            setFormData({
                titulo_evento: initialData.titulo_evento || '',
                fecha_evento: initialData.fecha_evento ? new Date(initialData.fecha_evento).toISOString().split('T')[0] : '',
                descripcion: initialData.descripcion || '',
                tipo_evento: initialData.tipo_evento || 'Debate',
                esta_publicado: Boolean(initialData.esta_publicado), // Convertir explícitamente a boolean
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="titulo_evento" className="block text-sm font-medium text-gray-700">
                    Título del Evento
                </label>
                <input
                    type="text"
                    id="titulo_evento"
                    name="titulo_evento"
                    value={formData.titulo_evento}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    required
                />
            </div>

            <div>
                <label htmlFor="fecha_evento" className="block text-sm font-medium text-gray-700">
                    Fecha del Evento
                </label>
                <input
                    type="date"
                    id="fecha_evento"
                    name="fecha_evento"
                    value={formData.fecha_evento}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    required
                />
            </div>

            <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                />
            </div>

            <div>
                <label htmlFor="tipo_evento" className="block text-sm font-medium text-gray-700">
                    Tipo de Evento
                </label>
                <select
                    id="tipo_evento"
                    name="tipo_evento"
                    value={formData.tipo_evento}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                >
                    <option value="Debate">Debate</option>
                    <option value="Inscripción">Inscripción</option>
                    <option value="Elección">Elección</option>
                    <option value="Hito">Hito</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="esta_publicado"
                    name="esta_publicado"
                    checked={formData.esta_publicado}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border border-gray-300 rounded"
                />
                <label htmlFor="esta_publicado" className="ml-2 block text-sm text-gray-900">
                    Publicado
                </label>
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Guardar
                </button>
            </div>
        </form>
    );
};

export default CronogramaForm;