import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import RecursoForm from '../components/RecursoForm';

const RecursosPage = () => {
    const [recursos, setRecursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedRecurso, setSelectedRecurso] = useState(null);
    const [recursoToDelete, setRecursoToDelete] = useState(null);

    useEffect(() => {
        fetchRecursos();
    }, []);

    const fetchRecursos = async () => {
        try {
            const response = await axios.get('/api/recursos');
            setRecursos(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los recursos:', error);
            setError('Error al cargar los recursos educativos');
            setLoading(false);
        }
    };

    const handleCreateUpdate = async (formData) => {
        try {
            setError('');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (selectedRecurso) {
                await axios.put(`/api/recursos/${selectedRecurso.recurso_id}`, formData, config);
                setSuccessMessage('Recurso actualizado exitosamente');
            } else {
                await axios.post('/api/recursos', formData, config);
                setSuccessMessage('Recurso creado exitosamente');
            }
            
            fetchRecursos();
            setIsModalOpen(false);
            setSelectedRecurso(null);
            
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error al guardar el recurso:', error);
            setError('Error al guardar el recurso educativo');
        }
    };

    const handleDelete = (recursoId) => {
        setRecursoToDelete(recursoId);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/recursos/${recursoToDelete}`);
            setRecursos(prevRecursos => prevRecursos.filter(r => r.recurso_id !== recursoToDelete));
            setSuccessMessage('Recurso eliminado exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error al eliminar el recurso:', error);
            setError('Error al eliminar el recurso');
        } finally {
            setIsConfirmModalOpen(false);
            setRecursoToDelete(null);
        }
    };

    const truncateHtml = (html, maxLength = 100) => {
        const textContent = html.replace(/<[^>]*>/g, ''); // Remove HTML tags
        return textContent.length > maxLength 
            ? `${textContent.substring(0, maxLength)}...` 
            : textContent;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar currentPage="Recursos Educativos" />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Gestión de Recursos Educativos</h2>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] rounded-lg hover:bg-[#0A6AC8]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Agregar Recurso
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{successMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                        Imagen
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                        Título
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
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
                                {recursos.map(recurso => (
                                    <tr key={recurso.recurso_id}>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center">
                                                {recurso.imagen_url ? (
                                                    <img
                                                        src={`http://localhost:3000${recurso.imagen_url}`}
                                                        alt={recurso.titulo}
                                                        className="h-10 w-10 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                            {recurso.titulo}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                            <span title={recurso.contenido_html}>
                                                {truncateHtml(recurso.contenido_html, 80)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                                                recurso.esta_publicado ? 'bg-green-500 text-white' : 'bg-yellow-400 text-white'
                                            }`}>
                                                {recurso.esta_publicado ? 'Publicado' : 'No Publicado'}
                                            </span>
                                        </td>
                                        <td className="px-2 py-4 text-sm font-medium">
                                            <div className="flex flex-wrap gap-1 justify-center">
                                                <button
                                                    className="text-[#0D80F2] hover:text-[#0A6AC8] mr-4"
                                                    onClick={() => {
                                                        setSelectedRecurso(recurso);
                                                        setIsModalOpen(true);
                                                    }}
                                                    title="Editar recurso"
                                                >
                                                    <svg className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Editar
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => handleDelete(recurso.recurso_id)}
                                                    title="Eliminar recurso"
                                                >
                                                    <svg className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
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
                    setSelectedRecurso(null);
                }}
                title={selectedRecurso ? 'Editar Recurso' : 'Nuevo Recurso'}
            >
                <RecursoForm
                    initialData={selectedRecurso}
                    onSubmit={handleCreateUpdate}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedRecurso(null);
                    }}
                />
            </Modal>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                message="¿Estás seguro de que deseas eliminar este recurso educativo?"
            />
        </div>
    );
};

export default RecursosPage;