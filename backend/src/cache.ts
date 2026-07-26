import { createCache } from 'cache-manager';

export const cache = createCache({
  ttl: 600000, // 10 min
});
