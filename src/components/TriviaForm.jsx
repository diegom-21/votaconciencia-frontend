import React, { useState, useEffect } from 'react';

const TriviaForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre_tema: '',
        descripcion: '',
        esta_activo: true,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Actualiza el formulario si hay datos iniciales (modo edición)
    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre_tema: initialData.nombre_tema || '',
                descripcion: initialData.descripcion || '',
                esta_activo: Boolean(initialData.esta_activo), // Convertir explícitamente a boolean
            });
            if (initialData.imagen_url) {
                setImagePreview(`http://localhost:3000${initialData.imagen_url}`);
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === 'file') {
            const file = files[0];
            setImageFile(file);
            
            // Crear URL para vista previa
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setImagePreview(null);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = new FormData();
        
        // Agregar todos los campos del formulario
        Object.keys(formData).forEach(key => {
            if (formData[key] !== undefined && formData[key] !== null) {
                submitData.append(key, formData[key]);
            }
        });
        
        // Agregar la imagen si existe
        if (imageFile) {
            submitData.append('imagen', imageFile);
        }
        
        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="nombre_tema" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Tema
                </label>
                <input
                    type="text"
                    id="nombre_tema"
                    name="nombre_tema"
                    value={formData.nombre_tema}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    placeholder="Nombre del tema de trivia"
                />
            </div>

            <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                </label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    rows="3"
                    placeholder="Descripción del tema"
                />
            </div>

            <div>
                <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen del Tema
                </label>
                <div className="mt-1 flex items-center space-x-4">
                    {imagePreview && (
                        <div className="relative w-32 h-32">
                            <img
                                src={imagePreview}
                                alt="Vista previa"
                                className="w-32 h-32 object-contain rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImageFile(null);
                                    setImagePreview(initialData?.imagen_url ? `http://localhost:3000${initialData.imagen_url}` : null);
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
                            id="imagen"
                            name="imagen"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="imagen"
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D80F2]"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            {imageFile ? 'Cambiar imagen' : 'Subir imagen'}
                        </label>
                        <p className="mt-1 text-sm text-gray-500">
                            PNG, JPG o GIF (máx. 5MB)
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="esta_activo"
                    name="esta_activo"
                    checked={formData.esta_activo}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#0D80F2] border-gray-300 rounded focus:ring-[#0D80F2]"
                />
                <label htmlFor="esta_activo" className="ml-2 block text-sm text-gray-900">
                    Tema activo
                </label>
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
                    {initialData ? 'Actualizar' : 'Crear'} Tema
                </button>
            </div>
        </form>
    );
};

export default TriviaForm;
