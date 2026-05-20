import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pubgApi } from '../../utils/api';
import { extractPlayerStats } from '../../utils/formatters';
import StatsGrid from './StatsGrid';
import { PageLoader } from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { GAME_MODES } from '../../utils/constants';
import { useLanguage } from '../../contexts/LanguageContext';

const MODE_KEYS = {
  squad: 'squad',
  'squad-fpp': 'squad-fpp',
  duo: 'duo',
  'duo-fpp': 'duo-fpp',
  solo: 'solo',
  'solo-fpp': 'solo-fpp',
};

export default function SeasonStats({ platform, playerId, seasonId }) {
  const [mode, setMode] = useState('squad');
  const { t } = useLanguage();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['seasonStats', platform, playerId, seasonId],
    queryFn: () => pubgApi.getSeasonStats(platform, playerId, seasonId),
    enabled: !!seasonId,
  });

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!data) return null;

  const gameModeStats = data?.data?.attributes?.gameModeStats || {};
  const currentModeStats = gameModeStats[MODE_KEYS[mode]];
  const parsed = extractPlayerStats(currentModeStats);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Mode tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-pubg-border">
        {GAME_MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`tab-btn ${mode === m.value ? 'active' : ''}`}
          >
            {t(m.labelKey)}
          </button>
        ))}
      </div>

      {parsed && parsed.rounds > 0 ? (
        <StatsGrid stats={parsed} />
      ) : (
        <div className="text-center py-16 text-pubg-muted">
          <p className="text-4xl mb-3">🎮</p>
          <p>{t('season_no_data')}</p>
        </div>
      )}
    </div>
  );
}
