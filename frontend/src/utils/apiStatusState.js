import { getErrorState } from './errorState.js';

export function getApiStatusState({ status, error, isLoading } = {}) {
  if (isLoading && !status && !error) {
    return { kind: 'checking' };
  }

  if (error) {
    const errorState = getErrorState(error);
    return {
      kind: errorState.kind === 'network' ? 'network' : 'degraded',
      errorKind: errorState.kind,
    };
  }

  if (status?.data?.id) {
    return { kind: 'online' };
  }

  return { kind: 'degraded' };
}
