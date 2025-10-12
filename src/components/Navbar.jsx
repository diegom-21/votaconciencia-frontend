import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <nav className="bg-[#0D80F2]">
            <div className="w-full px-6">
                <div className="flex items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-white whitespace-nowrap">VotaConciencia Admin</h1>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="flex space-x-3">
                            <a href="/" className="text-white px-2 py-2 rounded-md text-sm font-medium whitespace-nowrap">Candidatos</a>
                            <a href="temas" className="text-white/70 hover:text-white px-2 py-2 rounded-md text-sm font-medium whitespace-nowrap">Temas</a>
                            <a href="propuestas" className="text-white/70 hover:text-white px-2 py-2 rounded-md text-sm font-medium whitespace-nowrap">Propuestas</a>
                            <a href="trivias" className="text-white/70 hover:text-white px-2 py-2 rounded-md text-sm font-medium whitespace-nowrap">Trivias</a>
                            <a href="cronograma" className="text-white/70 hover:text-white px-2 py-2 rounded-md text-sm font-medium whitespace-nowrap">Cronograma</a>
                            <a href="recursoseducativos" className="text-white/70 hover:text-white px-2 py-2 rounded-md text-sm font-medium whitespace-nowrap">Recursos Educativos</a>
                            <a href="partidos" className="text-white/70 hover:text-white px-2 py-2 rounded-md text-sm font-medium whitespace-nowrap">Partidos</a>
                            {user?.rol === 'superadmin' && (
                                <a href="administradores" className="text-white/70 hover:text-white px-2 py-2 rounded-md text-sm font-medium whitespace-nowrap">Administradores</a>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-white/90 text-sm font-medium whitespace-nowrap">
                            {user?.nombre} ({user?.rol})
                        </span>
                        <div 
                            className="bg-white/10 p-2 rounded-full cursor-pointer hover:bg-white/20 flex-shrink-0"
                            onClick={handleLogout}
                            title="Cerrar sesión"
                        >
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;