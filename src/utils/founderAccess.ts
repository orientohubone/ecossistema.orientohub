import type { User } from '@supabase/supabase-js';

const DEFAULT_FOUNDER_SECRET = 'jose fernando xavier ramalho';

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
  const metadataSecret = ((
    user.user_metadata?.founderSecret ||
    user.user_metadata?.founder_secret ||
    user.user_metadata?.secret
  ) as string | undefined)?.toLowerCase();

  const emailMatches = founderEmail ? userEmail === founderEmail : false;
  const roleMatches = founderRole ? metadataRole === founderRole : false;
  const secretMatches = metadataSecret === requiredSecret;

  const shouldRequireSecret = options?.requireSecret ?? true;
  const baseAccess = emailMatches || roleMatches;

  return shouldRequireSecret ? baseAccess && secretMatches : baseAccess;
};
