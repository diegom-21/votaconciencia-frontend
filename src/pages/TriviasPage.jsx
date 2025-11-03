import React, { useState, useEffect } from 'react';
import { triviasApi, getImageUrl } from '../services/api';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import TriviaForm from '../components/TriviaForm';
import PreguntaForm from '../components/PreguntaForm';
import OpcionesModal from '../components/OpcionesModal';

const TriviasPage = () => {
    const [temas, setTemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreguntaModalOpen, setIsPreguntaModalOpen] = useState(false);
    const [isOpcionesModalOpen, setIsOpcionesModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedTema, setSelectedTema] = useState(null);
    const [selectedPregunta, setSelectedPregunta] = useState(null);
    const [temaToDelete, setTemaToDelete] = useState(null);
    const [expandedTemaId, setExpandedTemaId] = useState(null);
    const [preguntas, setPreguntas] = useState([]);

    useEffect(() => {
        fetchTemas();
    }, []);

    const fetchTemas = async () => {
        try {
            const response = await triviasApi.getAllTemas();
            setTemas(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los temas:', error);
            setError('Error al cargar los temas');
            setLoading(false);
        }
    };

    const fetchPreguntas = async (temaId) => {
        try {
            const response = await triviasApi.getPreguntasByTema(temaId);
            setPreguntas(response.data);
        } catch (error) {
            console.error('Error al obtener las preguntas:', error);
            setError('Error al cargar las preguntas');
        }
    };

    const handleCreateUpdateTema = async (formData) => {
        try {
            if (selectedTema) {
                await triviasApi.updateTema(selectedTema.tema_trivia_id, formData);
                setSuccessMessage('Tema actualizado exitosamente');
            } else {
                await triviasApi.createTema(formData);
                setSuccessMessage('Tema creado exitosamente');
            }
            
            fetchTemas();
            setIsModalOpen(false);
            setSelectedTema(null);
            
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error al guardar el tema:', error);
            setError('Error al guardar el tema');
        }
    };

    const handleCreateUpdatePregunta = async (formData) => {
        try {
            const data = {
                ...formData,
                tema_trivia_id: expandedTemaId
            };
            
            if (selectedPregunta) {
                await triviasApi.updatePregunta(selectedPregunta.pregunta_id, data);
                setSuccessMessage('Pregunta actualizada exitosamente');
            } else {
                await triviasApi.createPregunta(data);
                setSuccessMessage('Pregunta creada exitosamente');
            }
            
            fetchPreguntas(expandedTemaId);
            setIsPreguntaModalOpen(false);
            setSelectedPregunta(null);
            
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error al guardar la pregunta:', error);
            setError('Error al guardar la pregunta');
        }
    };

    const handleDelete = (temaId) => {
        setTemaToDelete(temaId);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await triviasApi.deleteTema(temaToDelete);
            setTemas(prevTemas => prevTemas.filter(t => t.tema_trivia_id !== temaToDelete));
            setSuccessMessage('Tema eliminado exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error al eliminar el tema:', error);
            setError('Error al eliminar el tema');
        } finally {
            setIsConfirmModalOpen(false);
            setTemaToDelete(null);
        }
    };

    const handleExpandTema = async (temaId) => {
        if (expandedTemaId === temaId) {
            setExpandedTemaId(null);
            setPreguntas([]);
        } else {
            setExpandedTemaId(temaId);
            await fetchPreguntas(temaId);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar currentPage="Trivias" />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Gestión de Trivias</h2>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] rounded-lg hover:bg-[#0A6AC8]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Agregar Tema
                        </button>
                    </div>

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

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                        Imagen
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                                        Nombre del Tema
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {temas.map(tema => (
                                    <React.Fragment key={tema.tema_trivia_id}>
                                        <tr>
                                            <td className="px-2 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center">
                                                    {tema.imagen_url ? (
                                                        <img
                                                            src={getImageUrl(tema.imagen_url)}
                                                            alt={tema.nombre_tema}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                                {tema.nombre_tema}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 text-center max-w-xs truncate">
                                                <span title={tema.descripcion}>
                                                    {tema.descripcion && tema.descripcion.length > 60 
                                                        ? `${tema.descripcion.substring(0, 60)}...` 
                                                        : tema.descripcion || 'Sin descripción'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-center">
                                                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                                                    tema.esta_activo ? 'bg-green-500 text-white' : 'bg-yellow-400 text-white'
                                                }`}>
                                                    {tema.esta_activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-sm font-medium">
                                                <div className="flex flex-wrap gap-1 justify-center">
                                                    <button
                                                        className="text-[#0D80F2] hover:text-[#0A6AC8] mr-4"
                                                        onClick={() => {
                                                            setSelectedTema(tema);
                                                            setIsModalOpen(true);
                                                        }}
                                                        title="Editar tema"
                                                    >
                                                        <svg className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Editar
                                                    </button>
                                                    <button
                                                        className="text-[#0D80F2] hover:text-[#0A6AC8] mr-4"
                                                        onClick={() => handleExpandTema(tema.tema_trivia_id)}
                                                        title={expandedTemaId === tema.tema_trivia_id ? 'Ocultar preguntas' : 'Ver preguntas'}
                                                    >
                                                        {expandedTemaId === tema.tema_trivia_id ? '📋 Ocultar' : '📋 Preguntas'}
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-900"
                                                        onClick={() => handleDelete(tema.tema_trivia_id)}
                                                        title="Eliminar tema"
                                                    >
                                                        <svg className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedTemaId === tema.tema_trivia_id && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4">
                                                    <div className="bg-gray-50 p-4 rounded-lg">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <h3 className="text-lg font-medium">Preguntas del Tema</h3>
                                                            <button
                                                                className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] rounded-lg hover:bg-[#0A6AC8]"
                                                                onClick={() => {
                                                                    setSelectedPregunta(null);
                                                                    setIsPreguntaModalOpen(true);
                                                                }}
                                                            >
                                                                + Agregar Pregunta
                                                            </button>
                                                        </div>
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-white">
                                                                <tr>
                                                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        Pregunta
                                                                    </th>
                                                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        Orden
                                                                    </th>
                                                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        Acciones
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {preguntas.map(pregunta => (
                                                                    <tr key={pregunta.pregunta_id}>
                                                                        <td className="px-6 py-4 text-sm text-gray-900">
                                                                            {pregunta.texto_pregunta}
                                                                        </td>
                                                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                                                            {pregunta.orden_visualizacion}
                                                                        </td>
                                                                        <td className="px-6 py-4 text-sm font-medium text-center">
                                                                            <button
                                                                                className="text-[#0D80F2] hover:text-[#0A6AC8] mr-4"
                                                                                onClick={() => {
                                                                                    setSelectedPregunta(pregunta);
                                                                                    setIsPreguntaModalOpen(true);
                                                                                }}
                                                                            >
                                                                                <svg className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                                                Editar
                                                                            </button>
                                                                            <button
                                                                                className="text-[#0D80F2] hover:text-[#0A6AC8] mr-4"
                                                                                onClick={() => {
                                                                                    setSelectedPregunta(pregunta);
                                                                                    setIsOpcionesModalOpen(true);
                                                                                }}
                                                                            >
                                                                                Ver Opciones
                                                                            </button>
                                                                            <button
                                                                                className="text-red-600 hover:text-red-900"
                                                                                onClick={() => handleDelete(pregunta.pregunta_id)}
                                                                            >
                                                                                <svg className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                                                Eliminar
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTema(null);
                }}
                title={selectedTema ? 'Editar Tema' : 'Nuevo Tema'}
            >
                <TriviaForm
                    initialData={selectedTema}
                    onSubmit={handleCreateUpdateTema}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedTema(null);
                    }}
                />
            </Modal>

            <Modal
                isOpen={isPreguntaModalOpen}
                onClose={() => {
                    setIsPreguntaModalOpen(false);
                    setSelectedPregunta(null);
                }}
                title={selectedPregunta ? 'Editar Pregunta' : 'Nueva Pregunta'}
            >
                <PreguntaForm
                    initialData={selectedPregunta}
                    preguntasExistentes={preguntas}
                    onSubmit={handleCreateUpdatePregunta}
                    onCancel={() => {
                        setIsPreguntaModalOpen(false);
                        setSelectedPregunta(null);
                    }}
                />
            </Modal>

            {selectedPregunta && (
                <OpcionesModal
                    isOpen={isOpcionesModalOpen}
                    onClose={() => {
                        setIsOpcionesModalOpen(false);
                        setSelectedPregunta(null);
                    }}
                    preguntaId={selectedPregunta.pregunta_id}
                />
            )}

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                message="¿Estás seguro de que deseas eliminar este tema?"
            />
        </div>
    );
};

export default TriviasPage;
