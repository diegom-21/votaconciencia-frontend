import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import AdministradorForm from '../components/AdministradorForm';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdministradoresPage = () => {
    const [administradores, setAdministradores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedAdministrador, setSelectedAdministrador] = useState(null);
    const [administradorToDelete, setAdministradorToDelete] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si el usuario es superadmin
        if (user && user.rol !== 'superadmin') {
            navigate('/admin/dashboard');
            return;
        }
        fetchAdministradores();
    }, [user, navigate]);

    const fetchAdministradores = async () => {
        try {
            const response = await axios.get('/api/administradores');
            setAdministradores(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los administradores:', error);
            setError('Error al cargar los administradores');
            setLoading(false);
        }
    };

    const handleCreateUpdate = async (formData) => {
        try {
            setError('');

            if (selectedAdministrador) {
                await axios.put(`/api/administradores/${selectedAdministrador.admin_id}`, formData);
                setSuccessMessage('Administrador actualizado exitosamente');
            } else {
                await axios.post('/api/administradores', formData);
                setSuccessMessage('Administrador creado exitosamente');
            }
            
            fetchAdministradores();
            setIsModalOpen(false);
            setSelectedAdministrador(null);
            
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error al guardar el administrador:', error);
            setError(error.response?.data?.error || 'Error al guardar el administrador');
        }
    };

    const handleDelete = (adminId) => {
        setAdministradorToDelete(adminId);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/administradores/${administradorToDelete}`);
            setAdministradores(prevAdmins => 
                prevAdmins.filter(admin => admin.admin_id !== administradorToDelete)
            );
            setSuccessMessage('Administrador eliminado exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error al eliminar el administrador:', error);
            setError(error.response?.data?.error || 'Error al eliminar el administrador');
        } finally {
            setIsConfirmModalOpen(false);
            setAdministradorToDelete(null);
        }
    };

    // No mostrar la página si no es superadmin
    if (user && user.rol !== 'superadmin') {
        return null;
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar currentPage="Administradores" />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Gestión de Administradores</h2>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] rounded-lg hover:bg-[#0A6AC8]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Agregar Administrador
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
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rol
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
                                {administradores.map(admin => (
                                    <tr key={admin.admin_id}>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                            {admin.nombre}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                            {admin.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                                                admin.rol === 'superadmin' 
                                                    ? 'bg-purple-500 text-white' 
                                                    : 'bg-blue-500 text-white'
                                            }`}>
                                                {admin.rol === 'superadmin' ? 'Super Admin' : 'Editor'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                                                admin.esta_activo ? 'bg-green-500 text-white' : 'bg-yellow-400 text-white'
                                            }`}>
                                                {admin.esta_activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-2 py-4 text-sm font-medium">
                                            <div className="flex flex-wrap gap-1 justify-center">
                                                <button
                                                    className="text-[#0D80F2] hover:text-[#0A6AC8] mr-4"
                                                    onClick={() => {
                                                        setSelectedAdministrador(admin);
                                                        setIsModalOpen(true);
                                                    }}
                                                    title="Editar administrador"
                                                >
                                                    <svg className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Editar
                                                </button>
                                                {admin.admin_id !== user.id && (
                                                    <button
                                                        className="text-red-600 hover:text-red-900"
                                                        onClick={() => handleDelete(admin.admin_id)}
                                                        title="Eliminar administrador"
                                                    >
                                                        <svg className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Eliminar
                                                    </button>
                                                )}
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
                    setSelectedAdministrador(null);
                }}
                title={selectedAdministrador ? 'Editar Administrador' : 'Nuevo Administrador'}
            >
                <AdministradorForm
                    initialData={selectedAdministrador}
                    currentUserId={user?.id}
                    onSubmit={handleCreateUpdate}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedAdministrador(null);
                    }}
                />
            </Modal>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                message="¿Estás seguro de que deseas eliminar este administrador?"
            />
        </div>
    );
};

export default AdministradoresPage;