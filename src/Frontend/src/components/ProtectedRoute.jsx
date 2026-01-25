import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../assets/css/Loading.css';

/**
 * Componente que protege rotas que requerem autenticação.
 * Se o usuário não estiver autenticado, redireciona para o login.
 */
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    // Enquanto carrega o estado de autenticação, não renderiza nada
    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    // Se não estiver autenticado, redireciona para o login
    if (!isAuthenticated) {
        // Salva a localização atual para redirecionar após o login
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // Se estiver autenticado, renderiza o conteúdo
    return children;
}

export default ProtectedRoute;
