import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CandidateForm from '../components/CandidateForm';
import Modal from '../components/Modal';
import Navbar from '../components/Navbar';
import HistorialSection from '../components/HistorialSection';
import ConfirmModal from '../components/ConfirmModal';

const DashboardPage = () => {
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCandidato, setSelectedCandidato] = useState(null);
    const [selectedHistorialCandidatoId, setSelectedHistorialCandidatoId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [candidatoToDelete, setCandidatoToDelete] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCandidatos();
    }, []);

    const fetchCandidatos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/candidatos');
            setCandidatos(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener candidatos:', error);
            setError('Error al cargar los candidatos');
            setLoading(false);
        }
    };

    const handleCreateUpdate = async (formData) => {
        try {
            if (selectedCandidato) {
                // Actualizar candidato existente
                await axios.put(
                    `http://localhost:3000/api/candidatos/${selectedCandidato.candidato_id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                setSuccessMessage('Candidato actualizado con éxito');
            } else {
                // Crear nuevo candidato
                await axios.post(
                    'http://localhost:3000/api/candidatos',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                setSuccessMessage('Candidato creado con éxito');
            }
            
            // Recargar la lista de candidatos
            fetchCandidatos();
            
            // Cerrar el modal y limpiar el estado
            setIsModalOpen(false);
            setSelectedCandidato(null);
            
            // Limpiar el mensaje de éxito después de 3 segundos
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Error al procesar la operación');
            console.error('Error:', error);
        }
    };

    const handleDelete = (candidatoId) => {
        setCandidatoToDelete(candidatoId);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/candidatos/${candidatoToDelete}`);
            setCandidatos(prevCandidatos => 
                prevCandidatos.filter(c => c.candidato_id !== candidatoToDelete)
            );
            setSuccessMessage('Candidato eliminado con éxito');
            
            // Limpiar el mensaje de éxito después de 3 segundos
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            setError('Error al eliminar el candidato');
            console.error('Error:', error);
        } finally {
            setIsConfirmModalOpen(false);
            setCandidatoToDelete(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    // Filtrar candidatos activos e inactivos en el frontend
    const candidatosActivos = candidatos.filter(candidato => candidato.esta_activo);
    const candidatosInactivos = candidatos.filter(candidato => !candidato.esta_activo);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar currentPage="Candidatos" />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Gestión de Candidatos</h2>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] rounded-lg hover:bg-[#0A6AC8]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Agregar Candidato
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
                                        Apellido
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Partido
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {candidatos.map((candidato) => (
                                    <tr key={candidato.candidato_id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                {candidato.foto_url ? (
                                                    <img 
                                                        src={`http://localhost:3000${candidato.foto_url}`}
                                                        alt={`${candidato.nombre} ${candidato.apellido}`}
                                                        className="w-12 h-12 rounded-full mr-3 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {candidato.nombre}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {candidato.apellido}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center">
                                                {candidato.partido_logo ? (
                                                    <img
                                                        src={`http://localhost:3000${candidato.partido_logo}`}
                                                        alt={candidato.partido_nombre || 'Logo del partido'}
                                                        className="w-6 h-6 rounded mr-2 object-contain"
                                                    />
                                                ) : null}
                                                <span>{candidato.partido_nombre || 'Sin partido'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <span
                                                className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                                                    candidato.esta_activo
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-yellow-400 text-white'
                                                }`}
                                            >
                                                {candidato.esta_activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                className="text-[#0D80F2] hover:text-[#0A6AC8] mr-4"
                                                onClick={() => {
                                                    setSelectedCandidato(candidato);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <svg className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Editar
                                            </button>
                                            <button
                                                className="text-[#0D80F2] hover:text-[#0A6AC8] mr-4"
                                                onClick={() => setSelectedHistorialCandidatoId(candidato.candidato_id)}
                                            >
                                                <svg className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                Ver Historial
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(candidato.candidato_id)}
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

                    {selectedHistorialCandidatoId && (
                        <HistorialSection 
                            candidatoId={selectedHistorialCandidatoId}
                            onClose={() => setSelectedHistorialCandidatoId(null)}
                        />
                    )}
                </div>
            </main>

            {/* Modal para crear/editar candidato */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCandidato(null);
                }}
                title={selectedCandidato ? 'Editar Candidato' : 'Nuevo Candidato'}
            >
                <CandidateForm
                    onSubmit={handleCreateUpdate}
                    initialData={selectedCandidato}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedCandidato(null);
                    }}
                />
            </Modal>

            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                message="¿Estás seguro de que deseas eliminar este candidato?"
            />
        </div>
    );
};

export default DashboardPage;