import { useState } from 'react';
import { Trash2, Edit3, Music, X, Check } from 'lucide-react';
import {
    eliminarFoto, actualizarFoto,
    eliminarVideo, actualizarVideo,
    eliminarMusica
} from '../services/api';

const MediaManager = ({ memorial, onUpdate }) => {
    const [editandoMedia, setEditandoMedia] = useState(null); // { tipo: 'foto'|'video', id: '...', formData: {} }
    const [cargando, setCargando] = useState(false);

    const handleEliminarMusica = async () => {
        if (!window.confirm('¿Eliminar la música de fondo actual?')) return;
        try {
            setCargando(true);
            await eliminarMusica(memorial._id);
            onUpdate(); // Recarga los datos del memorial
        } catch (error) {
            alert('Error al eliminar música');
        } finally {
            setCargando(false);
        }
    };

    const handleEliminarItem = async (tipo, itemId) => {
        if (!window.confirm(`¿Eliminar este ${tipo}?`)) return;
        try {
            setCargando(true);
            if (tipo === 'foto') {
                await eliminarFoto(memorial._id, itemId);
            } else {
                await eliminarVideo(memorial._id, itemId);
            }
            onUpdate();
        } catch (error) {
            alert(`Error al eliminar ${tipo}`);
        } finally {
            setCargando(false);
        }
    };

    const handleGuardarEdicion = async () => {
        if (!editandoMedia) return;
        try {
            setCargando(true);
            if (editandoMedia.tipo === 'foto') {
                await actualizarFoto(memorial._id, editandoMedia.id, editandoMedia.formData);
            } else {
                await actualizarVideo(memorial._id, editandoMedia.id, editandoMedia.formData);
            }
            setEditandoMedia(null);
            onUpdate();
        } catch (error) {
            alert('Error al guardar cambios');
        } finally {
            setCargando(false);
        }
    };

    const iniciarEdicion = (tipo, item) => {
        setEditandoMedia({
            tipo,
            id: item._id,
            formData: { titulo: item.titulo || '', fecha: item.fecha ? item.fecha.split('T')[0] : '' }
        });
    };

    return (
        <div className="card-glass p-5 space-y-6 mt-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
                Gestión de Contenido Subido
                {cargando && <span className="text-xs text-memorial-accent animate-pulse">(Actualizando...)</span>}
            </h3>

            {/* ── Música ───────────────────────────────────────────────────────── */}
            {memorial.musicaUrl && (
                <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-white/80 w-full overflow-hidden">
                        <Music size={16} className="text-purple-400 shrink-0" />
                        <span className="truncate">{memorial.musicaNombre || 'Archivo de música'}</span>
                    </div>
                    <button
                        onClick={handleEliminarMusica}
                        disabled={cargando}
                        className="text-white/40 hover:text-red-400 transition-colors shrink-0 ml-2 p-2 bg-white/5 rounded-full"
                        title="Eliminar música"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}

            {/* ── Fotos ────────────────────────────────────────────────────────── */}
            {memorial.fotos?.length > 0 && (
                <div>
                    <h4 className="text-sm text-white/60 mb-3 border-b border-white/10 pb-1">Fotos ({memorial.fotos.length}/50)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {memorial.fotos.map((foto) => (
                            <div key={foto._id} className="relative group rounded-lg overflow-hidden border border-white/10 bg-black/50 aspect-square">
                                <img src={foto.url} alt={foto.titulo || 'Foto'} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                
                                {/* Overlay de edición */}
                                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2 gap-2">
                                    {editandoMedia?.id === foto._id ? (
                                        <div className="w-full space-y-2 flex flex-col items-center">
                                            <input 
                                                value={editandoMedia.formData.titulo} 
                                                onChange={(e) => setEditandoMedia({...editandoMedia, formData: {...editandoMedia.formData, titulo: e.target.value}})}
                                                className="w-full bg-white/10 text-xs text-white px-2 py-1 rounded placeholder-white/40 border border-white/20 focus:outline-none" 
                                                placeholder="Título" 
                                            />
                                            <input 
                                                type="date" 
                                                value={editandoMedia.formData.fecha} 
                                                onChange={(e) => setEditandoMedia({...editandoMedia, formData: {...editandoMedia.formData, fecha: e.target.value}})}
                                                className="w-full bg-white/10 text-xs text-white px-2 py-1 rounded border border-white/20 focus:outline-none" 
                                            />
                                            <div className="flex gap-2 w-full">
                                                <button onClick={() => setEditandoMedia(null)} className="flex-1 bg-white/20 hover:bg-white/30 text-white rounded py-1 flex justify-center"><X size={14}/></button>
                                                <button onClick={handleGuardarEdicion} className="flex-1 bg-memorial-accent hover:bg-yellow-500 text-black rounded py-1 flex justify-center"><Check size={14}/></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={() => iniciarEdicion('foto', foto)} className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors" title="Editar detalles">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleEliminarItem('foto', foto._id)} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors" title="Eliminar foto">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Título inferior (solo si no se está editando) */}
                                {editandoMedia?.id !== foto._id && foto.titulo && (
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-xs text-white truncate text-center">
                                        {foto.titulo}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Videos ───────────────────────────────────────────────────────── */}
            {memorial.videos?.length > 0 && (
                <div>
                    <h4 className="text-sm text-white/60 mb-3 border-b border-white/10 pb-1 mt-6">Videos ({memorial.videos.length}/10)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {memorial.videos.map((video) => (
                            <div key={video._id} className="relative group rounded-lg overflow-hidden border border-white/10 bg-black/50 aspect-video">
                                <video src={video.url} className="w-full h-full object-cover opacity-60" />
                                
                                {/* Overlay de edición */}
                                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2 gap-2">
                                    {editandoMedia?.id === video._id ? (
                                        <div className="w-full space-y-2 flex flex-col items-center">
                                            <input 
                                                value={editandoMedia.formData.titulo} 
                                                onChange={(e) => setEditandoMedia({...editandoMedia, formData: {...editandoMedia.formData, titulo: e.target.value}})}
                                                className="w-full bg-white/10 text-xs text-white px-2 py-1 rounded placeholder-white/40 border border-white/20 focus:outline-none" 
                                                placeholder="Título" 
                                            />
                                            <input 
                                                type="date" 
                                                value={editandoMedia.formData.fecha} 
                                                onChange={(e) => setEditandoMedia({...editandoMedia, formData: {...editandoMedia.formData, fecha: e.target.value}})}
                                                className="w-full bg-white/10 text-xs text-white px-2 py-1 rounded border border-white/20 focus:outline-none" 
                                            />
                                            <div className="flex gap-2 w-full">
                                                <button onClick={() => setEditandoMedia(null)} className="flex-1 bg-white/20 hover:bg-white/30 text-white rounded py-1 flex justify-center"><X size={14}/></button>
                                                <button onClick={handleGuardarEdicion} className="flex-1 bg-memorial-accent hover:bg-yellow-500 text-black rounded py-1 flex justify-center"><Check size={14}/></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={() => iniciarEdicion('video', video)} className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors" title="Editar detalles">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleEliminarItem('video', video._id)} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors" title="Eliminar video">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Título inferior */}
                                {editandoMedia?.id !== video._id && video.titulo && (
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-xs text-white truncate text-center">
                                        {video.titulo}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {(!memorial.fotos?.length && !memorial.videos?.length && !memorial.musicaUrl) && (
                <p className="text-white/30 text-sm text-center py-4">Aún no hay contenido multimedia subido a este memorial.</p>
            )}
        </div>
    );
};

export default MediaManager;
