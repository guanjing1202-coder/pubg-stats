import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pubgApi } from '../../utils/api';
import { extractPlayerStats, formatKDA, formatWinRate, formatAvgDamage } from '../../utils/formatters';
import { PageLoader } from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import StatCard from '../common/StatCard';
import { useLanguage } from '../../contexts/LanguageContext';

const RANKED_MODES = [
  { value: 'squad', labelKey: 'ranked_mode_squad' },
  { value: 'squad-fpp', labelKey: 'ranked_mode_squad_fpp' },
  { value: 'solo', labelKey: 'ranked_mode_solo' },
];

const TIER_COLORS = {
  Bronze: 'text-amber-700',
  Silver: 'text-gray-400',
  Gold: 'text-yellow-400',
  Platinum: 'text-cyan-400',
  Diamond: 'text-sky-300',
  Master: 'text-pubg-orange',
  'Grand Master': 'text-red-400',
};

function RankDisplay({ tier, subTier, rankPoints }) {
  const tierColor = TIER_COLORS[tier] || 'text-white';
  return (
    <div className="card p-6 flex flex-col items-center gap-3 text-center">
      <div className={`text-6xl font-black ${tierColor}`}>
        {tier === 'Bronze' ? '🥉' : tier === 'Silver' ? '🥈' : tier === 'Gold' ? '🥇' :
         tier === 'Platinum' ? '💎' : tier === 'Diamond' ? '💠' : tier === 'Master' ? '👑' : '🏆'}
      </div>
      <div>
        <div className={`text-2xl font-bold ${tierColor}`}>{tier}</div>
        {subTier && <div className="text-lg text-gray-400">{subTier}</div>}
        {rankPoints > 0 && (
          <div className="text-pubg-orange font-mono font-bold text-xl mt-1">{rankPoints} RP</div>
        )}
      </div>
    </div>
  );
}

export default function RankedStats({ platform, playerId, seasonId }) {
  const [mode, setMode] = useState('squad');
  const { t } = useLanguage();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['rankedStats', platform, playerId, seasonId],
    queryFn: () => pubgApi.getRankedStats(platform, playerId, seasonId),
    enabled: !!seasonId,
  });

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  const rankedStats = data?.data?.attributes?.rankedGameModeStats || {};
  const current = rankedStats[mode] || {};
  const { currentTier, currentRankPoint, bestTier, bestRankPoint, roundsPlayed } = current;
  const stats = extractPlayerStats(current);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Mode tabs */}
      <div className="flex items-center gap-1 border-b border-pubg-border pb-1">
        {RANKED_MODES.map((m) => (
          <button key={m.value} onClick={() => setMode(m.value)}
            className={`tab-btn ${mode === m.value ? 'active' : ''}`}>
            {t(m.labelKey)}
          </button>
        ))}
      </div>

      {roundsPlayed > 0 ? (
        <div className="space-y-5">
          {/* Rank cards */}
          <div className="grid grid-cols-2 gap-4">
            {currentTier && (
              <div>
                <p className="text-xs text-pubg-muted uppercase tracking-wider mb-2">{t('ranked_current_tier')}</p>
                <RankDisplay tier={currentTier.tier} subTier={currentTier.subTier} rankPoints={currentRankPoint} />
              </div>
            )}
            {bestTier && (
              <div>
                <p className="text-xs text-pubg-muted uppercase tracking-wider mb-2">{t('ranked_best_tier')}</p>
                <RankDisplay tier={bestTier.tier} subTier={bestTier.subTier} rankPoints={bestRankPoint} />
              </div>
            )}
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatCard label="KDA" value={formatKDA(stats.kills, stats.deaths, stats.assists)} highlight />
              <StatCard label={t('stat_win_rate')} value={formatWinRate(stats.wins, stats.rounds)} />
              <StatCard label={t('stat_avg_damage')} value={formatAvgDamage(stats.damage, stats.rounds)} />
              <StatCard label={t('ranked_rounds')} value={stats.rounds} />
              <StatCard label={t('ranked_total_kills')} value={stats.kills} />
              <StatCard label={t('ranked_headshot_kills')} value={stats.headshotKills} />
              <StatCard label={t('stat_longest_kill')} value={`${Math.round(stats.longestKill || 0)}m`} />
              <StatCard label={t('stat_revives')} value={stats.revives} />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 text-pubg-muted">
          <p className="text-4xl mb-3">🏆</p>
          <p>{t('ranked_no_data')}</p>
        </div>
      )}
    </div>
  );
}
