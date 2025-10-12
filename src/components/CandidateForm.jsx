import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const CandidateForm = ({ onSubmit, initialData, onCancel }) => {
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        biografia: '',
        partido_id: '',
        esta_activo: 1
    });
    
    // Estado para la imagen y partidos
    const [fotoFile, setFotoFile] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [partidos, setPartidos] = useState([]);
    const [loadingPartidos, setLoadingPartidos] = useState(true);

    // Actualiza el formulario si hay datos iniciales (modo edición)
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (initialData.foto_url) {
                setFotoPreview(`http://localhost:3000${initialData.foto_url}`);
            }
        }
    }, [initialData]);

    // Cargar la lista de partidos
    useEffect(() => {
        const fetchPartidos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/partidos');
                setPartidos(response.data);
                setLoadingPartidos(false);
            } catch (error) {
                console.error('Error al cargar partidos:', error);
                setLoadingPartidos(false);
            }
        };
        
        fetchPartidos();
    }, []);



    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === 'file') {
            const file = files[0];
            setFotoFile(file);
            
            // Crear URL para vista previa
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFotoPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setFotoPreview(null);
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
                if (key === 'esta_activo') {
                    submitData.append(key, formData[key].toString());
                } else {
                    submitData.append(key, formData[key]);
                }
            }
        });
        
        // Agregar la foto si existe
        if (fotoFile) {
            submitData.append('foto', fotoFile);
        }
        
        onSubmit(submitData);
    };



    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    />
                </div>

                <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido
                    </label>
                    <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="biografia" className="block text-sm font-medium text-gray-700 mb-1">
                    Biografía
                </label>
                <textarea
                    id="biografia"
                    name="biografia"
                    value={formData.biografia}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                ></textarea>
            </div>

            <div>
                <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">
                    Foto del candidato
                </label>
                <div className="mt-1 flex items-center space-x-4">
                    {fotoPreview && (
                        <div className="relative w-32 h-32">
                            <img
                                src={fotoPreview}
                                alt="Vista previa"
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setFotoFile(null);
                                    setFotoPreview(null);
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
                            id="foto"
                            name="foto"
                            accept="image/*"
                            onChange={handleChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="foto"
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D80F2]"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            {fotoFile ? 'Cambiar foto' : 'Subir foto'}
                        </label>
                        <p className="mt-1 text-sm text-gray-500">
                            PNG, JPG o GIF (máx. 5MB)
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="partido_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Partido Político
                </label>
                <select
                    id="partido_id"
                    name="partido_id"
                    value={formData.partido_id || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    disabled={loadingPartidos}
                >
                    <option value="">Seleccione un partido</option>
                    {partidos.map((partido) => (
                        <option key={partido.partido_id} value={partido.partido_id}>
                            {partido.nombre}
                        </option>
                    ))}
                </select>
                {loadingPartidos && (
                    <p className="mt-1 text-sm text-gray-500">Cargando partidos...</p>
                )}
            </div>

            <div>
                <label htmlFor="esta_activo" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                </label>
                <select
                    id="esta_activo"
                    name="esta_activo"
                    value={formData.esta_activo === 1 ? "1" : "0"}
                    onChange={(e) => {
                        setFormData(prev => ({
                            ...prev,
                            esta_activo: parseInt(e.target.value)
                        }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                >
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                </select>
            </div>

            <div>
                <label htmlFor="plan_gobierno_completo" className="block text-sm font-medium text-gray-700 mb-1">
                    Plan de Gobierno (texto completo)
                </label>
                <textarea
                    id="plan_gobierno_completo"
                    name="plan_gobierno_completo"
                    value={formData.plan_gobierno_completo || ''}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Pegue aquí el plan de gobierno completo (sin introducciones innecesarias)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                ></textarea>
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
                    {initialData ? 'Actualizar' : 'Crear'} Candidato
                </button>
            </div>
        </form>
    );
};

CandidateForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
        candidato_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        nombre: PropTypes.string,
        apellido: PropTypes.string,
        biografia: PropTypes.string,
        foto_url: PropTypes.string,
        partido_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        esta_activo: PropTypes.bool
    })
};

export default CandidateForm;