import { Link } from 'react-router-dom';
import { QrCode, Music, Play, Star, Shield, Zap, ChevronRight } from 'lucide-react';

/**
 * LandingPage — Página de marketing de Eternal Memories.
 * Hero, features, pricing plans, CTA.
 */

const features = [
    { icon: <QrCode size={28} />, title: 'QR Personalizado', desc: 'Genera un código QR único que lleva al memorial digital de tu ser querido.' },
    { icon: <Play size={28} />, title: 'Modo Cine', desc: 'Slideshow cronológico con música de fondo y sincronización automática de videos.' },
    { icon: <Music size={28} />, title: 'Música de Fondo', desc: 'Añade la canción favorita de tu ser querido para enriquecer el memorial.' },
    { icon: <Zap size={28} />, title: 'Galería Inteligente', desc: 'Fotos y videos organizados automáticamente por fecha, del más reciente al más antiguo.' },
    { icon: <Shield size={28} />, title: 'Privacidad y Seguridad', desc: 'Tus recuerdos están protegidos y almacenados de forma segura en la nube.' },
    { icon: <Star size={28} />, title: 'Personalización', desc: 'Elige el tema, color y apariencia del memorial para reflejar la personalidad de tu familiar.' },
];

const planes = [
    {
        nombre: 'Gratuito',
        precio: '$0',
        periodo: 'para siempre',
        color: 'border-white/10',
        items: ['Hasta 50 fotos', 'Hasta 10 videos (max 5m)', 'Música de fondo', 'Código QR permanente', 'Con anuncios'],
        cta: 'Comenzar gratis',
        href: '/registro',
    },
    {
        nombre: 'Plata',
        precio: '$4',
        periodo: '/mes',
        color: 'border-gray-500',
        items: ['Hasta 200 fotos', 'Hasta 20 videos (max 15m)', 'Música de fondo', 'Código QR permanente', 'Sin anuncios'],
        cta: 'Obtener Plata',
        href: '/registro',
    },
    {
        nombre: 'Oro',
        precio: '$10',
        periodo: '/mes',
        color: 'border-yellow-500/50 relative',
        badge: '⭐ Más popular',
        items: ['Fotos ilimitadas', 'Hasta 50 videos (max 60m)', 'Sin anuncios', 'Soporte prioritario'],
        cta: 'Obtener Oro',
        href: '/registro',
        destacado: true,
    },
];

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-memorial-dark text-white overflow-x-hidden">
            {/* ── Nav ─────────────────────────────────────────────────────────── */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-memorial-dark/80 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🕊️</span>
                    <span className="font-serif text-xl gradient-text">Eternal Memories</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-white/60 hover:text-white text-sm transition-colors">Iniciar sesión</Link>
                    <Link to="/registro" className="btn-gold text-sm">Crear cuenta</Link>
                </div>
            </nav>

            {/* ── Hero ─────────────────────────────────────────────────────────── */}
            <section className="relative pt-32 pb-24 px-4 text-center overflow-hidden tema-oscuro" id="hero">
                {/* Partículas decorativas */}
                <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-px h-px bg-memorial-accent/30 rounded-full"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 3 + 1}px`,
                                height: `${Math.random() * 3 + 1}px`,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="text-7xl mb-6 animate-candle inline-block">🕯️</div>
                    <h1 className="font-serif text-5xl md:text-7xl mb-6 leading-tight">
                        Memoriales digitales<br />
                        <span className="gradient-text">para el recuerdo eterno</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Crea un memorial digital hermoso para honrar a tu ser querido. Comparte fotos, videos y recuerdos mediante un código QR que dura para siempre.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/registro" className="btn-gold text-lg px-8 py-4 flex items-center gap-2 justify-center" id="hero-cta">
                            Crear memorial gratis
                            <ChevronRight size={20} />
                        </Link>
                        <Link to="/memorial/carlos-gardel-tango-legend" className="btn-ghost text-lg px-8 py-4 flex items-center gap-2 justify-center">
                            <Play size={20} />
                            Ver demo
                        </Link>
                    </div>
                </div>

                {/* Gradiente inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-memorial-dark to-transparent" />
            </section>

            {/* ── Features ──────────────────────────────────────────────────────── */}
            <section className="py-24 px-4 max-w-6xl mx-auto" id="features">
                <h2 className="text-center font-serif text-4xl mb-4 gradient-text">Todo lo que necesitas</h2>
                <p className="text-center text-white/50 mb-16 max-w-xl mx-auto">Una plataforma completa para crear memoriales que perduran en el tiempo.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((f) => (
                        <div key={f.title} className="card-glass p-6 hover:border-memorial-accent/30 transition-all duration-300 group">
                            <div className="text-memorial-accent mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                            <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                            <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Pricing ────────────────────────────────────────────────────────── */}
            <section className="py-24 px-4 bg-memorial-medium/30" id="pricing">
                <h2 className="text-center font-serif text-4xl mb-4 gradient-text">Planes simples</h2>
                <p className="text-center text-white/50 mb-16">Comienza gratis, actualiza cuando necesites más.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {planes.map((plan) => (
                        <div
                            key={plan.nombre}
                            className={`card-glass p-8 border-2 ${plan.color} relative ${plan.destacado ? 'scale-105' : ''}`}
                        >
                            {plan.badge && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-memorial-accent text-memorial-dark text-xs font-bold px-4 py-1 rounded-full">
                                    {plan.badge}
                                </span>
                            )}
                            <h3 className="font-serif text-2xl text-white mb-1">{plan.nombre}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold gradient-text">{plan.precio}</span>
                                <span className="text-white/40 text-sm">{plan.periodo}</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                {plan.items.map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-white/70 text-sm">
                                        <span className="text-memorial-accent">✦</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                to={plan.href}
                                className={`block text-center py-3 rounded-full font-semibold transition-all ${plan.destacado ? 'btn-gold' : 'btn-ghost'}`}
                                id={`plan-${plan.nombre.toLowerCase()}-cta`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────────────────────────── */}
            <footer className="py-12 px-6 text-center border-t border-white/5">
                <div className="text-3xl mb-3">🕊️</div>
                <p className="font-serif text-xl gradient-text mb-2">Eternal Memories</p>
                <p className="text-white/30 text-sm">Honrando recuerdos eternos · © {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
};

export default LandingPage;
