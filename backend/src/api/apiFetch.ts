import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

export async function apiFetch(msg: string, url: string, options?: RequestInit) {
  const start = Date.now();

  const res = await fetch(url, options);

  logger.info({
    msg,
    url,
    status: `${res.status} ${res.statusText}`,
    duration: `${Date.now() - start} ms`,
  });

  return res;
}
