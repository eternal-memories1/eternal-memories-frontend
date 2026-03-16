import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { obtenerUsuariosAdmin, actualizarPlanAdmin, eliminarUsuarioAdmin } from '../services/api';
import { Users, Crown, Trash2, ArrowLeft, Shield } from 'lucide-react';

const AdminPanel = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        // Redirigir si no es admin
        if (usuario && usuario.rol !== 'admin') {
            navigate('/dashboard');
            return;
        }

        if (usuario && usuario.rol === 'admin') {
            cargarUsuarios();
        }
    }, [usuario, navigate]);

    const cargarUsuarios = async () => {
        try {
            setCargando(true);
            const res = await obtenerUsuariosAdmin();
            setUsuarios(res.data);
        } catch (error) {
            mostrarMensaje('❌ Error al cargar usuarios: ' + (error.response?.data?.error || error.message));
        } finally {
            setCargando(false);
        }
    };

    const mostrarMensaje = (msg) => {
        setMensaje(msg);
        setTimeout(() => setMensaje(''), 4000);
    };

    const handleActualizarPlan = async (userId, nuevoPlan) => {
        try {
            await actualizarPlanAdmin(userId, { plan: nuevoPlan });
            mostrarMensaje(`✅ Plan actualizado a ${nuevoPlan.toUpperCase()}`);
            cargarUsuarios();
        } catch (error) {
            mostrarMensaje('❌ Error al actualizar plan');
        }
    };
    
    const handleActualizarRol = async (userId, nuevoRol) => {
        try {
            await actualizarPlanAdmin(userId, { rol: nuevoRol });
            mostrarMensaje(`✅ Rol actualizado a ${nuevoRol.toUpperCase()}`);
            cargarUsuarios();
        } catch (error) {
            mostrarMensaje('❌ Error al actualizar rol');
        }
    };

    const handleEliminarUsuario = async (userId, email) => {
        if (!window.confirm(`¿Estás seguro de eliminar permanentemente al usuario ${email}?`)) {
            return;
        }
        try {
            await eliminarUsuarioAdmin(userId);
            mostrarMensaje(`✅ Usuario ${email} eliminado`);
            cargarUsuarios();
        } catch (error) {
            mostrarMensaje('❌ Error al eliminar usuario');
        }
    };

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-memorial-dark">
                <div className="text-memorial-accent animate-pulse">Cargando Panel de Administración...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-memorial-dark text-white p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* ── Encabezado ─────────────────────────────────────────────────── */}
                <div className="flex items-center justify-between card-glass p-6">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="font-serif text-3xl flex items-center gap-3">
                                👑 Panel de Administración
                            </h1>
                            <p className="text-white/50 text-sm mt-1">Gestiona usuarios, roles y planes VIP.</p>
                        </div>
                    </div>
                </div>

                {/* ── Mensajes ───────────────────────────────────────────────────── */}
                {mensaje && (
                    <div className="card-glass p-4 text-center border border-memorial-accent/30 animate-fade-in text-sm font-medium">
                        {mensaje}
                    </div>
                )}

                {/* ── Tabla de Usuarios ──────────────────────────────────────────── */}
                <div className="card-glass overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <h2 className="font-semibold flex items-center gap-2">
                            <Users size={18} className="text-memorial-accent" />
                            Usuarios Registrados ({usuarios.length})
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-sm text-white/40">
                                    <th className="p-4 font-medium">Nombre / Email</th>
                                    <th className="p-4 font-medium text-center">Rol</th>
                                    <th className="p-4 font-medium text-center">Plan Actual</th>
                                    <th className="p-4 font-medium text-center">Acciones Plan VIP</th>
                                    <th className="p-4 font-medium text-center">Privilegios</th>
                                    <th className="p-4 font-medium text-right">Peligro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {usuarios.map(u => (
                                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <p className="font-medium">{u.nombre}</p>
                                            <p className="text-xs text-white/40">{u.email}</p>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.rol === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-white/50'}`}>
                                                {u.rol?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                u.plan === 'oro' ? 'bg-yellow-500/20 text-yellow-300' : 
                                                u.plan === 'plata' ? 'bg-gray-400/20 text-gray-300' : 
                                                'bg-white/10 text-white/50'
                                            }`}>
                                                {u.plan?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {u.plan !== 'free' && (
                                                    <button onClick={() => handleActualizarPlan(u._id, 'free')} className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors">
                                                        Quitar VIP
                                                    </button>
                                                )}
                                                {u.plan !== 'plata' && (
                                                    <button onClick={() => handleActualizarPlan(u._id, 'plata')} className="text-xs text-gray-800 bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded transition-colors font-medium">
                                                        Dar Plata
                                                    </button>
                                                )}
                                                {u.plan !== 'oro' && (
                                                    <button onClick={() => handleActualizarPlan(u._id, 'oro')} className="text-xs text-yellow-900 bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded transition-colors font-bold flex items-center gap-1">
                                                        <Crown size={12} /> Dar Oro
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {u.rol !== 'admin' ? (
                                                <button onClick={() => handleActualizarRol(u._id, 'admin')} className="text-xs text-red-200 bg-red-900/40 hover:bg-red-900/80 px-2 py-1 rounded transition-colors flex items-center gap-1 mx-auto">
                                                    <Shield size={12} /> Hacer Admin
                                                </button>
                                            ) : (
                                                <button onClick={() => handleActualizarRol(u._id, 'user')} disabled={u.email === usuario.email} className="text-xs text-white/50 bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors disabled:opacity-20 flex items-center gap-1 mx-auto">
                                                    Quitar Admin
                                                </button>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleEliminarUsuario(u._id, u.email)}
                                                disabled={u.email === usuario.email}
                                                className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-20 inline-block"
                                                title="Eliminar usuario"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {usuarios.length === 0 && (
                            <p className="text-center text-white/40 p-8">No hay usuarios registrados</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
