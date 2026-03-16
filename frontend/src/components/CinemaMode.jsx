import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useMusicVideo } from '../context/MusicVideoContext';

/**
 * CinemaMode — Slideshow cronológico (antiguo → reciente).
 * Las fotos se muestran con música de fondo.
 * Los videos pausan la música y la reanudan al terminar.
 *
 * Props:
 *   - items: array combinado de fotos y videos ordenados cronológicamente
 *   - onClose: callback para cerrar el modo cine
 */
const CinemaMode = ({ items, onClose }) => {
    const [indiceActual, setIndiceActual] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const [mostrarControles, setMostrarControles] = useState(true);
    const [animando, setAnimando] = useState(false);
    const videoRef = useRef(null);
    const timerAutoPlayRef = useRef(null);
    const { playMusic, pauseMusic, onVideoPlay, onVideoEnd, isPlaying, volumen, setVolumen } = useMusicVideo();

    const itemActual = items[indiceActual];
    const esVideo = itemActual?.tipo === 'video';

    // ── Navegar al siguiente item ────────────────────────────────────────────
    const irASiguiente = useCallback(() => {
        if (animando) return;
        setAnimando(true);
        setTimeout(() => {
            setIndiceActual((prev) => (prev + 1) % items.length);
            setAnimando(false);
        }, 500);
    }, [animando, items.length]);

    const irAAnterior = useCallback(() => {
        if (animando) return;
        setAnimando(true);
        setTimeout(() => {
            setIndiceActual((prev) => (prev - 1 + items.length) % items.length);
            setAnimando(false);
        }, 500);
    }, [animando, items.length]);

    // ── Auto-play: avanzar automáticamente cada 5 segundos (solo en fotos) ──
    useEffect(() => {
        if (autoPlay && !esVideo) {
            timerAutoPlayRef.current = setTimeout(irASiguiente, 5000);
        }
        return () => clearTimeout(timerAutoPlayRef.current);
    }, [autoPlay, esVideo, indiceActual, irASiguiente]);

    // ── Lógica de música al cambiar de slide ────────────────────────────────
    useEffect(() => {
        if (esVideo) {
            // Pausar música cuando aparece un video
            pauseMusic();
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(() => { });
            }
        } else {
            // Reanudar música cuando es una foto
            playMusic();
        }
    }, [indiceActual, esVideo, playMusic, pauseMusic]);

    // ── Iniciar música al entrar al modo cine ───────────────────────────────
    useEffect(() => {
        playMusic();
        // Ocultar controles tras 3 segundos de inactividad
        const timerControles = setTimeout(() => setMostrarControles(false), 3000);
        return () => {
            pauseMusic();
            clearTimeout(timerControles);
        };
    }, []);

    // ── Keyboard navigation ──────────────────────────────────────────────────
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowRight') irASiguiente();
            if (e.key === 'ArrowLeft') irAAnterior();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [irASiguiente, irAAnterior, onClose]);

    const mostrarControlsTemporalmente = () => {
        setMostrarControles(true);
        clearTimeout(timerAutoPlayRef.current);
        timerAutoPlayRef.current = setTimeout(() => setMostrarControles(false), 3000);
    };

    return (
        <div
            className="cinema-overlay"
            onMouseMove={mostrarControlsTemporalmente}
            onClick={mostrarControlsTemporalmente}
            id="cinema-mode"
        >
            {/* ── Fondo con blur de la imagen actual ──── */}
            {!esVideo && (
                <div
                    className="absolute inset-0 opacity-20 blur-2xl scale-110 bg-cover bg-center transition-all duration-1000"
                    style={{ backgroundImage: `url(${itemActual?.url})` }}
                />
            )}

            {/* ── Slide principal ─────────────────────────────────────────────── */}
            <div className={`relative z-10 max-h-[80vh] max-w-[90vw] flex items-center justify-center transition-all duration-500 ${animando ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                {esVideo ? (
                    <video
                        ref={videoRef}
                        src={itemActual.url}
                        className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-2xl"
                        controls
                        onPlay={onVideoPlay}
                        onEnded={() => { onVideoEnd(); irASiguiente(); }}
                        onPause={onVideoEnd}
                    />
                ) : (
                    <img
                        src={itemActual?.url}
                        alt={itemActual?.titulo || 'Recuerdo'}
                        className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
                    />
                )}
            </div>

            {/* ── Título del slide ─────────────────────────────────────────────── */}
            {itemActual?.titulo && (
                <p className="absolute bottom-28 left-1/2 -translate-x-1/2 text-white/80 font-serif italic text-lg text-center px-4">
                    {itemActual.titulo}
                </p>
            )}

            {/* ── Indicador de posición ────────────────────────────────────────── */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                {items.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndiceActual(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === indiceActual ? 'bg-memorial-accent w-6' : 'bg-white/40'}`}
                    />
                ))}
            </div>

            {/* ── Controles (aparecen y desaparecen) ──────────────────────────── */}
            <div className={`absolute inset-0 z-[60] pointer-events-none flex items-center justify-between px-2 md:px-6 transition-opacity duration-500 ${mostrarControles ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
                <button
                    onClick={(e) => { e.stopPropagation(); irAAnterior(); }}
                    className="p-3 bg-black/50 pointer-events-auto rounded-full text-white hover:bg-memorial-accent hover:text-memorial-dark transition-all transform hover:scale-110"
                    id="cinema-prev"
                >
                    <ChevronLeft size={32} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); irASiguiente(); }}
                    className="p-3 bg-black/50 pointer-events-auto rounded-full text-white hover:bg-memorial-accent hover:text-memorial-dark transition-all transform hover:scale-110"
                    id="cinema-next"
                >
                    <ChevronRight size={32} />
                </button>
            </div>

            {/* ── Barra superior ───────────────────────────────────────────────── */}
            <div className={`absolute top-0 left-0 right-0 z-[60] pointer-events-none flex items-center justify-between p-4 px-4 md:px-8 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 ${mostrarControles ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
                <span className="text-white/80 text-sm font-mono bg-black/30 px-3 py-1 rounded-full pointer-events-auto">
                    {indiceActual + 1} / {items.length}
                </span>

                <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
                    {/* Control de volumen */}
                    <button
                        onClick={() => setVolumen(volumen > 0 ? 0 : 0.6)}
                        className="text-white/70 hover:text-memorial-accent transition-colors"
                        id="cinema-volume"
                    >
                        {volumen > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>

                    {/* Auto-play toggle */}
                    <button
                        onClick={() => setAutoPlay(!autoPlay)}
                        className="text-white/70 hover:text-memorial-accent transition-colors"
                        id="cinema-autoplay"
                    >
                        {autoPlay ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    {/* Cerrar modo cine */}
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 rounded-full text-white hover:bg-red-500 transition-all"
                        id="cinema-close"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CinemaMode;
