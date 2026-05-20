import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ErrorMessage({ error, onRetry }) {
  const { t } = useLanguage();
  const isRateLimited = error?.status === 429 || /rate limit|too many requests/i.test(error?.message || '');

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
        <AlertTriangle size={28} className="text-red-400" />
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1">
          {isRateLimited ? t('rate_limit_title') : t('request_failed')}
        </h3>
        <p className="text-pubg-muted text-sm max-w-sm">
          {isRateLimited ? t('rate_limit_message') : (error?.message || t('unknown_error'))}
        </p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost flex items-center gap-2 text-sm">
          <RefreshCw size={14} /> {t('retry')}
        </button>
      )}
    </div>
  );
}
