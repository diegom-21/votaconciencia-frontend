import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Modal from '../components/Modal';
import PartidoForm from '../components/PartidoForm';
import { partidosApi, getImageUrl } from '../services/api';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';

const PartidosPage = () => {
    const [partidos, setPartidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPartido, setSelectedPartido] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [partidoToDelete, setPartidoToDelete] = useState(null);

    useEffect(() => {
        fetchPartidos();
    }, []);

    const fetchPartidos = async () => {
        try {
            const response = await partidosApi.getAll();
            setPartidos(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener partidos:', error);
            setError('Error al cargar los partidos');
            setLoading(false);
        }
    };

    const handleCreateUpdate = async (formData) => {
        try {
            if (selectedPartido) {
                // Actualizar partido existente
                await partidosApi.update(selectedPartido.partido_id, formData);
                setSuccessMessage('Partido actualizado con éxito');
            } else {
                // Crear nuevo partido
                await partidosApi.create(formData);
                setSuccessMessage('Partido creado con éxito');
            }
            
            // Recargar la lista de partidos
            fetchPartidos();
            
            // Cerrar el modal y limpiar el estado
            setIsModalOpen(false);
            setSelectedPartido(null);
            
            // Limpiar el mensaje de éxito después de 3 segundos
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al procesar la operación');
            console.error('Error:', error);
        }
    };

    const handleDelete = (partidoId) => {
        setPartidoToDelete(partidoId);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await partidosApi.delete(partidoToDelete);
            setPartidos(prevPartidos => 
                prevPartidos.filter(p => p.partido_id !== partidoToDelete)
            );
            setSuccessMessage('Partido eliminado con éxito');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.message.includes('candidatos asociados')) {
                setError('No se puede eliminar el partido porque tiene candidatos asociados');
            } else {
                setError('Error al eliminar el partido');
            }
            console.error('Error:', error);
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setIsConfirmModalOpen(false);
            setPartidoToDelete(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar currentPage="Partidos" />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Gestión de Partidos Políticos</h2>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] rounded-lg hover:bg-[#0A6AC8]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Agregar Partido
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
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Logo
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha de Creación
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {partidos.map((partido) => (
                                    <tr key={partido.partido_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center">{partido.logo_url ? (
                                                <img
                                                    src={getImageUrl(partido.logo_url)}
                                                    alt={`Logo de ${partido.nombre}`}
                                                    className="h-10 w-10 object-contain"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                                                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                            {partido.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                            {new Date(partido.fecha_creacion).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <button
                                                className="text-[#0D80F2] hover:text-[#0A6AC8] mr-4"
                                                onClick={() => {
                                                    setSelectedPartido(partido);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <svg className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Editar
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(partido.partido_id)}
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

            {/* Modal para crear/editar partido */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPartido(null);
                }}
                title={selectedPartido ? 'Editar Partido' : 'Nuevo Partido'}
            >
                <PartidoForm
                    onSubmit={handleCreateUpdate}
                    initialData={selectedPartido}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedPartido(null);
                    }}
                />
            </Modal>

            {/* Modal de confirmación para eliminar partido */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                message="¿Estás seguro de que deseas eliminar este partido?"
            />
        </div>
    );
};

export default PartidosPage;