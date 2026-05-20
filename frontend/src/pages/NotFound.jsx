import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
      <div className="text-8xl mb-6">💀</div>
      <h1 className="text-4xl font-black text-white mb-2">404</h1>
      <p className="text-pubg-muted mb-8">{t('not_found_message')}</p>
      <Link to="/" className="btn-primary flex items-center gap-2">
        <Home size={16} />
        {t('not_found_action')}
      </Link>
    </div>
  );
}
