/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'Georgia', 'serif'],
            },
            colors: {
                memorial: {
                    dark: '#1a1a2e',
                    medium: '#16213e',
                    accent: '#e8c46a',
                    gold: '#f0d080',
                    silver: '#c0c0c0',
                }
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-in': 'slideIn 0.8s ease-out',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'candle': 'candle 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-30px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 15px rgba(232, 196, 106, 0.4)' },
                    '50%': { boxShadow: '0 0 35px rgba(232, 196, 106, 0.8)' },
                },
                candle: {
                    '0%, 100%': { transform: 'scaleY(1) rotate(-1deg)', opacity: '0.9' },
                    '50%': { transform: 'scaleY(1.05) rotate(1deg)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
