/**
 * Inicialización de Mercado Pago SDK
 * Este módulo configura el SDK de Mercado Pago con la Public Key de producción
 */

export const initMercadoPago = () => {
    // Verificar que Mercado Pago SDK esté disponible
    if (typeof window.MercadoPago === 'undefined') {
        console.error('Mercado Pago SDK no está cargado. Verifica que el script esté en index.html');
        return false;
    }

    const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
    const locale = import.meta.env.VITE_MERCADOPAGO_LOCALE || 'es-PE';

    if (!publicKey || publicKey.includes('REEMPLAZA')) {
        console.warn('⚠️ VITE_MERCADOPAGO_PUBLIC_KEY no está configurada. Agrega tu Public Key en el .env');
        return false;
    }

    try {
        // Inicializar Mercado Pago con la Public Key
        const mp = new window.MercadoPago(publicKey, {
            locale: locale,
        });

        // Almacenar en window para acceso global
        window.mp = mp;

        console.log('✅ Mercado Pago inicializado con locale:', locale);
        return true;
    } catch (error) {
        console.error('❌ Error al inicializar Mercado Pago:', error);
        return false;
    }
};

/**
 * Obtener la instancia de Mercado Pago
 * @returns {Object|null} Instancia de Mercado Pago o null si no está inicializada
 */
export const getMercadoPagoInstance = () => {
    return window.mp || null;
};
