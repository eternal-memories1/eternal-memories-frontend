import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { crearPreferenciaPago } from '../services/api';
import { Check, Star, Crown, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const planes = [
        {
            id: 'free',
            nombre: 'Gratis',
            precio: '0',
            icono: <div className="text-4xl mb-4">🕊️</div>,
            caracteristicas: [
                'Hasta 50 fotos',
                'Hasta 10 videos',
                'Videos de máximo 5 minutos',
                'Música de fondo personalizable',
                'Código QR permanente',
            ],
            limitaciones: ['Contiene anuncios publicitarios'],
            color: 'bg-white/5 border-white/10',
            buttonClass: 'bg-white/10 hover:bg-white/20 text-white',
        },
        {
            id: 'plata',
            nombre: 'Plata',
            precio: '4',
            icono: <Star className="text-gray-300 w-10 h-10 mb-4" />,
            caracteristicas: [
                'Hasta 200 fotos',
                'Hasta 20 videos',
                'Videos de máximo 15 minutos',
                'Música de fondo personalizable',
                'Código QR permanente',
                'Sin anuncios publicitarios',
            ],
            limitaciones: [],
            color: 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-600',
            buttonClass: 'bg-gray-200 hover:bg-white text-gray-900',
        },
        {
            id: 'oro',
            nombre: 'Oro',
            precio: '10',
            icono: <Crown className="text-yellow-400 w-10 h-10 mb-4" />,
            caracteristicas: [
                'Fotos Ilimitadas',
                'Hasta 50 videos',
                'Videos de máximo 60 minutos',
                'Música de fondo personalizable',
                'Código QR permanente',
                'Sin anuncios publicitarios',
                'Soporte prioritario',
            ],
            limitaciones: [],
            color: 'bg-gradient-to-br from-yellow-900/40 to-yellow-600/10 border-yellow-500/50 relative overflow-hidden',
            buttonClass: 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black font-bold shadow-lg shadow-yellow-500/30 ring-2 ring-yellow-400/50',
            popular: true
        },
    ];

    const handleSuscripcion = async (planId) => {
        if (!usuario) {
            navigate('/login');
            return;
        }

        if (planId === 'free') {
            navigate('/dashboard');
            return;
        }

        if (usuario?.plan === planId) {
            setError(`Ya tienes el plan ${planId.toUpperCase()} activo.`);
            return;
        }

        if (usuario?.plan === 'oro' && planId === 'plata') {
            setError('No puedes bajar de Oro a Plata desde aquí. Contacta a soporte.');
            return;
        }

        setCargando(true);
        setError('');
        try {
            const res = await crearPreferenciaPago(planId);
            // Redirigir al Checkout de Mercado Pago
            window.location.href = res.data.sandbox_init_point || res.data.init_point;
        } catch (err) {
            setError('Ocurrió un error al procesar el pago. Por favor intenta de nuevo.');
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen tema-oscuro flex flex-col items-center">
            <div className="w-full fixed top-0 z-50 bg-black/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                <div 
                    className="flex items-center gap-3 cursor-pointer" 
                    onClick={() => navigate('/')}
                >
                    <span className="text-2xl">🕊️</span>
                    <span className="font-serif text-xl gradient-text hidden sm:block">Eternal Memories</span>
                </div>
                
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
                >
                    <ArrowLeft size={16} />
                    Volver al Dashboard
                </button>
            </div>

            <main className="flex-1 w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 mt-16">
                <div className="text-center mb-16 animate-slide-up">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                        Planes diseñados para preservar el <span className="gradient-text">legado</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl mx-auto">
                        Elige el nivel de almacenamiento que mejor se adapte a tu memoria. 
                        Todos los planes incluyen la generación de tu código QR con tu memorial web.
                    </p>
                </div>

                {error && (
                    <div className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3 text-red-200">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch justify-center max-w-5xl mx-auto">
                    {planes.map((plan, idx) => (
                        <div 
                            key={plan.id}
                            className={`rounded-2xl border p-8 shadow-2xl flex flex-col transition-transform duration-300 hover:-translate-y-2
                                ${plan.color} ${cargando ? 'opacity-50 pointer-events-none' : ''}`}
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-yellow-400/20 blur-2xl rounded-full" />
                            )}
                            {plan.popular && (
                                <div className="absolute top-0 right-0 py-1 px-3 bg-yellow-500 text-black text-xs font-bold rounded-bl-lg rounded-tr-xl">
                                    MÁS POPULAR
                                </div>
                            )}

                            <div className="flex flex-col items-center text-center mb-6 relative z-10">
                                {plan.icono}
                                <h3 className="text-2xl font-serif text-white mb-2">{plan.nombre}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">${plan.precio}</span>
                                    <span className="text-white/50">USD / mes</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1 relative z-10">
                                {plan.caracteristicas.map((caracteristica, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-white/80">{caracteristica}</span>
                                    </li>
                                ))}
                                {plan.limitaciones.map((limitacion, i) => (
                                    <li key={`lim-${i}`} className="flex items-start gap-3 opacity-60">
                                        <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-white/60">{limitacion}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSuscripcion(plan.id)}
                                disabled={cargando || usuario?.plan === plan.id}
                                className={`w-full py-4 rounded-xl font-medium transition-all ${plan.buttonClass} 
                                    ${usuario?.plan === plan.id ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
                            >
                                {cargando ? 'Redirigiendo...' : 
                                 (!usuario ? 'Registrarme' : 
                                  plan.id === 'free' ? 'Plan Actual' : 'Elegir Plan')}
                            </button>
                            {usuario?.plan === plan.id && (
                                <div className="text-center text-white/50 text-sm font-medium py-4">Este es tu plan actual</div>
                            )}
                        </div>
                    ))}
                </div>

                <p className="text-center text-white/30 text-xs mt-16 flex items-center justify-center gap-2">
                    <Lock size={12} /> Pagos procesados de forma segura a través de Mercado Pago
                </p>
            </main>
        </div>
    );
};

export default PricingPage;
