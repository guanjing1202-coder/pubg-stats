import { useQueries } from '@tanstack/react-query';
import { pubgApi } from '../../utils/api';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const METRICS = [
  { key: 'avgKills', labelKey: 'stat_avg_kills', color: '#F5A623' },
  { key: 'avgDamage', labelKey: 'stat_avg_damage', color: '#60A5FA' },
  { key: 'winRate', labelKey: 'trend_metric_win_rate', color: '#34D399' },
  { key: 'kda', label: 'KDA', color: '#F472B6' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-pubg-card border border-pubg-border rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-pubg-muted mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm font-mono" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function SeasonTrend({ platform, playerId, seasons, gameMode = 'squad' }) {
  const [metric, setMetric] = useState('avgKills');
  const { t } = useLanguage();

  // Load last 6 seasons in parallel
  const recentSeasons = seasons.slice(0, 6);
  const queries = useQueries({
    queries: recentSeasons.map((s) => ({
      queryKey: ['seasonStats', platform, playerId, s.id],
      queryFn: () => pubgApi.getSeasonStats(platform, playerId, s.id),
      staleTime: 10 * 60 * 1000,
    })),
  });

  const chartData = recentSeasons
    .map((season, i) => {
      const d = queries[i]?.data;
      const stats = d?.data?.attributes?.gameModeStats?.[gameMode];
      if (!stats || !stats.roundsPlayed) return null;
      const rounds = stats.roundsPlayed;
      const wins = stats.wins;
      const losses = stats.losses ?? Math.max(rounds - wins, 0);
      return {
        season: season.id.replace('division.bro.official.pc-2018-', 'S').replace('division.bro.official.', ''),
        avgKills: rounds > 0 ? +(stats.kills / rounds).toFixed(2) : 0,
        avgDamage: rounds > 0 ? +(stats.damageDealt / rounds).toFixed(0) : 0,
        winRate: rounds > 0 ? +((wins / rounds) * 100).toFixed(1) : 0,
        kda: +((stats.kills + (stats.assists || 0) * 0.5) / Math.max(losses, 1)).toFixed(2),
        rounds,
      };
    })
    .filter(Boolean)
    .reverse(); // oldest → newest

  const isLoading = queries.some((q) => q.isLoading);
  const currentMetric = METRICS.find((m) => m.key === metric);
  const currentMetricLabel = currentMetric?.labelKey ? t(currentMetric.labelKey) : currentMetric?.label;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h3 className="text-sm font-semibold text-white">{t('trend_heading', gameMode)}</h3>
        <div className="flex items-center gap-1.5 flex-wrap">
          {METRICS.map((m) => (
            <button key={m.key} onClick={() => setMetric(m.key)}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${metric === m.key ? 'text-black font-semibold' : 'bg-pubg-border text-gray-400 hover:text-white'}`}
              style={metric === m.key ? { backgroundColor: m.color } : {}}>
              {m.labelKey ? t(m.labelKey) : m.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center text-pubg-muted text-sm">{t('trend_loading')}</div>
      ) : chartData.length < 2 ? (
        <div className="h-48 flex items-center justify-center text-pubg-muted text-sm">{t('trend_not_enough')}</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2130" />
            <XAxis dataKey="season" tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone" dataKey={metric} name={currentMetricLabel}
              stroke={currentMetric?.color} strokeWidth={2}
              dot={{ fill: currentMetric?.color, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
