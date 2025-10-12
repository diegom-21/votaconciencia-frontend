import React, { useState, useEffect } from 'react';

const AdministradorForm = ({ initialData, currentUserId, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'editor',
        esta_activo: true,
    });

    // Actualiza el formulario si hay datos iniciales (modo edición)
    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre || '',
                email: initialData.email || '',
                password: '', // No mostrar contraseña existente
                rol: initialData.rol || 'editor',
                esta_activo: Boolean(initialData.esta_activo),
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Si estamos editando y no se cambió la contraseña, no enviarla
        const submitData = { ...formData };
        if (initialData && !submitData.password) {
            delete submitData.password;
        }
        
        onSubmit(submitData);
    };

    const isEditingOwnAccount = initialData && initialData.admin_id === currentUserId;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                </label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    placeholder="Nombre completo del administrador"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    placeholder="email@ejemplo.com"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {initialData ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!initialData} // Requerida solo al crear
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2]"
                    placeholder={initialData ? "Dejar vacío para mantener la actual" : "Contraseña"}
                />
                {initialData && (
                    <p className="mt-1 text-sm text-gray-500">
                        Deja este campo vacío si no deseas cambiar la contraseña
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                </label>
                <select
                    id="rol"
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    disabled={isEditingOwnAccount} // No puede cambiar su propio rol
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0D80F2] focus:border-[#0D80F2] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    <option value="editor">Editor</option>
                    <option value="superadmin">Super Admin</option>
                </select>
                {isEditingOwnAccount && (
                    <p className="mt-1 text-sm text-gray-500">
                        No puedes cambiar tu propio rol
                    </p>
                )}
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="esta_activo"
                    name="esta_activo"
                    checked={formData.esta_activo}
                    onChange={handleChange}
                    disabled={isEditingOwnAccount} // No puede desactivarse a sí mismo
                    className="h-4 w-4 text-[#0D80F2] border-gray-300 rounded focus:ring-[#0D80F2] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <label htmlFor="esta_activo" className="ml-2 block text-sm text-gray-900">
                    Cuenta activa
                </label>
                {isEditingOwnAccount && (
                    <span className="ml-2 text-sm text-gray-500">
                        (No puedes desactivar tu propia cuenta)
                    </span>
                )}
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
                    {initialData ? 'Actualizar' : 'Crear'} Administrador
                </button>
            </div>
        </form>
    );
};

export default AdministradorForm;