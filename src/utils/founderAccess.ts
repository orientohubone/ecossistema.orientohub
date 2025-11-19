import type { User } from '@supabase/supabase-js';

export const DEFAULT_FOUNDER_SECRET = 'jose_fernando_xavier_ramalho';

type FounderCheckOptions = {
  requireSecret?: boolean;
};

export const isFounderUser = (user: User | null, options?: FounderCheckOptions) => {
  if (!user) return false;

  const founderEmail = import.meta.env.VITE_FOUNDER_EMAIL?.toLowerCase();
  const founderRole = import.meta.env.VITE_FOUNDER_ROLE?.toLowerCase();
  const requiredSecret = (import.meta.env.VITE_FOUNDER_SECRET ?? DEFAULT_FOUNDER_SECRET).toLowerCase();

  const userEmail = user.email?.toLowerCase();
  const metadataRole = (user.user_metadata?.role as string | undefined)?.toLowerCase();

  // Check storage first (priority), then metadata
  const storageSecret = typeof window !== 'undefined'
    ? sessionStorage.getItem('founderSecret')?.toLowerCase()
    : null;

  const metadataSecret = ((
    user.user_metadata?.founderSecret ||
    user.user_metadata?.founder_secret ||
    user.user_metadata?.secret
  ) as string | undefined)?.toLowerCase();

  const emailMatches = userEmail === 'fersouluramal@gmail.com' || userEmail === 'fernando@orientohub.com' || userEmail?.endsWith('@orientohub.com');
  const roleMatches = founderRole ? metadataRole === founderRole : false;

  // Secret matches if it exists in storage OR metadata and equals the required secret
  const secretMatches = (storageSecret === requiredSecret) || (metadataSecret === requiredSecret);

  const shouldRequireSecret = options?.requireSecret ?? true;

  // Base access requires email match OR role match (for future tutors)
  // Currently user emphasized "only me", but we keep the structure flexible
  const baseAccess = emailMatches || roleMatches;

  return shouldRequireSecret ? baseAccess && secretMatches : baseAccess;
};
