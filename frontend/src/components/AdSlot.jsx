import { useEffect } from 'react';

/**
 * AdSlot — Espacio de anuncio listo para Google AdSense.
 * position: 'top' | 'bottom'
 * plan: plan del creador del memorial (free, plata, oro)
 */
const AdSlot = ({ position = 'bottom', className = '', plan = 'free' }) => {
    // Si el plan es plata u oro, no mostrar anuncios
    if (plan === 'plata' || plan === 'oro') {
        return null;
    }
    // Si tienes tu ID de cliente de AdSense, ponlo aquí o en variables de entorno
    const adClient = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX';
    const adSlot = position === 'top' ? '1234567890' : '0987654321'; // Reemplazar con los IDs reales de bloques de anuncios
    
    // Solo mostramos anuncios si está habilitado en env (para no mostrar errores vacíos en dev local)
    const adsEnabled = import.meta.env.VITE_ENABLE_ADS === 'true';

    useEffect(() => {
        if (adsEnabled) {
            try {
                // Le decimos a AdSense que llene este espacio
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
                console.error('Error cargando anuncio de AdSense:', err);
            }
        }
    }, [adsEnabled]);

    if (!adsEnabled) {
        // En desarrollo mostramos el placeholder
        return (
            <div
                className={`ad-slot ${position === 'top' ? 'h-16' : 'h-24'} ${className}`}
                id={`ad-slot-${position}`}
                data-ad-position={position}
                aria-label="Espacio publicitario"
            >
                <div className="flex flex-col items-center justify-center w-full h-full gap-1">
                    <span className="text-xs text-white/20 tracking-widest uppercase">Espacio Publicitario</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`ad-container ${className} overflow-hidden flex justify-center`}>
            {/* Esta es la etiqueta exacta que requiere Google AdSense */}
            <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', minHeight: position === 'top' ? '60px' : '90px' }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
};

export default AdSlot;
