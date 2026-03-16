import { useState } from 'react';
import { X, Play, Image, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMusicVideo } from '../context/MusicVideoContext';

/**
 * Gallery — Galería de fotos y videos.
 * Dos pestañas: Fotos | Videos
 * Orden: del más reciente al más antiguo.
 * Incluye lightbox para ver imágenes ampliadas.
 *
 * Props:
 *   - fotos: array de objetos foto
 *   - videos: array de objetos video
 */
const Gallery = ({ fotos = [], videos = [] }) => {
    const [tabActiva, setTabActiva] = useState('fotos');
    const [fotoAmpliada, setFotoAmpliada] = useState(null);
    const { onVideoPlay, onVideoEnd } = useMusicVideo();

    // Ordenar del más reciente al más antiguo
    const fotosOrdenadas = [...fotos].sort(
        (a, b) => new Date(b.fecha || b.createdAt) - new Date(a.fecha || a.createdAt)
    );
    const videosOrdenados = [...videos].sort(
        (a, b) => new Date(b.fecha || b.createdAt) - new Date(a.fecha || a.createdAt)
    );

    // Funciones de navegación para el Lightbox
    const irFotoAnterior = (e) => {
        e.stopPropagation();
        if (!fotoAmpliada) return;
        const indexAct = fotosOrdenadas.findIndex(f => f._id === fotoAmpliada._id);
        const prevIndex = (indexAct - 1 + fotosOrdenadas.length) % fotosOrdenadas.length;
        setFotoAmpliada(fotosOrdenadas[prevIndex]);
    };

    const irFotoSiguiente = (e) => {
        e.stopPropagation();
        if (!fotoAmpliada) return;
        const indexAct = fotosOrdenadas.findIndex(f => f._id === fotoAmpliada._id);
        const nextIndex = (indexAct + 1) % fotosOrdenadas.length;
        setFotoAmpliada(fotosOrdenadas[nextIndex]);
    };

    return (
        <section className="w-full max-w-4xl mx-auto" id="gallery-section">
            {/* ── Tabs ─────────────────────────────────────────────────────────── */}
            <div className="flex border-b border-white/10 mb-6">
                <button
                    onClick={() => setTabActiva('fotos')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 ${tabActiva === 'fotos'
                            ? 'border-memorial-accent text-memorial-accent'
                            : 'border-transparent text-white/50 hover:text-white/80'
                        }`}
                    id="tab-fotos"
                >
                    <Image size={18} />
                    Fotos ({fotosOrdenadas.length})
                </button>
                <button
                    onClick={() => setTabActiva('videos')}
                    className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 ${tabActiva === 'videos'
                            ? 'border-memorial-accent text-memorial-accent'
                            : 'border-transparent text-white/50 hover:text-white/80'
                        }`}
                    id="tab-videos"
                >
                    <Play size={18} />
                    Videos ({videosOrdenados.length})
                </button>
            </div>

            {/* ── Grid de Fotos ─────────────────────────────────────────────────── */}
            {tabActiva === 'fotos' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-fade-in">
                    {fotosOrdenadas.length === 0 ? (
                        <p className="col-span-full text-center text-white/40 py-12">No hay fotos aún.</p>
                    ) : (
                        fotosOrdenadas.map((foto) => (
                            <button
                                key={foto._id}
                                onClick={() => setFotoAmpliada(foto)}
                                className="aspect-square rounded-xl overflow-hidden group relative bg-white/5 hover:scale-105 transition-transform duration-300"
                            >
                                <img
                                    src={foto.url}
                                    alt={foto.titulo || 'Recuerdo'}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                {foto.titulo && (
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                        <span className="text-white text-xs font-medium truncate">{foto.titulo}</span>
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            )}

            {/* ── Grid de Videos ───────────────────────────────────────────────── */}
            {tabActiva === 'videos' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                    {videosOrdenados.length === 0 ? (
                        <p className="col-span-full text-center text-white/40 py-12">No hay videos aún.</p>
                    ) : (
                        videosOrdenados.map((video) => (
                            <div key={video._id} className="rounded-xl overflow-hidden bg-black/40 border border-white/10">
                                <video
                                    src={video.url}
                                    className="w-full aspect-video object-cover"
                                    controls
                                    preload="metadata"
                                    onPlay={onVideoPlay}
                                    onEnded={onVideoEnd}
                                    onPause={onVideoEnd}
                                />
                                {video.titulo && (
                                    <p className="px-3 py-2 text-sm text-white/70 font-medium">{video.titulo}</p>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* ── Lightbox ─────────────────────────────────────────────────────── */}
            {fotoAmpliada && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 touch-none"
                    onClick={() => setFotoAmpliada(null)}
                    id="gallery-lightbox"
                >
                    <button
                        className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-red-500 transition-all z-50"
                        onClick={() => setFotoAmpliada(null)}
                    >
                        <X size={24} />
                    </button>

                    {/* Controles de navegación */}
                    {fotosOrdenadas.length > 1 && (
                        <>
                            <button
                                onClick={irFotoAnterior}
                                className="absolute left-4 p-3 bg-black/50 rounded-full text-white hover:bg-memorial-accent hover:text-black transition-all z-50"
                            >
                                <ChevronLeft size={28} />
                            </button>
                            <button
                                onClick={irFotoSiguiente}
                                className="absolute right-4 p-3 bg-black/50 rounded-full text-white hover:bg-memorial-accent hover:text-black transition-all z-50"
                            >
                                <ChevronRight size={28} />
                            </button>
                        </>
                    )}

                    <img
                        src={fotoAmpliada.url}
                        alt={fotoAmpliada.titulo || 'Recuerdo'}
                        className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl select-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            // Tap en la imagen en móvil avanza a la siguiente
                            irFotoSiguiente(e);
                        }}
                    />
                    {fotoAmpliada.titulo && (
                        <p className="absolute bottom-6 text-white/90 font-serif italic text-lg bg-black/50 px-4 py-1 rounded-full">{fotoAmpliada.titulo}</p>
                    )}
                </div>
            )}
        </section>
    );
};

export default Gallery;
