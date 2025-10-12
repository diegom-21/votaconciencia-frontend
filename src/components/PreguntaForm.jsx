import React, { useState } from 'react';

const PreguntaForm = ({ initialData, onSubmit, onCancel, preguntasExistentes = [] }) => {
    // Calcular el siguiente orden disponible
    const getNextOrder = () => {
        if (initialData?.orden_visualizacion !== undefined) {
            return initialData.orden_visualizacion;
        }
        if (preguntasExistentes.length === 0) {
            return 1;
        }
        const maxOrder = Math.max(...preguntasExistentes.map(p => p.orden_visualizacion || 0));
        return maxOrder + 1;
    };

    const [formData, setFormData] = useState({
        texto_pregunta: initialData?.texto_pregunta || '',
        orden_visualizacion: getNextOrder(),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="texto_pregunta" className="block text-sm font-medium text-gray-700">
                    Texto de la Pregunta
                </label>
                <textarea
                    id="texto_pregunta"
                    name="texto_pregunta"
                    value={formData.texto_pregunta}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    rows="3"
                    required
                />
            </div>

            <div>
                <label htmlFor="orden_visualizacion" className="block text-sm font-medium text-gray-700">
                    Orden de Visualización
                </label>
                <input
                    type="number"
                    id="orden_visualizacion"
                    name="orden_visualizacion"
                    value={formData.orden_visualizacion}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    min="1"
                />
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

export default PreguntaForm;
