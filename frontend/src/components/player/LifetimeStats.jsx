import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pubgApi } from '../../utils/api';
import { extractPlayerStats } from '../../utils/formatters';
import StatsGrid from './StatsGrid';
import { LifetimeStatsSkeleton } from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { GAME_MODES } from '../../utils/constants';
import { useLanguage } from '../../contexts/LanguageContext';
import { BarChart3 } from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
} from 'recharts';

export default function LifetimeStats({ platform, playerId }) {
  const [mode, setMode] = useState('squad');
  const { t } = useLanguage();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['lifetimeStats', platform, playerId],
    queryFn: () => pubgApi.getLifetimeStats(platform, playerId),
  });

  if (isLoading) return <LifetimeStatsSkeleton />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  const gameModeStats = data?.data?.attributes?.gameModeStats || {};
  const current = gameModeStats[mode] || {};
  const stats = extractPlayerStats(current);

  // Build radar chart data
  const radarData = stats && stats.rounds > 0 ? [
    { metric: t('lifetime_metric_avg_kills'), value: Math.min((stats.kills / stats.rounds) * 20, 100) },
    { metric: t('lifetime_metric_win_rate'), value: (stats.wins / stats.rounds) * 100 },
    { metric: t('lifetime_metric_avg_damage'), value: Math.min((stats.damage / stats.rounds) / 10, 100) },
    { metric: t('lifetime_metric_hs_rate'), value: stats.kills > 0 ? (stats.headshotKills / stats.kills) * 100 : 0 },
    { metric: t('lifetime_metric_top10_rate'), value: (stats.top10s / stats.rounds) * 100 },
    { metric: t('lifetime_metric_survival'), value: Math.min((stats.timeSurvived / stats.rounds) / 20, 100) },
  ] : null;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-pubg-border">
        {GAME_MODES.map((m) => (
          <button key={m.value} onClick={() => setMode(m.value)}
            className={`tab-btn ${mode === m.value ? 'active' : ''}`}>
            {t(m.labelKey)}
          </button>
        ))}
      </div>

      {stats && stats.rounds > 0 ? (
        <div className="space-y-6">
          {/* Radar chart */}
          {radarData && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-pubg-muted uppercase tracking-wider mb-4">{t('lifetime_radar_title')}</h3>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1E2130" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Radar name="stats" dataKey="value" stroke="#F5A623" fill="#F5A623" fillOpacity={0.2} />
                  <Tooltip
                    contentStyle={{ background: '#13151C', border: '1px solid #1E2130', borderRadius: 8 }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(v) => [v.toFixed(1) + '%', '']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          <StatsGrid stats={stats} />
        </div>
      ) : (
        <div className="text-center py-16 text-pubg-muted">
          <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-pubg-border/30 border border-pubg-border flex items-center justify-center">
            <BarChart3 size={26} className="text-pubg-muted" />
          </div>
          <p>{t('lifetime_no_data')}</p>
        </div>
      )}
    </div>
  );
}
