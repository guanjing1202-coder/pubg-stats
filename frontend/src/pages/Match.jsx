import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MatchDetail from '../components/match/MatchDetail';
import { useLanguage } from '../contexts/LanguageContext';

export default function Match() {
  const { platform, matchId } = useParams();
  const location = useLocation();
  const from = location.state?.from;
  const highlightPlayer = location.state?.playerName;
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        {from ? (
          <Link to={from} className="flex items-center gap-1.5 text-sm text-pubg-muted hover:text-white transition-colors">
            <ArrowLeft size={16} />
            {t('match_back')}
          </Link>
        ) : (
          <Link to="/" className="flex items-center gap-1.5 text-sm text-pubg-muted hover:text-white transition-colors">
            <ArrowLeft size={16} />
            {t('match_home')}
          </Link>
        )}
        <span className="text-pubg-border">·</span>
        <span className="text-sm text-pubg-muted font-mono">{matchId}</span>
      </div>

      <MatchDetail platform={platform} matchId={matchId} highlightPlayerName={highlightPlayer} />
    </div>
  );
}
