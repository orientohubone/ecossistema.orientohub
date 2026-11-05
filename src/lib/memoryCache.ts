type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();
let sessionRevision = 0;

export const getCachedValue = <T>(key: string): T | null => {
  const entry = cache.get(key);

  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
};

export const setCachedValue = <T>(key: string, data: T, ttlMs: number) => {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
};

export const getOrLoadCachedValue = async <T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>,
  options?: { forceRefresh?: boolean }
): Promise<T> => {
  if (!options?.forceRefresh) {
    const cached = getCachedValue<T>(key);
    if (cached !== null) return cached;
  }

  const currentPromise = inflight.get(key);
  if (currentPromise) return currentPromise as Promise<T>;

  const revision = sessionRevision;
  const promise = loader()
    .then((result) => {
      if (revision !== sessionRevision) throw new Error('A sessão mudou durante o carregamento. Atualize a tela.');
      if (inflight.get(key) === promise) {
        setCachedValue(key, result, ttlMs);
        inflight.delete(key);
      }
      return result;
    })
    .catch((error) => {
      if (inflight.get(key) === promise) inflight.delete(key);
      throw error;
    });

  inflight.set(key, promise);
  return promise;
};

export const invalidateCache = (matcher?: string | RegExp) => {
  if (!matcher) {
    sessionRevision++;
    cache.clear();
    inflight.clear();
    return;
  }

  const matches = (key: string) =>
    typeof matcher === 'string' ? key.startsWith(matcher) : matcher.test(key);

  for (const key of cache.keys()) {
    if (matches(key)) cache.delete(key);
  }

  for (const key of inflight.keys()) {
    if (matches(key)) inflight.delete(key);
  }
};
