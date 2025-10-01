import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Mientras verifica la autenticación, muestra un loading
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D80F2]"></div>
            </div>
        );
    }

    // Si no está autenticado, redirige al login guardando la ruta intentada
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Si está autenticado, renderiza las rutas hijas
    return <Outlet />;
};

export default ProtectedRoute;