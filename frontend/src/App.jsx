import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MusicVideoProvider } from './context/MusicVideoContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import MemorialView from './pages/MemorialView';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import PricingPage from './pages/PricingPage';
import AdminPanel from './pages/AdminPanel';

// ── Ruta protegida: redirige al login si no hay sesión ──────────────────────
const RutaProtegida = ({ children }) => {
    const { usuario, cargando } = useAuth();
    if (cargando) return (
        <div className="min-h-screen flex items-center justify-center bg-memorial-dark">
            <div className="text-memorial-accent text-xl animate-pulse">Cargando...</div>
        </div>
    );
    return usuario ? children : <Navigate to="/login" replace />;
};

// ── Ruta protegida: solo para administradores ─────────────────────────────────
const AdminRoute = ({ children }) => {
    const { usuario, cargando } = useAuth();
    if (cargando) return (
        <div className="min-h-screen flex items-center justify-center bg-memorial-dark">
            <div className="text-memorial-accent text-xl animate-pulse">Cargando...</div>
        </div>
    );
    return (usuario && usuario.rol === 'admin') ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
    <Routes>
        {/* Página de marketing / inicio */}
        <Route path="/" element={<LandingPage />} />

        {/* Autenticación */}
        <Route path="/login" element={<AuthPage modo="login" />} />
        <Route path="/registro" element={<AuthPage modo="registro" />} />

        {/* Vista pública del memorial (acceso vía QR) */}
        <Route path="/memorial/:slug" element={<MemorialView />} />

        {/* Panel de control del usuario (protegido) */}
        <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />

        {/* Precios y Suscripciones */}
        <Route path="/pricing" element={<PricingPage />} />

        {/* Panel de Admin */}
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

const App = () => (
    <BrowserRouter>
        <AuthProvider>
            <MusicVideoProvider>
                <AppRoutes />
            </MusicVideoProvider>
        </AuthProvider>
    </BrowserRouter>
);

export default App;
