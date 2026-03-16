/**
 * ThemePicker — Selector de tema y color de fondo del memorial.
 * Props:
 *   - temaActual: string ('oscuro' | 'claro' | 'sepia' | 'aurora')
 *   - colorActual: string hexadecimal
 *   - onCambiar: callback({ tema, colorFondo })
 */
const temas = [
    { id: 'oscuro', label: 'Noche Eterna', preview: 'from-[#1a1a2e] to-[#16213e]', emoji: '🌌' },
    { id: 'claro', label: 'Luz Serena', preview: 'from-[#f8f5f0] to-[#e8dcc8]', emoji: '☀️' },
    { id: 'sepia', label: 'Antiguo', preview: 'from-[#2d2010] to-[#4a3520]', emoji: '📜' },
    { id: 'aurora', label: 'Aurora', preview: 'from-[#0d1b2a] to-[#162032]', emoji: '🌒' },
];

const coloresSugeridos = [
    '#1a1a2e', '#16213e', '#2d2010', '#0d1b2a',
    '#1a2e1a', '#2a1a2e', '#1a2e2e', '#2e1a1a',
];

const ThemePicker = ({ temaActual, colorActual, onCambiar }) => {
    return (
        <div className="card-glass p-6 space-y-6" id="theme-picker">
            <h3 className="text-white font-semibold text-lg">Personalizar apariencia</h3>

            {/* ── Selección de tema ─────────────────────────────────────────── */}
            <div>
                <p className="text-white/50 text-sm mb-3">Tema</p>
                <div className="grid grid-cols-2 gap-3">
                    {temas.map((tema) => (
                        <button
                            key={tema.id}
                            onClick={() => onCambiar({ tema: tema.id, colorFondo: colorActual })}
                            className={`p-3 rounded-xl bg-gradient-to-br ${tema.preview} border-2 transition-all flex items-center gap-2 ${temaActual === tema.id ? 'border-memorial-accent scale-105' : 'border-white/10 hover:border-white/30'
                                }`}
                        >
                            <span className="text-xl">{tema.emoji}</span>
                            <span className="text-white text-sm font-medium">{tema.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Selector de color de fondo ───────────────────────────────── */}
            <div>
                <p className="text-white/50 text-sm mb-3">Color de fondo</p>
                <div className="flex items-center gap-3 flex-wrap">
                    {coloresSugeridos.map((color) => (
                        <button
                            key={color}
                            onClick={() => onCambiar({ tema: temaActual, colorFondo: color })}
                            className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${colorActual === color ? 'border-memorial-accent scale-110' : 'border-transparent'
                                }`}
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                    {/* Input color libre */}
                    <label className="cursor-pointer">
                        <input
                            type="color"
                            value={colorActual}
                            onChange={(e) => onCambiar({ tema: temaActual, colorFondo: e.target.value })}
                            className="sr-only"
                            id="color-picker-custom"
                        />
                        <div className="w-9 h-9 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center text-white/50 hover:border-memorial-accent hover:text-memorial-accent transition-all text-xs">
                            +
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ThemePicker;
