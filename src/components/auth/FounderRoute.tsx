import { ReactNode, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { isFounderUser } from '../../utils/founderAccess';
import ProtectedRouteSkeleton from './ProtectedRouteSkeleton';

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
    return <ProtectedRouteSkeleton />;
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
