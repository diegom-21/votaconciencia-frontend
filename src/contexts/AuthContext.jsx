import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto de autenticación
export const AuthContext = createContext(null);

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verificar token al inicio y configurar axios
    useEffect(() => {
        const initAuth = () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // Función de login
    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/admins/login', {
                email,
                password
            });

            const { token, admin } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(admin));
            setToken(token);
            setUser(admin);
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return true;
        } catch (error) {
            console.error('Error en login:', error);
            return false;
        }
    };

    // Función de logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        isAuthenticated,
        token,
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
axios.defaults.baseURL = API_URL;