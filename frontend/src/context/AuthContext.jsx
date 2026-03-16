import { createContext, useContext, useState, useEffect } from 'react';
import { obtenerPerfil } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Verificar si hay una sesión activa al cargar la app
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            obtenerPerfil()
                .then((res) => setUsuario(res.data.usuario))
                .catch(() => localStorage.removeItem('token'))
                .finally(() => setCargando(false));
        } else {
            setCargando(false);
        }
    }, []);

    const iniciarSesion = (userData, token) => {
        localStorage.setItem('token', token);
        setUsuario(userData);
    };

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return ctx;
};
