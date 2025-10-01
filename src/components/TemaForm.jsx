import { useState, useEffect } from 'react';
import { FaLock, FaLeaf, FaBook, FaMoneyBillAlt, FaHeartbeat } from 'react-icons/fa';

const iconOptions = [
    { label: 'Economía', value: 'FaMoneyBillAlt', icon: <FaMoneyBillAlt /> },
    { label: 'Seguridad', value: 'FaLock', icon: <FaLock /> },
    { label: 'Salud', value: 'FaHeartbeat', icon: <FaHeartbeat /> },
    { label: 'Educación', value: 'FaBook', icon: <FaBook /> },
    { label: 'Medio Ambiente', value: 'FaLeaf', icon: <FaLeaf /> }
];

const TemaForm = ({ onSubmit, initialData, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre_tema: '',
        icono_url: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre_tema: initialData.nombre_tema || '',
                icono_url: initialData.icono_url || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div>
                <label htmlFor="nombre_tema" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Tema <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="nombre_tema"
                    name="nombre_tema"
                    value={formData.nombre_tema}
                    onChange={(e) => setFormData({ ...formData, nombre_tema: e.target.value })}
                    required
                    className="shadow-sm focus:ring-blue-500 focus:border-gray-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                />
            </div>

            <div>
                <label htmlFor="icono_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Ícono del Tema
                </label>
                <select
                    id="icono_url"
                    name="icono_url"
                    value={formData.icono_url}
                    onChange={(e) => setFormData({ ...formData, icono_url: e.target.value })}
                    className="shadow-sm focus:ring-blue-500 focus:border-gray-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                >
                    <option value="">Selecciona un ícono</option>
                    {iconOptions.map((icon) => (
                        <option key={icon.value} value={icon.value}>
                            {icon.label}
                        </option>
                    ))}
                </select>
                {formData.icono_url && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-700 mb-2">Vista previa del ícono:</p>
                        <span className="text-3xl">
                            {iconOptions.find((icon) => icon.value === formData.icono_url)?.icon}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {initialData ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};

export default TemaForm;