const ERROR_PATTERNS = {
  auth: /api key|unauthorized|invalid or missing/i,
  notFound: /not found|resource not found|404/i,
  rateLimit: /rate limit|too many requests|429/i,
  network: /network error|econnrefused|failed to fetch/i,
  proxyNetwork: /^request failed with status code 500$/i,
  timeout: /timeout|timed out/i,
};

export function getErrorState(error = {}) {
  const status = error?.status;
  const message = error?.message || '';

  if (status === 401 || ERROR_PATTERNS.auth.test(message)) {
    return { kind: 'auth', message };
  }
  if (status === 404 || ERROR_PATTERNS.notFound.test(message)) {
    return { kind: 'notFound', message };
  }
  if (status === 429 || ERROR_PATTERNS.rateLimit.test(message)) {
    return { kind: 'rateLimit', message };
  }
  if (ERROR_PATTERNS.network.test(message) || ERROR_PATTERNS.proxyNetwork.test(message)) {
    return { kind: 'network', message };
  }
  if (ERROR_PATTERNS.timeout.test(message)) {
    return { kind: 'timeout', message };
  }
  if (status >= 500) {
    return { kind: 'server', message };
  }

  return { kind: 'generic', message };
}
