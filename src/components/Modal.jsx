import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay de fondo oscuro */}
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Contenedor del modal */}
                <div className="relative w-full max-w-2xl transform rounded-xl bg-white p-6 shadow-xl transition-all">
                    {/* Encabezado del modal */}
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <span className="sr-only">Cerrar</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Contenido del modal */}
                    <div className="mt-2">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};

export default Modal;