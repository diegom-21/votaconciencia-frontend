const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
            <p className="text-gray-500 mb-4">La página que estás buscando no existe o ha sido movida.</p>
            <a 
                href="/admin/dashboard" 
                className="px-4 py-2 bg-[#0D80F2] text-white rounded-lg hover:bg-[#0A6AC8] transition-colors"
            >
                Volver al Dashboard
            </a>
        </div>
    );
};

export default NotFound;