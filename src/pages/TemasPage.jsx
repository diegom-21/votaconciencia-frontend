import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Modal from '../components/Modal';
import TemaForm from '../components/TemaForm';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';
import { FaLock, FaLeaf, FaBook, FaMoneyBillAlt, FaHeartbeat } from 'react-icons/fa';

const iconComponents = {
    FaMoneyBillAlt: <FaMoneyBillAlt className="h-8 w-8" />,
    FaLock: <FaLock className="h-8 w-8" />,
    FaHeartbeat: <FaHeartbeat className="h-8 w-8" />,
    FaBook: <FaBook className="h-8 w-8" />,
    FaLeaf: <FaLeaf className="h-8 w-8" />
};

const TemasPage = () => {
    const [temas, setTemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTema, setSelectedTema] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [temaToDelete, setTemaToDelete] = useState(null);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/admin/login');
            return;
        }
        fetchTemas();
    }, [isAuthenticated, navigate]);

    const fetchTemas = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/temas');
            setTemas(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener temas:', error);
            setError('Error al cargar los temas');
            setLoading(false);
        }
    };

    const handleCreateUpdate = async (formData) => {
        try {
            if (selectedTema) {
                // Actualizar tema existente
                await axios.put(
                    `http://localhost:3000/api/temas/${selectedTema.tema_id}`,
                    formData
                );
                setSuccessMessage('Tema actualizado con éxito');
            } else {
                // Crear nuevo tema
                await axios.post(
                    'http://localhost:3000/api/temas',
                    formData
                );
                setSuccessMessage('Tema creado con éxito');
            }
            
            // Recargar la lista de temas
            fetchTemas();
            
            // Cerrar el modal y limpiar el estado
            setIsModalOpen(false);
            setSelectedTema(null);
            
            // Limpiar el mensaje de éxito después de 3 segundos
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al procesar la operación');
            console.error('Error:', error);
        }
    };

    const handleDelete = (temaId) => {
        setTemaToDelete(temaId);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/temas/${temaToDelete}`);
            setTemas(prevTemas => 
                prevTemas.filter(t => t.tema_id !== temaToDelete)
            );
            setSuccessMessage('Tema eliminado con éxito');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setError('Error al eliminar el tema');
            console.error('Error:', error);
        } finally {
            setIsConfirmModalOpen(false);
            setTemaToDelete(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar currentPage="Temas" />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Gestión de Temas</h2>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] rounded-lg hover:bg-[#0A6AC8]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Agregar Tema
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
                                        Nombre
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ícono
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {temas.map((tema) => (
                                    <tr key={tema.tema_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                            {tema.nombre_tema}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex justify-center">{iconComponents[tema.icono_url] ? (
                                                iconComponents[tema.icono_url]
                                            ) : tema.icono_url ? (
                                                <img
                                                    src={tema.icono_url}
                                                    alt={`Ícono de ${tema.nombre_tema}`}
                                                    className="h-8 w-8"
                                                />
                                            ) : (
                                                <div className="h-8 w-8 bg-gray-200 rounded flex items-center justify-center">
                                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                </div>
                                            )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <button
                                                className="text-[#0D80F2] hover:text-[#0A6AC8] mr-4"
                                                onClick={() => {
                                                    setSelectedTema(tema);
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
                                                onClick={() => handleDelete(tema.tema_id)}
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
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedTema(null);
                }}
                title={selectedTema ? 'Editar Tema' : 'Nuevo Tema'}
            >
                <TemaForm
                    onSubmit={handleCreateUpdate}
                    initialData={selectedTema}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedTema(null);
                    }}
                />
            </Modal>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                message="¿Estás seguro de que deseas eliminar este tema?"
            />
        </div>
    );
};

export default TemasPage;