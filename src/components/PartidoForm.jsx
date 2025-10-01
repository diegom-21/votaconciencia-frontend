import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PartidoForm = ({ onSubmit, initialData, onCancel }) => {
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        nombre: ''
    });
    
    // Estado para el logo
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);

    // Actualiza el formulario si hay datos iniciales (modo edición)
    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre
            });
            if (initialData.logo_url) {
                setLogoPreview(`http://localhost:3000${initialData.logo_url}`);
            }
        }
    }, [initialData]);

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file') {
            const file = files[0];
            setLogoFile(file);
            
            // Crear URL para vista previa
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setLogoPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setLogoPreview(null);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = new FormData();
        
        // Agregar todos los campos del formulario
        Object.keys(formData).forEach(key => {
            if (formData[key] !== undefined && formData[key] !== null) {
                submitData.append(key, formData[key]);
            }
        });
        
        // Agregar el logo si existe
        if (logoFile) {
            submitData.append('logo', logoFile);
        }
        
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Partido
                </label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    placeholder="Nombre del partido político"
                />
            </div>

            <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                    Logo del Partido
                </label>
                <div className="mt-1 flex items-center space-x-4">
                    {logoPreview && (
                        <div className="relative w-32 h-32">
                            <img
                                src={logoPreview}
                                alt="Vista previa"
                                className="w-32 h-32 object-contain rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setLogoFile(null);
                                    setLogoPreview(null);
                                }}
                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/2 -translate-y-1/2 hover:bg-red-600"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className="flex-1">
                        <input
                            type="file"
                            id="logo"
                            name="logo"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="logo"
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D80F2]"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            {logoFile ? 'Cambiar logo' : 'Subir logo'}
                        </label>
                        <p className="mt-1 text-sm text-gray-500">
                            PNG, JPG o GIF (máx. 5MB)
                        </p>
                    </div>
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
                    {initialData ? 'Actualizar' : 'Crear'} Partido
                </button>
            </div>
        </form>
    );
};

PartidoForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        nombre: PropTypes.string,
        logo_url: PropTypes.string
    })
};

export default PartidoForm;