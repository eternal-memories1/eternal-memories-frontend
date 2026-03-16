import { useState, useEffect } from 'react';
import { Plus, LogOut, ExternalLink, Upload, Music, Trash2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    crearMemorial, listarMisMemoriales, actualizarTema,
    subirFotos, subirVideo, subirMusica
} from '../services/api';
import ThemePicker from '../components/ThemePicker';
import QRDisplay from '../components/QRDisplay';
import EditMemorialModal from '../components/EditMemorialModal';
import MediaManager from '../components/MediaManager';

const Dashboard = () => {
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();
    const [memoriales, setMemoriales] = useState([]);
    const [memorialSeleccionado, setMemorialSeleccionado] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editandoInfo, setEditandoInfo] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [subiendo, setSubiendo] = useState(false);
    const [mensaje, setMensaje] = useState('');

    // ── Estado del formulario para nuevo memorial ─────────────────────────────
    const [form, setForm] = useState({
        nombre: '', fechaNacimiento: '', fechaFallecimiento: '', biografia: '',
        tema: 'oscuro', colorFondo: '#1a1a2e',
    });

    useEffect(() => {
        listarMisMemoriales()
            .then((res) => {
                setMemoriales(res.data.memoriales);
                if (res.data.memoriales.length > 0) setMemorialSeleccionado(res.data.memoriales[0]);
            })
            .catch(console.error)
            .finally(() => setCargando(false));
    }, []);

    const mostrarMensaje = (msg) => {
        setMensaje(msg);
        setTimeout(() => setMensaje(''), 3000);
    };

    // ── Crear memorial ────────────────────────────────────────────────────────
    const handleCrearMemorial = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            const res = await crearMemorial(form);
            const nuevoMemorial = res.data.memorial;
            setMemoriales([nuevoMemorial, ...memoriales]);
            setMemorialSeleccionado(nuevoMemorial);
            setMostrarFormulario(false);
            mostrarMensaje('✅ Memorial creado exitosamente');
        } catch (err) {
            mostrarMensaje('❌ ' + (err.response?.data?.error || 'Error al crear el memorial'));
        } finally {
            setCargando(false);
        }
    };

    // ── Subir fotos ───────────────────────────────────────────────────────────
    const handleSubirFotos = async (e) => {
        const archivos = e.target.files;
        if (!archivos.length || !memorialSeleccionado) return;
        const formData = new FormData();
        Array.from(archivos).forEach((f) => formData.append('fotos', f));
        try {
            setSubiendo(true);
            await subirFotos(memorialSeleccionado._id, formData);
            mostrarMensaje(`✅ ${archivos.length} foto(s) subida(s)`);
            // Refrescar datos
            listarMisMemoriales().then((r) => {
                setMemoriales(r.data.memoriales);
                const actualizado = r.data.memoriales.find((m) => m._id === memorialSeleccionado._id);
                if (actualizado) setMemorialSeleccionado(actualizado);
            });
        } catch (err) {
            mostrarMensaje('❌ ' + (err.response?.data?.error || 'Error al subir fotos'));
        } finally {
            setSubiendo(false);
        }
    };

    // ── Subir video ───────────────────────────────────────────────────────────
    const handleSubirVideo = async (e) => {
        const archivo = e.target.files[0];
        if (!archivo || !memorialSeleccionado) return;
        const formData = new FormData();
        formData.append('video', archivo);
        try {
            setSubiendo(true);
            await subirVideo(memorialSeleccionado._id, formData);
            mostrarMensaje('✅ Video subido exitosamente');
            listarMisMemoriales().then((r) => {
                setMemoriales(r.data.memoriales);
                const actualizado = r.data.memoriales.find((m) => m._id === memorialSeleccionado._id);
                if (actualizado) setMemorialSeleccionado(actualizado);
            });
        } catch (err) {
            mostrarMensaje('❌ ' + (err.response?.data?.error || 'Error al subir video'));
        } finally {
            setSubiendo(false);
        }
    };

    // ── Subir música ──────────────────────────────────────────────────────────
    const handleSubirMusica = async (e) => {
        const archivo = e.target.files[0];
        if (!archivo || !memorialSeleccionado) return;
        const formData = new FormData();
        formData.append('musica', archivo);
        try {
            setSubiendo(true);
            await subirMusica(memorialSeleccionado._id, formData);
            mostrarMensaje('✅ Música actualizada');
        } catch (err) {
            mostrarMensaje('❌ Error al subir música');
        } finally {
            setSubiendo(false);
        }
    };

    // ── Cambiar tema ──────────────────────────────────────────────────────────
    const handleCambiarTema = async ({ tema, colorFondo }) => {
        if (!memorialSeleccionado) return;
        try {
            await actualizarTema(memorialSeleccionado._id, tema, colorFondo);
            setMemorialSeleccionado({ ...memorialSeleccionado, tema, colorFondo });
            mostrarMensaje('✅ Tema actualizado');
        } catch (err) {
            mostrarMensaje('❌ Error al actualizar tema');
        }
    };

    // ── Refrescar memorial seleccionado ───────────────────────────────────────
    const handleRecargarMemorial = () => {
        listarMisMemoriales().then((r) => {
            setMemoriales(r.data.memoriales);
            const actualizado = r.data.memoriales.find((m) => m._id === memorialSeleccionado._id);
            if (actualizado) setMemorialSeleccionado(actualizado);
        });
    };

    const handleLogout = () => { cerrarSesion(); navigate('/'); };

    return (
        <div className="min-h-screen bg-memorial-dark text-white">
            {/* ── Barra de navegación ────────────────────────────────────────────── */}
            <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between bg-memorial-medium/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🕊️</span>
                    <span className="font-serif text-xl gradient-text">Eternal Memories</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-white/50 text-sm hidden sm:block">{usuario?.email}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${['plata', 'oro'].includes(usuario?.plan) ? 'bg-memorial-accent text-memorial-dark' : 'bg-white/10 text-white/60'}`}>
                        {usuario?.plan === 'free' ? 'Plan Gratuito' : `Plan ${usuario?.plan.charAt(0).toUpperCase() + usuario?.plan.slice(1)}`}
                    </span>
                    <button onClick={() => navigate('/pricing')} className="text-xs sm:text-sm font-medium hover:text-memorial-accent transition-colors ml-1 sm:ml-2 whitespace-nowrap">
                        {usuario?.plan === 'oro' ? 'Ver Planes' : '⭐ Mejorar'}
                    </button>
                    {usuario?.rol === 'admin' && (
                        <button onClick={() => navigate('/admin')} className="text-xs sm:text-sm font-medium text-red-300 hover:text-red-400 transition-colors ml-1 sm:ml-2 bg-red-500/10 px-2 sm:px-3 py-1 rounded-full border border-red-500/20 whitespace-nowrap">
                            👑<span className="hidden lg:inline"> Panel Admin</span>
                        </button>
                    )}
                    <button onClick={handleLogout} className="text-white/40 hover:text-red-400 transition-colors ml-4" title="Cerrar sesión">
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Sidebar izquierdo: lista de memoriales ─────────────────────── */}
                <aside className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-white/80">Mis Memoriales</h2>
                        <button
                            onClick={() => setMostrarFormulario(!mostrarFormulario)}
                            className="btn-gold text-sm flex items-center gap-1 px-4 py-2"
                            id="btn-nuevo-memorial"
                        >
                            <Plus size={16} />
                            Nuevo
                        </button>
                    </div>

                    {/* Formulario nuevo memorial */}
                    {mostrarFormulario && (
                        <form onSubmit={handleCrearMemorial} className="card-glass p-4 space-y-3 animate-slide-up">
                            <h3 className="text-memorial-accent font-medium">Crear memorial</h3>
                            <input
                                required
                                placeholder="Nombre completo"
                                value={form.nombre}
                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-memorial-accent"
                                id="input-nombre"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-xs text-white/40">Nacimiento</label>
                                    <input
                                        type="date"
                                        required
                                        value={form.fechaNacimiento}
                                        onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-memorial-accent"
                                        id="input-fecha-nac"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-white/40">Fallecimiento</label>
                                    <input
                                        type="date"
                                        required
                                        value={form.fechaFallecimiento}
                                        onChange={(e) => setForm({ ...form, fechaFallecimiento: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-memorial-accent"
                                        id="input-fecha-fall"
                                    />
                                </div>
                            </div>
                            <textarea
                                placeholder="Biografía (opcional)"
                                value={form.biografia}
                                onChange={(e) => setForm({ ...form, biografia: e.target.value })}
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-memorial-accent resize-none"
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="btn-gold text-sm flex-1 py-2">Crear</button>
                                <button type="button" onClick={() => setMostrarFormulario(false)} className="btn-ghost text-sm flex-1 py-2">Cancelar</button>
                            </div>
                        </form>
                    )}

                    {/* Lista de memoriales */}
                    <div className="space-y-2">
                        {cargando && <p className="text-white/40 text-sm animate-pulse">Cargando...</p>}
                        {!cargando && memoriales.length === 0 && (
                            <p className="text-white/30 text-sm text-center py-8">No tienes memoriales aún.</p>
                        )}
                        {memoriales.map((m) => (
                            <button
                                key={m._id}
                                onClick={() => setMemorialSeleccionado(m)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${memorialSeleccionado?._id === m._id
                                    ? 'border-memorial-accent bg-memorial-accent/10'
                                    : 'border-white/10 bg-white/5 hover:border-white/30'
                                    }`}
                            >
                                <p className="font-serif font-medium text-white truncate">{m.nombre}</p>
                                <p className="text-white/40 text-xs mt-1">
                                    {new Date(m.fechaNacimiento).getFullYear()} — {new Date(m.fechaFallecimiento).getFullYear()}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-white/30">{m.fotos.length} fotos · {m.videos.length} videos</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* ── Panel derecho: gestión del memorial seleccionado ───────────── */}
                <main className="lg:col-span-2 space-y-4">
                    {/* Notificación / mensaje de estado */}
                    {mensaje && (
                        <div className="card-glass p-3 text-center text-sm animate-fade-in border border-memorial-accent/30">
                            {mensaje}
                        </div>
                    )}

                    {!memorialSeleccionado ? (
                        <div className="card-glass p-12 text-center text-white/30">
                            <div className="text-5xl mb-4">🕯️</div>
                            <p>Selecciona o crea un memorial para empezar</p>
                        </div>
                    ) : (
                        <>
                            {/* Encabezado del memorial seleccionado */}
                            <div className="card-glass p-5 flex items-center justify-between">
                                <div>
                                    <h2 className="font-serif text-2xl text-white flex items-center gap-3">
                                        {memorialSeleccionado.nombre}
                                        <button onClick={() => setEditandoInfo(true)} className="text-white/40 hover:text-white transition-colors">
                                            <Edit3 size={18} />
                                        </button>
                                    </h2>
                                    <p className="text-white/40 text-sm mt-1">/{memorialSeleccionado.slug}</p>
                                </div>
                                <a
                                    href={`/memorial/${memorialSeleccionado.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-ghost text-sm flex items-center gap-2"
                                    id="btn-ver-memorial"
                                >
                                    <ExternalLink size={16} />
                                    Ver público
                                </a>
                            </div>

                            {/* Estadísticas */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Fotos', value: `${memorialSeleccionado.fotos.length}/50`, icon: '📷' },
                                    { label: 'Videos', value: `${memorialSeleccionado.videos.length}/10`, icon: '🎬' },
                                    { label: 'Visitas', value: memorialSeleccionado.visitas || 0, icon: '👁️' },
                                ].map((stat) => (
                                    <div key={stat.label} className="card-glass p-4 text-center">
                                        <div className="text-2xl">{stat.icon}</div>
                                        <div className="text-memorial-accent font-bold text-xl">{stat.value}</div>
                                        <div className="text-white/40 text-xs">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Subida de archivos */}
                            <div className="card-glass p-5 space-y-4">
                                <h3 className="text-white font-semibold">Agregar contenido</h3>
                                {subiendo && <p className="text-memorial-accent text-sm animate-pulse">Subiendo archivos...</p>}

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {/* Fotos */}
                                    <label className="cursor-pointer card-glass p-4 flex flex-col items-center gap-2 hover:border-memorial-accent/50 transition-colors border border-white/10 rounded-xl">
                                        <Upload size={24} className="text-memorial-accent" />
                                        <span className="text-white text-sm font-medium">Subir Fotos</span>
                                        <span className="text-white/30 text-xs">JPG, PNG, WEBP</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="sr-only"
                                            onChange={handleSubirFotos}
                                            id="input-fotos"
                                            disabled={subiendo}
                                        />
                                    </label>

                                    {/* Videos */}
                                    <label className="cursor-pointer card-glass p-4 flex flex-col items-center gap-2 hover:border-memorial-accent/50 transition-colors border border-white/10 rounded-xl">
                                        <Upload size={24} className="text-blue-400" />
                                        <span className="text-white text-sm font-medium">Subir Video</span>
                                        <span className="text-white/30 text-xs">MP4, MOV (máx 5 min)</span>
                                        <input
                                            type="file"
                                            accept="video/*"
                                            className="sr-only"
                                            onChange={handleSubirVideo}
                                            id="input-video"
                                            disabled={subiendo}
                                        />
                                    </label>

                                    {/* Música */}
                                    <label className="cursor-pointer card-glass p-4 flex flex-col items-center gap-2 hover:border-memorial-accent/50 transition-colors border border-white/10 rounded-xl">
                                        <Music size={24} className="text-purple-400" />
                                        <span className="text-white text-sm font-medium">Música de fondo</span>
                                        <span className="text-white/30 text-xs">MP3, WAV</span>
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            className="sr-only"
                                            onChange={handleSubirMusica}
                                            id="input-musica"
                                            disabled={subiendo}
                                        />
                                    </label>
                                </div>
                            </div>
                            
                            {/* Componente para gestionar fotos, videos y música subidos */}
                            <MediaManager 
                                memorial={memorialSeleccionado} 
                                onUpdate={handleRecargarMemorial} 
                            />

                            {/* Selector de tema */}
                            <ThemePicker
                                temaActual={memorialSeleccionado.tema}
                                colorActual={memorialSeleccionado.colorFondo}
                                onCambiar={handleCambiarTema}
                            />

                            {/* QR */}
                            <div className="flex justify-center">
                                <QRDisplay slug={memorialSeleccionado.slug} />
                            </div>

                            {/* Modal de edición */}
                            {editandoInfo && (
                                <EditMemorialModal 
                                    memorial={memorialSeleccionado}
                                    onClose={() => setEditandoInfo(false)}
                                    onUpdated={(actualizado) => {
                                        setEditandoInfo(false);
                                        mostrarMensaje('✅ Memorial actualizado');
                                        handleRecargarMemorial();
                                    }}
                                    onDeleted={(id) => {
                                        setEditandoInfo(false);
                                        setMemoriales(memoriales.filter(m => m._id !== id));
                                        setMemorialSeleccionado(null);
                                        mostrarMensaje('✅ Memorial eliminado');
                                    }}
                                />
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
