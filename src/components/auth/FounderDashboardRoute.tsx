import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface FounderDashboardRouteProps {
    children: React.ReactNode;
}

const FounderDashboardRoute = ({ children }: FounderDashboardRouteProps) => {
    const { user } = useAuthStore();

    // Este painel é exclusivamente operacional. Metadados não concedem acesso.
    const isFounder = user?.email?.toLowerCase() === 'fersouluramal@gmail.com';

    if (!isFounder) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default FounderDashboardRoute;

