import { useState } from 'react';
import { X, Trash2, Save } from 'lucide-react';
import { actualizarMemorial, eliminarMemorial } from '../services/api';

const EditMemorialModal = ({ memorial, onClose, onUpdated, onDeleted }) => {
    const [form, setForm] = useState({
        nombre: memorial.nombre,
        fechaNacimiento: memorial.fechaNacimiento.split('T')[0],
        fechaFallecimiento: memorial.fechaFallecimiento.split('T')[0],
        biografia: memorial.biografia || '',
    });
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            const res = await actualizarMemorial(memorial._id, form);
            onUpdated(res.data.memorial);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar');
        } finally {
            setCargando(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el memorial de ${memorial.nombre}? Esta acción NO se puede deshacer.`)) return;
        try {
            setCargando(true);
            await eliminarMemorial(memorial._id);
            onDeleted(memorial._id);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar');
            setCargando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-memorial-dark border border-white/10 rounded-2xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-serif text-white mb-4">Editar Información</h2>
                
                {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-white/40 mb-1">Nombre</label>
                        <input
                            required
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-memorial-accent"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-white/40 mb-1">Nacimiento</label>
                            <input
                                type="date"
                                required
                                value={form.fechaNacimiento}
                                onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-memorial-accent"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-white/40 mb-1">Fallecimiento</label>
                            <input
                                type="date"
                                required
                                value={form.fechaFallecimiento}
                                onChange={(e) => setForm({ ...form, fechaFallecimiento: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-memorial-accent"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-white/40 mb-1">Biografía</label>
                        <textarea
                            value={form.biografia}
                            onChange={(e) => setForm({ ...form, biografia: e.target.value })}
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-memorial-accent resize-none"
                        />
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button type="button" onClick={handleDelete} disabled={cargando} className="flex-1 btn-ghost text-red-400 hover:text-red-300 hover:border-red-400/50 flex items-center justify-center gap-2">
                            <Trash2 size={16} /> Eliminar
                        </button>
                        <button type="submit" disabled={cargando} className="flex-1 btn-gold flex items-center justify-center gap-2">
                            <Save size={16} /> Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditMemorialModal;
