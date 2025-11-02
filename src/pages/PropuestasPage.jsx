import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import PropuestaForm from '../components/PropuestaForm';
import ConfirmModal from '../components/ConfirmModal';
import PropuestaEditForm from '../components/PropuestaEditForm';

const PropuestasPage = () => {
    const [propuestas, setPropuestas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [propuestaToDelete, setPropuestaToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPropuesta, setSelectedPropuesta] = useState(null);

    // Mover fetchPropuestas fuera del useEffect para que esté disponible globalmente
    const fetchPropuestas = async () => {
        try {
            const response = await axios.get('/api/propuestas');
            setPropuestas(Array.isArray(response.data) ? response.data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener las propuestas:', error);
            setError('Error al cargar las propuestas');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPropuestas();
    }, []);

    const handleCreatePropuesta = async (formData) => {
        try {
            await axios.post('/api/propuestas', formData);
            setSuccessMessage('Propuesta creada exitosamente');
            setIsModalOpen(false);
            fetchPropuestas();

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error al crear la propuesta:', error);
            setError('Error al crear la propuesta');
        }
    };

    const handleDelete = (propuestaId) => {
        setPropuestaToDelete(propuestaId);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await propuestasApi.delete(propuestaToDelete);
            setPropuestas(prevPropuestas =>
                prevPropuestas.filter(p => p.propuesta_id !== propuestaToDelete)
            );
            setSuccessMessage('Propuesta eliminada con éxito');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setError('Error al eliminar la propuesta');
            console.error('Error:', error);
        } finally {
            setIsConfirmModalOpen(false);
            setPropuestaToDelete(null);
        }
    };

    const handleEditPropuesta = (propuesta) => {
        setSelectedPropuesta(propuesta);
        setIsEditModalOpen(true);
    };

    const handleUpdatePropuesta = async (formData) => {
        try {
            // Limpiar el estado de error antes de la solicitud
            setError('');

            await axios.put(`/api/propuestas/${selectedPropuesta.propuesta_id}`, formData);
            setSuccessMessage('Propuesta actualizada exitosamente');
            setIsEditModalOpen(false);
            setSelectedPropuesta(null);

            // Actualizar la tabla sin recargar la página
            fetchPropuestas();

            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error al actualizar la propuesta:', error);
            setError('Error al actualizar la propuesta');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar currentPage="Propuestas" />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Gestión de Propuestas</h2>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] rounded-lg hover:bg-[#0A6AC8]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Agregar Propuesta
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Título
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Candidato
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tema
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Resumen IA
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {propuestas.map((propuesta) => (
                                    <tr key={propuesta.propuesta_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {propuesta.titulo_propuesta}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {propuesta.nombre_candidato}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {propuesta.nombre_tema}
                                        </td>
                                        <td>
                                            {propuesta.resumen_ia && propuesta.resumen_ia.trim() !== "" ? (
                                                <span className="badge bg-success">
                                                    ✔ Resumen generado
                                                </span>
                                            ) : (
                                                <span className="badge bg-danger">
                                                    ✖ Sin resumen
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                className="text-[#0D80F2] hover:text-[#0A6AC8] mr-4"
                                                onClick={() => handleEditPropuesta(propuesta)}
                                            >
                                                <svg className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Editar
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(propuesta.propuesta_id)}
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
                </div>
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nueva Propuesta"
            >
                <PropuestaForm
                    fetchPropuestas={fetchPropuestas} // Pasar la función para refrescar la tabla
                    onClose={() => setIsModalOpen(false)} // Cerrar el modal automáticamente
                />
            </Modal>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                message="¿Estás seguro de que deseas eliminar esta propuesta?"
            />

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedPropuesta(null);
                }}
                title="Editar Propuesta"
            >
                <PropuestaEditForm
                    initialData={selectedPropuesta}
                    onSubmit={handleUpdatePropuesta}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                        setSelectedPropuesta(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default PropuestasPage;
