import { useState, useEffect } from 'react';

const HistorialForm = ({ onSubmit, initialData, onCancel }) => {
    const [formData, setFormData] = useState({
        cargo: '',
        institucion: '',
        ano_inicio: '',
        ano_fin: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                cargo: initialData.cargo || '',
                institucion: initialData.institucion || '',
                ano_inicio: initialData.ano_inicio || '',
                ano_fin: initialData.ano_fin || ''
            });
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="cargo" className="block text-sm font-medium text-gray-700">
                    Cargo *
                </label>
                <input
                    type="text"
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0D80F2] focus:ring-[#0D80F2] sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="institucion" className="block text-sm font-medium text-gray-700">
                    Institución *
                </label>
                <input
                    type="text"
                    id="institucion"
                    value={formData.institucion}
                    onChange={(e) => setFormData({ ...formData, institucion: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0D80F2] focus:ring-[#0D80F2] sm:text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="ano_inicio" className="block text-sm font-medium text-gray-700">
                        Año de Inicio *
                    </label>
                    <select
                        id="ano_inicio"
                        value={formData.ano_inicio}
                        onChange={(e) => setFormData({ ...formData, ano_inicio: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0D80F2] focus:ring-[#0D80F2] sm:text-sm"
                    >
                        <option value="">Selecciona un año</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="ano_fin" className="block text-sm font-medium text-gray-700">
                        Año de Fin
                    </label>
                    <select
                        id="ano_fin"
                        value={formData.ano_fin}
                        onChange={(e) => setFormData({ ...formData, ano_fin: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0D80F2] focus:ring-[#0D80F2] sm:text-sm"
                    >
                        <option value="">Actualidad</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D80F2]"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#0D80F2] border border-transparent rounded-md shadow-sm hover:bg-[#0A6AC8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D80F2]"
                >
                    {initialData ? 'Actualizar' : 'Agregar'}
                </button>
            </div>
        </form>
    );
};

export default HistorialForm;