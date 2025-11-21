import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface FounderDashboardRouteProps {
    children: React.ReactNode;
}

const FounderDashboardRoute = ({ children }: FounderDashboardRouteProps) => {
    const { user } = useAuthStore();

    // Verificar se é founder
    // TODO: Adicionar campo 'role' no perfil do usuário no Supabase
    // Por enquanto, verificar por email específico
    const isFounder = user?.email === 'fersouluramal@gmail.com' ||
        user?.email === 'fernandoluizsouzaramalho@gmail.com' ||
        user?.user_metadata?.role === 'founder';

    if (!isFounder) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default FounderDashboardRoute;

