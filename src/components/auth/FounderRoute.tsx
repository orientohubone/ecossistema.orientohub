import { ReactNode, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { isFounderUser } from '../../utils/founderAccess';

interface FounderRouteProps {
  children: ReactNode;
}

const FounderRoute = ({ children }: FounderRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  const isFounderBase = useMemo(() => {
    return isFounderUser(user, { requireSecret: false });
  }, [user]);

  const isFounderUnlocked = useMemo(() => {
    return isFounderUser(user, { requireSecret: true });
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }

  // If not a founder at all, deny access
  if (!isFounderBase) {
    return <Navigate to="/dashboard" state={{ forbidden: true }} replace />;
  }

  // If founder but locked (no secret), redirect to unlock page
  if (!isFounderUnlocked) {
    return <Navigate to="/dashboard/academy" state={{ from: location, unlockRequired: true }} replace />;
  }

  return <>{children}</>;
};

export default FounderRoute;
