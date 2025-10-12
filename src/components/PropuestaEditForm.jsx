import React, { useState } from 'react';

const PropuestaEditForm = ({ initialData, onSubmit, onCancel }) => {
    const [tituloPropuesta, setTituloPropuesta] = useState(initialData?.titulo_propuesta || '');

    // Extraer información política del resumen_ia
    const extractPoliticalInfo = (resumen) => {
        if (!resumen) return '';
        
        const orientacion = resumen.match(/📊 Orientación política: (.*)/)?.[1] || "";
        const afinidad = resumen.match(/🔢 Nivel de afinidad: (.*)/)?.[1] || "";
        
        if (orientacion || afinidad) {
            return `Orientación política: ${orientacion}\nNivel de afinidad: ${afinidad}`;
        }
        
        return '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ titulo_propuesta: tituloPropuesta });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="titulo_propuesta" className="block text-sm font-medium text-gray-700">
                    Título de la Propuesta
                </label>
                <input
                    type="text"
                    id="titulo_propuesta"
                    value={tituloPropuesta}
                    onChange={(e) => setTituloPropuesta(e.target.value)}
                    className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md px-3 py-2"
                    required
                />
            </div>

            <div>
                <label htmlFor="resumen_ia" className="block text-sm font-medium text-gray-700">
                    Resumen Generado por IA
                </label>
                <textarea
                    id="resumen_ia"
                    value={initialData?.resumen_ia || ''}
                    readOnly
                    style={{height:'233px'}}
                    className="mt-1 px-4 py-2 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-lg bg-gray-100"
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

export default PropuestaEditForm;