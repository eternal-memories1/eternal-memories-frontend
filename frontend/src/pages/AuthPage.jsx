import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../context/AuthContext';
import { login, registrar } from '../services/api';
import axios from 'axios';

/**
 * AuthPage — Página de Login y Registro.
 * Props: modo = 'login' | 'registro'
 */
const AuthPage = ({ modo: modoProp = 'login' }) => {
    const [modo, setModo] = useState(modoProp);
    const [form, setForm] = useState({ nombre: '', email: '', password: '' });
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const { iniciarSesion } = useAuth();
    const navigate = useNavigate();

    const cambiarModo = (nuevoModo) => {
        setModo(nuevoModo);
        setError('');
        setForm({ nombre: '', email: '', password: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        setCargando(true);
        try {
            const res = modo === 'login'
                ? await login({ email: form.email, password: form.password })
                : await registrar({ nombre: form.nombre, email: form.email, password: form.password });
            iniciarSesion(res.data.usuario, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Ocurrió un error. Inténtalo de nuevo.');
        } finally {
            setCargando(false);
        }
    };
    
    // ── Login con Google ──
    const handleGoogleSuccess = async (credentialResponse) => {
        setCargando(true);
        setError('');
        try {
            // Nota: aquí llamamos directamente a la API en lugar de usar export importado de api.js para evitar hacer más cambios en services
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`, { token: credentialResponse.credential });
            iniciarSesion(res.data.usuario, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al iniciar sesión con Google.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen tema-oscuro flex items-center justify-center px-4">
            {/* Estrellas de fondo */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-30"
                        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                    />
                ))}
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🕊️</div>
                    <Link to="/">
                        <h1 className="font-serif text-3xl gradient-text">Eternal Memories</h1>
                    </Link>
                    <p className="text-white/40 text-sm mt-1">Honrando recuerdos eternos</p>
                </div>

                {/* Tarjeta */}
                <div className="card-glass p-8 animate-slide-up">
                    {/* Botón de Google */}
                    <div className="flex justify-center mb-6">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Hubo un error al conectar con Google.')}
                            theme="filled_black"
                            shape="pill"
                        />
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-white/30 text-xs uppercase tracking-wider">o con email</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Tabs */}
                    <div className="flex rounded-xl overflow-hidden border border-white/10 mb-6">
                        <button
                            onClick={() => cambiarModo('login')}
                            className={`flex-1 py-3 text-sm font-medium transition-all ${modo === 'login' ? 'bg-memorial-accent text-memorial-dark' : 'text-white/50 hover:text-white'}`}
                            id="tab-login"
                        >
                            Iniciar sesión
                        </button>
                        <button
                            onClick={() => cambiarModo('registro')}
                            className={`flex-1 py-3 text-sm font-medium transition-all ${modo === 'registro' ? 'bg-memorial-accent text-memorial-dark' : 'text-white/50 hover:text-white'}`}
                            id="tab-registro"
                        >
                            Crear cuenta
                        </button>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {modo === 'registro' && (
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Tu nombre completo"
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-memorial-accent transition-colors"
                                    id="input-auth-nombre"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-memorial-accent transition-colors"
                                id="input-auth-email"
                            />
                        </div>

                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type={mostrarPassword ? 'text' : 'password'}
                                placeholder="Contraseña"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                minLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-memorial-accent transition-colors"
                                id="input-auth-password"
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarPassword(!mostrarPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                            >
                                {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg p-3">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={cargando}
                            className="w-full btn-gold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            id="btn-auth-submit"
                        >
                            {cargando ? 'Procesando...' : (modo === 'login' ? 'Entrar' : 'Crear cuenta')}
                            {!cargando && <ArrowRight size={18} />}
                        </button>
                    </form>
                </div>

                <p className="text-center text-white/30 text-xs mt-6">
                    Al continuar, aceptas nuestros <a href="#" className="text-memorial-accent hover:underline">Términos de servicio</a>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
