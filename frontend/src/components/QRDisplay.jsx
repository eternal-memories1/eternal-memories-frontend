import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, QrCode } from 'lucide-react';
import { obtenerQRData } from '../services/api';

/**
 * QRDisplay — Muestra el código QR del memorial.
 * Permite descargarlo como PNG.
 */
const QRDisplay = ({ slug }) => {
    const [qrData, setQrData] = useState(null);
    const [expandido, setExpandido] = useState(false);

    const urlMemorial = `${window.location.origin}/memorial/${slug}`;

    useEffect(() => {
        obtenerQRData(slug)
            .then((res) => setQrData(res.data))
            .catch(() => { }); // Silenciar errores — el QR local siempre funciona
    }, [slug]);

    // Descargar como PNG usando canvas
    const descargarQR = () => {
        const svg = document.getElementById(`qr-svg-${slug}`);
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, 512, 512);
            ctx.drawImage(img, 0, 0, 512, 512);
            const link = document.createElement('a');
            link.download = `qr-${slug}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    };

    return (
        <div className="card-glass p-6 flex flex-col items-center gap-4 max-w-xs" id="qr-display">
            <button
                onClick={() => setExpandido(!expandido)}
                className="flex items-center gap-2 text-memorial-accent font-medium text-sm hover:text-memorial-gold transition-colors"
            >
                <QrCode size={18} />
                {expandido ? 'Ocultar QR' : 'Mostrar código QR'}
            </button>

            {expandido && (
                <div className="flex flex-col items-center gap-3 animate-fade-in">
                    <div className="bg-white p-3 rounded-xl">
                        <QRCodeSVG
                            id={`qr-svg-${slug}`}
                            value={urlMemorial}
                            size={200}
                            level="H"
                            includeMargin
                        />
                    </div>
                    <p className="text-white/40 text-xs text-center break-all">{urlMemorial}</p>
                    <button
                        onClick={descargarQR}
                        className="btn-ghost text-sm flex items-center gap-2"
                        id="btn-download-qr"
                    >
                        <Download size={16} />
                        Descargar QR
                    </button>
                </div>
            )}
        </div>
    );
};

export default QRDisplay;
