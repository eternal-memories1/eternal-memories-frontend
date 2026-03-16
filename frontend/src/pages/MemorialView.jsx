import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Calendar, Heart, MapPin } from 'lucide-react';
import { obtenerMemorial } from '../services/api';
import { useMusicVideo } from '../context/MusicVideoContext';
import CinemaMode from '../components/CinemaMode';
import Gallery from '../components/Gallery';
import AdSlot from '../components/AdSlot';
import QRDisplay from '../components/QRDisplay';

/**
 * MemorialView — Vista pública del memorial.
 * Accesible al escanear el código QR.
 * Incluye: cabecera, botón de modo cine, galería y anuncios.
 */
const MemorialView = () => {
    const { slug } = useParams();
    const [memorial, setMemorial] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [modoCineActivo, setModoCineActivo] = useState(false);
    const { cargarMusica } = useMusicVideo();

    useEffect(() => {
        const cargarMemorial = async () => {
            try {
                const res = await obtenerMemorial(slug);
                setMemorial(res.data);
                // Cargar la música en el contexto global si el memorial tiene música
                if (res.data.musicaUrl) {
                    cargarMusica(res.data.musicaUrl);
                }
            } catch (err) {
                setError('Memorial no encontrado o no disponible.');
            } finally {
                setCargando(false);
            }
        };
        cargarMemorial();
    }, [slug, cargarMusica]);

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-memorial-dark">
                <div className="text-center animate-pulse">
                    <div className="text-5xl mb-4">🕊️</div>
                    <p className="text-memorial-accent font-serif text-xl">Cargando recuerdos...</p>
                </div>
            </div>
        );
    }

    if (error || !memorial) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-memorial-dark">
                <div className="text-center">
                    <div className="text-5xl mb-4">🕯️</div>
                    <p className="text-white/60 font-serif text-xl">{error || 'Memorial no encontrado'}</p>
                </div>
            </div>
        );
    }

    // ── Combinar fotos y videos ordenados cronológicamente para el modo cine ─
    const itemsCine = [
        ...memorial.fotosOrdenadas.map((f) => ({ ...f, tipo: 'foto' })),
        ...memorial.videosOrdenados.map((v) => ({ ...v, tipo: 'video' })),
    ].sort((a, b) => new Date(a.fecha || a.createdAt) - new Date(b.fecha || b.createdAt));

    // Calcular años de vida
    const anioNac = new Date(memorial.fechaNacimiento).getFullYear();
    const anioFall = new Date(memorial.fechaFallecimiento).getFullYear();
    const formatearFecha = (fecha) =>
        new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className={`min-h-screen tema-${memorial.tema}`} style={{ backgroundColor: memorial.colorFondo }}>
            {/* ── Modo Cine (pantalla completa) ─────────────────────────────────── */}
            {modoCineActivo && itemsCine.length > 0 && (
                <CinemaMode items={itemsCine} onClose={() => setModoCineActivo(false)} />
            )}

            {/* ── Anuncio superior ─────────────────────────────────────────────── */}
            <AdSlot position="top" className="mx-auto max-w-4xl my-3 px-4" plan={memorial.propietarioPlan} />

            {/* ── Cabecera del memorial ────────────────────────────────────────── */}
            <header className="relative py-16 px-4 text-center overflow-hidden" id="memorial-header">
                {/* Estrellas decorativas de fondo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full opacity-40"
                            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${i * 0.3}s` }}
                        />
                    ))}
                </div>

                {/* Vela animada */}
                <div className="text-6xl mb-6 animate-candle inline-block">🕯️</div>

                {/* Nombre del difunto */}
                <h1 className="font-serif text-3xl md:text-5xl text-white mb-2 leading-tight">
                    Siempre te recordaremos
                </h1>
                <h2 className="font-serif text-4xl md:text-6xl gradient-text font-bold mb-6">
                    {memorial.nombre}
                </h2>

                {/* Fechas de vida */}
                <div className="flex items-center justify-center gap-4 text-white/60 mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-memorial-accent" />
                        <span className="font-light">{formatearFecha(memorial.fechaNacimiento)}</span>
                    </div>
                    <span className="text-memorial-accent text-2xl">✦</span>
                    <div className="flex items-center gap-2">
                        <Heart size={16} className="text-memorial-accent" />
                        <span className="font-light">{formatearFecha(memorial.fechaFallecimiento)}</span>
                    </div>
                </div>
                <p className="text-memorial-accent/70 text-sm mb-8">{anioNac} — {anioFall} · {anioFall - anioNac} años</p>

                {/* Biografía */}
                {memorial.biografia && (
                    <p className="max-w-2xl mx-auto text-white/70 font-serif italic text-lg leading-relaxed mb-8">
                        "{memorial.biografia}"
                    </p>
                )}

                {/* ── Botón Play / Comenzar Modo Cine ────────────────────────────── */}
                {itemsCine.length > 0 && (
                    <button
                        onClick={() => setModoCineActivo(true)}
                        className="btn-gold group flex items-center gap-3 mx-auto text-lg animate-pulse-glow"
                        id="btn-cinema-mode"
                        aria-label="Iniciar modo cine"
                    >
                        <div className="w-10 h-10 rounded-full bg-memorial-dark/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play size={20} fill="currentColor" />
                        </div>
                        Comenzar recorrido
                    </button>
                )}

                {/* Contador de visitas */}
                <p className="mt-4 text-white/30 text-xs">
                    <MapPin size={12} className="inline mr-1" />
                    {memorial.visitas} personas han visitado este memorial
                </p>
            </header>

            {/* ── Separador ────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-4 max-w-2xl mx-auto px-8 py-2">
                <div className="flex-1 h-px bg-memorial-accent/20" />
                <span className="text-memorial-accent text-xl">✦</span>
                <div className="flex-1 h-px bg-memorial-accent/20" />
            </div>

            {/* ── Galería ───────────────────────────────────────────────────────── */}
            <main className="px-4 pb-8 max-w-4xl mx-auto">
                <Gallery fotos={memorial.fotos} videos={memorial.videos} />
            </main>

            {/* ── QR del memorial ──────────────────────────────────────────────── */}
            <div className="flex justify-center py-8">
                <QRDisplay slug={memorial.slug} />
            </div>

            {/* ── Anuncio inferior ─────────────────────────────────────────────── */}
            <AdSlot position="bottom" className="mx-auto max-w-4xl my-3 px-4" plan={memorial.propietarioPlan} />

            {/* ── Footer ───────────────────────────────────────────────────────── */}
            <footer className="text-center py-6 text-white/20 text-xs border-t border-white/5">
                <p>🕊️ Eternal Memories · Honrando recuerdos eternos</p>
            </footer>
        </div>
    );
};

export default MemorialView;
