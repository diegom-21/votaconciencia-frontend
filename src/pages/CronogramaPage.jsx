import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import CronogramaForm from '../components/CronogramaForm';

const CronogramaPage = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [eventoToDelete, setEventoToDelete] = useState(null);
    const [selectedEvento, setSelectedEvento] = useState(null);

    useEffect(() => {
        fetchEventos();
    }, []);

    const fetchEventos = async () => {
        try {
            const response = await axios.get('/api/cronograma');
            setEventos(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los eventos:', error);
            setError('Error al cargar los eventos');
            setLoading(false);
        }
    };

    const handleCreateUpdate = async (formData) => {
        try {
            if (selectedEvento) {
                await axios.put(`/api/cronograma/${selectedEvento.evento_id}`, formData);
                setSuccessMessage('Evento actualizado exitosamente');
            } else {
                await axios.post('/api/cronograma', formData);
                setSuccessMessage('Evento creado exitosamente');
            }
            fetchEventos();
            setIsModalOpen(false);
            setSelectedEvento(null);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error al guardar el evento:', error);
            setError('Error al guardar el evento');
        }
    };

    const handleDelete = (eventoId) => {
        setEventoToDelete(eventoId);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/api/cronograma/${eventoToDelete}`);
            setEventos(prevEventos => prevEventos.filter(e => e.evento_id !== eventoToDelete));
            setSuccessMessage('Evento eliminado exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error al eliminar el evento:', error);
            setError('Error al eliminar el evento');
        } finally {
            setIsConfirmModalOpen(false);
            setEventoToDelete(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar currentPage="Cronograma" />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Gestión de Cronograma</h2>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] rounded-lg hover:bg-[#0A6AC8]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            + Agregar Evento
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
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Publicado</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {eventos.map(evento => (
                                    <tr key={evento.evento_id}>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{evento.titulo_evento}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{format(new Date(evento.fecha_evento), 'dd/MM/yyyy')}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 text-center">{evento.tipo_evento}</td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${evento.esta_publicado ? 'bg-green-500 text-white' : 'bg-yellow-400 text-white'}`}>
                                                {evento.esta_publicado ? 'Sí' : 'No'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-center">
                                            <button
                                                className="text-[#0D80F2] hover:text-[#0A6AC8] mr-4"
                                                onClick={() => {
                                                    setSelectedEvento(evento);
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
                                                onClick={() => handleDelete(evento.evento_id)}
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
                    setSelectedEvento(null);
                }}
                title={selectedEvento ? 'Editar Evento' : 'Nuevo Evento'}
            >
                <CronogramaForm
                    initialData={selectedEvento}
                    onSubmit={handleCreateUpdate}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setSelectedEvento(null);
                    }}
                />
            </Modal>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                message="¿Estás seguro de que deseas eliminar este evento?"
            />
        </div>
    );
};

export default CronogramaPage;
