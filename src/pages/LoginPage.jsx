import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const success = await login(email, password);
            if (success) {
                navigate('/admin/dashboard');
            } else {
                setError('Credenciales inválidas');
            }
        } catch (error) {
            setError('Error al iniciar sesión');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-md w-full p-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-[#0D80F2] mb-2">
                        VotaConciencia
                    </h1>
                    <h2 className="text-xl text-gray-600">
                        Panel de Administración
                    </h2>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#0D80F2] focus:border-[#0D80F2] transition-colors duration-200 ease-in-out"
                                placeholder="ejemplo@votaconciencia.pe"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-[#0D80F2] focus:border-[#0D80F2] transition-colors duration-200 ease-in-out"
                                placeholder="••••••••"
                                autocomplete="current-password"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-[#0D80F2] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#0A6AC8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D80F2] transform transition-all duration-200 hover:scale-[1.02]"
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Sistema de administración electoral · {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
};

export default LoginPage;