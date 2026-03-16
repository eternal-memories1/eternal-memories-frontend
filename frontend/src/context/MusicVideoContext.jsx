import { createContext, useContext, useRef, useState, useCallback } from 'react';

// ── Contexto global para sincronizar música y videos ─────────────────────────
const MusicVideoContext = createContext(null);

export const MusicVideoProvider = ({ children }) => {
    const audioRef = useRef(null);               // Referencia al elemento <audio> global
    const [isPlaying, setIsPlaying] = useState(false);
    const [musicaUrl, setMusicaUrl] = useState('');
    const [volumen, setVolumen] = useState(0.6);

    // ── Iniciar la música ──────────────────────────────────────────────────────
    const playMusic = useCallback(() => {
        if (audioRef.current && musicaUrl) {
            audioRef.current.volume = volumen;
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch((e) => console.warn('No se pudo reproducir la música:', e));
        }
    }, [musicaUrl, volumen]);

    // ── Pausar la música ───────────────────────────────────────────────────────
    const pauseMusic = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    // ── Evento: un video comenzó a reproducirse → pausar música ──────────────
    const onVideoPlay = useCallback(() => {
        pauseMusic();
    }, [pauseMusic]);

    // ── Evento: un video terminó o fue pausado → reanudar música ─────────────
    const onVideoEnd = useCallback(() => {
        playMusic();
    }, [playMusic]);

    // ── Cambiar URL de música (cuando se carga el memorial) ───────────────────
    const cargarMusica = useCallback((url) => {
        setMusicaUrl(url);
        setIsPlaying(false);
        if (audioRef.current) audioRef.current.pause();
    }, []);

    return (
        <MusicVideoContext.Provider
            value={{ isPlaying, musicaUrl, volumen, audioRef, playMusic, pauseMusic, onVideoPlay, onVideoEnd, cargarMusica, setVolumen }}
        >
            {/* Elemento de audio global oculto que controla toda la música del memorial */}
            {musicaUrl && (
                <audio
                    ref={audioRef}
                    src={musicaUrl}
                    loop
                    preload="auto"
                    style={{ display: 'none' }}
                    onEnded={() => setIsPlaying(false)}
                />
            )}
            {children}
        </MusicVideoContext.Provider>
    );
};

// ── Hook personalizado para usar el contexto ─────────────────────────────────
export const useMusicVideo = () => {
    const ctx = useContext(MusicVideoContext);
    if (!ctx) throw new Error('useMusicVideo debe usarse dentro de MusicVideoProvider');
    return ctx;
};

export default MusicVideoContext;
