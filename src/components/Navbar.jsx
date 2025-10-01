import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <nav className="bg-[#0D80F2]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-xl font-bold text-white">VotaConciencia Admin</h1>
                        <div className="flex space-x-4">
                            <a href="/" className="text-white px-3 py-2 rounded-md text-sm font-medium">Candidatos</a>
                            <a href="temas" className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Temas</a>
                            <a href="propuestas" className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Propuestas</a>
                            <a href="#" className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Trivias</a>
                            <a href="#" className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Cronograma</a>
                            <a href="#" className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Recursos Educativos</a>
                            <a href="partidos" className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Partidos</a>
                            <a href="#" className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Administradores</a>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div 
                            className="bg-white/10 p-2 rounded-full cursor-pointer hover:bg-white/20"
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