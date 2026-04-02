import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import ProtectedRouteSkeleton from './ProtectedRouteSkeleton';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <ProtectedRouteSkeleton />;
  }

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
