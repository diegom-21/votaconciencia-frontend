import PropTypes from 'prop-types';

const HistorialList = ({ historial, onEdit }) => {
    if (!historial || historial.length === 0) {
        return <p className="text-gray-500">No hay registros históricos</p>;
    }

    return (
        <div className="space-y-4">
            {historial.map((entry) => (
                <div
                    key={entry.historial_id}
                    className="p-4 border rounded-lg bg-white shadow-sm"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-medium">{entry.cargo}</h4>
                            <p className="text-sm text-gray-600">
                                {entry.institucion} ({entry.ano_inicio} - {entry.ano_fin || 'Presente'})
                            </p>
                        </div>
                        <button
                            onClick={() => onEdit(entry)}
                            className="p-2 text-gray-600 hover:text-[#0D80F2]"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

HistorialList.propTypes = {
    historial: PropTypes.arrayOf(
        PropTypes.shape({
            historial_id: PropTypes.number.isRequired,
            cargo: PropTypes.string.isRequired,
            institucion: PropTypes.string.isRequired,
            ano_inicio: PropTypes.number.isRequired,
            ano_fin: PropTypes.number
        })
    ).isRequired,
    onEdit: PropTypes.func.isRequired
};

export default HistorialList;