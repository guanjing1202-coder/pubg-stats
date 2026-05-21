import { AlertTriangle, KeyRound, PlugZap, RefreshCw, SearchX, ServerCrash, TimerReset } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getErrorState } from '../../utils/errorState';

const ERROR_PRESENTATION = {
  auth: {
    Icon: KeyRound,
    tone: 'bg-amber-500/10 text-amber-400',
    titleKey: 'error_auth_title',
    messageKey: 'error_auth_message',
  },
  notFound: {
    Icon: SearchX,
    tone: 'bg-blue-500/10 text-blue-400',
    titleKey: 'error_not_found_title',
    messageKey: 'error_not_found_message',
  },
  rateLimit: {
    Icon: TimerReset,
    tone: 'bg-orange-500/10 text-orange-400',
    titleKey: 'rate_limit_title',
    messageKey: 'rate_limit_message',
  },
  network: {
    Icon: PlugZap,
    tone: 'bg-red-500/10 text-red-400',
    titleKey: 'error_network_title',
    messageKey: 'error_network_message',
  },
  timeout: {
    Icon: TimerReset,
    tone: 'bg-yellow-500/10 text-yellow-400',
    titleKey: 'error_timeout_title',
    messageKey: 'error_timeout_message',
  },
  server: {
    Icon: ServerCrash,
    tone: 'bg-red-500/10 text-red-400',
    titleKey: 'error_server_title',
    messageKey: 'error_server_message',
  },
  generic: {
    Icon: AlertTriangle,
    tone: 'bg-red-500/10 text-red-400',
    titleKey: 'request_failed',
    messageKey: null,
  },
};

export default function ErrorMessage({ error, onRetry }) {
  const { t } = useLanguage();
  const errorState = getErrorState(error);
  const presentation = ERROR_PRESENTATION[errorState.kind] || ERROR_PRESENTATION.generic;
  const { Icon } = presentation;
  const fallbackMessage = errorState.message || t('unknown_error');
  const message = presentation.messageKey ? t(presentation.messageKey) : fallbackMessage;

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${presentation.tone}`}>
        <Icon size={28} />
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1">
          {t(presentation.titleKey)}
        </h3>
        <p className="text-pubg-muted text-sm max-w-sm">
          {message}
        </p>
        {presentation.messageKey && errorState.message && (
          <p className="mt-2 text-xs text-pubg-muted/70 font-mono break-all max-w-md">
            {errorState.message}
          </p>
        )}
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost flex items-center gap-2 text-sm">
          <RefreshCw size={14} /> {t('retry')}
        </button>
      )}
    </div>
  );
}
