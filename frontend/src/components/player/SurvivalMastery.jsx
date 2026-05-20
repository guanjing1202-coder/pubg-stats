import { useQuery } from '@tanstack/react-query';
import { pubgApi } from '../../utils/api';
import { PageLoader } from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { formatNumber, formatTime, formatDistance } from '../../utils/formatters';
import { Info, Shield, Activity } from 'lucide-react';
import { GAME_MODES } from '../../utils/constants';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const TIER_MAP = [
  null,
  { name: 'Bronze',   grad: 'from-amber-900 to-amber-700',   ring: 'border-amber-700',  text: 'text-amber-600' },
  { name: 'Silver',   grad: 'from-gray-500 to-gray-400',     ring: 'border-gray-400',   text: 'text-gray-300' },
  { name: 'Gold',     grad: 'from-yellow-600 to-yellow-400', ring: 'border-yellow-400', text: 'text-yellow-400' },
  { name: 'Platinum', grad: 'from-cyan-700 to-cyan-400',     ring: 'border-cyan-400',   text: 'text-cyan-400' },
  { name: 'Diamond',  grad: 'from-sky-600 to-sky-300',       ring: 'border-sky-300',    text: 'text-sky-300' },
  { name: 'Master',   grad: 'from-pubg-orange to-amber-400', ring: 'border-pubg-orange',text: 'text-pubg-orange' },
];

function SurvivalStatRow({ label, value, highlight = false }) {
  return (
    <div className={`flex items-center justify-between py-2.5 px-4 border-b border-pubg-border/40 last:border-0 ${highlight ? 'bg-pubg-orange/5' : ''}`}>
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`font-mono text-sm font-semibold ${highlight ? 'text-pubg-orange' : 'text-white'}`}>{value}</span>
    </div>
  );
}

export default function SurvivalMastery({ platform, playerId }) {
  const [mode, setMode] = useState('squad');
  const { t } = useLanguage();

  // Survival mastery: level / tier / XP + per-tier stats
  const { data: smData, isLoading: smLoading, error: smError, refetch: smRefetch } = useQuery({
    queryKey: ['survivalMastery', platform, playerId],
    queryFn: () => pubgApi.getSurvivalMastery(platform, playerId),
  });

  // Lifetime stats: comprehensive historical survival data
  const { data: ltData, isLoading: ltLoading } = useQuery({
    queryKey: ['lifetimeStats', platform, playerId],
    queryFn: () => pubgApi.getLifetimeStats(platform, playerId),
  });

  if (smLoading) return <PageLoader />;
  if (smError) return <ErrorMessage error={smError} onRetry={smRefetch} />;

  const attrs = smData?.data?.attributes || {};
  const level = attrs.level || 0;
  const xp = attrs.xp || 0;
  const tierNum = attrs.tier || 1;
  const totalMatches = attrs.totalMatchesPlayed || 0;
  const smStats = attrs.stats || {};
  const tierInfo = TIER_MAP[Math.min(tierNum, 6)] || TIER_MAP[1];

  // Per-tier stats from survival mastery API (resets each tier)
  const g = (key, field = 'total') => smStats?.[key]?.[field] ?? 0;
  const tierHasData = Object.values(smStats).some(v => typeof v === 'object' && v !== null && (v.total > 0 || v.careerBest > 0));

  // Historical survival data from lifetime stats (cumulative, never resets)
  const ltGameMode = ltData?.data?.attributes?.gameModeStats || {};
  const lt = ltGameMode[mode] || {};
  const ltRounds  = lt.roundsPlayed || 0;
  const ltWins    = lt.wins || 0;
  const ltLosses  = lt.losses ?? Math.max(ltRounds - ltWins, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Level & Tier Hero Card */}
      <div className={`card p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5 border-2 ${tierInfo.ring}`} style={{ borderOpacity: 0.4 }}>
        <div className={`shrink-0 w-24 h-24 bg-gradient-to-br ${tierInfo.grad} rounded-2xl flex flex-col items-center justify-center shadow-xl`}>
          <span className="text-black font-black text-4xl leading-none">{level}</span>
          <span className="text-black/70 text-xs font-bold mt-0.5">{tierInfo.name}</span>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
            <Shield size={14} className={tierInfo.text} />
            <span className="text-xs text-pubg-muted uppercase tracking-wider">{t('survival_title')}</span>
          </div>
          <div className="text-3xl font-black text-white">Level {level}</div>
          <div className={`text-base font-semibold mt-0.5 ${tierInfo.text}`}>{tierInfo.name} Tier {tierNum}</div>
          <div className="flex flex-wrap gap-5 mt-3 justify-center sm:justify-start">
            <div><span className="text-pubg-orange font-bold font-mono">{formatNumber(xp)}</span><span className="text-pubg-muted text-sm ml-1">XP</span></div>
            <div><span className="text-pubg-orange font-bold font-mono">{formatNumber(totalMatches)}</span><span className="text-pubg-muted text-sm ml-1">{t('survival_total_matches')}</span></div>
          </div>
          <div className="w-full max-w-xs h-1.5 bg-pubg-border rounded-full mt-3 overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${tierInfo.grad} rounded-full`}
              style={{ width: `${Math.min((xp % 100000) / 1000, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Historical Lifetime Survival Stats */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-pubg-border flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-pubg-orange" />
            <span className="text-sm font-semibold text-white">{t('survival_lifetime_heading')}</span>
          </div>
          {/* Mode selector */}
          <div className="flex items-center gap-1">
            {GAME_MODES.slice(0, 4).map((m) => (
              <button key={m.value} onClick={() => setMode(m.value)}
                className={`text-xs px-2 py-1 rounded transition-colors ${mode === m.value ? 'bg-pubg-orange text-black font-semibold' : 'bg-pubg-border text-gray-400 hover:text-white'}`}>
                {t(m.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {ltLoading ? (
          <div className="p-8 text-center text-pubg-muted text-sm">{t('survival_lifetime_loading')}</div>
        ) : ltRounds === 0 ? (
          <div className="p-8 text-center text-pubg-muted text-sm">{t('lifetime_no_data')}</div>
        ) : (
          <div className="divide-y-0">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div>
                <SurvivalStatRow label={t('survival_total_rounds')} value={formatNumber(ltRounds)} />
                <SurvivalStatRow label={t('survival_wins')} value={formatNumber(ltWins)} highlight />
                <SurvivalStatRow label="TOP 10" value={formatNumber(lt.top10s || 0)} />
                <SurvivalStatRow label={t('survival_total_kills')} value={formatNumber(lt.kills || 0)} />
                <SurvivalStatRow label={t('survival_total_assists')} value={formatNumber(lt.assists || 0)} />
                <SurvivalStatRow label={t('survival_headshot_kills')} value={formatNumber(lt.headshotKills || 0)} />
                <SurvivalStatRow label={t('survival_dbnos')} value={formatNumber(lt.dBNOs || 0)} />
                <SurvivalStatRow label={t('survival_longest_kill')} value={`${Math.round(lt.longestKill || 0)} m`} />
              </div>
              <div>
                <SurvivalStatRow label={t('survival_total_survive')} value={formatTime(lt.timeSurvived || 0)} highlight />
                <SurvivalStatRow label={t('survival_avg_survive')} value={formatTime(ltRounds > 0 ? (lt.timeSurvived || 0) / ltRounds : 0)} />
                <SurvivalStatRow label={t('survival_total_damage')} value={formatNumber(Math.round(lt.damageDealt || 0))} highlight />
                <SurvivalStatRow label={t('survival_avg_damage')} value={formatNumber(ltRounds > 0 ? Math.round((lt.damageDealt || 0) / ltRounds) : 0)} />
                <SurvivalStatRow label={t('survival_walk_distance')} value={formatDistance(lt.walkDistance || 0)} />
                <SurvivalStatRow label={t('survival_ride_distance')} value={formatDistance(lt.rideDistance || 0)} />
                <SurvivalStatRow label={t('survival_swim_distance')} value={formatDistance(lt.swimDistance || 0)} />
                <SurvivalStatRow label={t('survival_revives')} value={formatNumber(lt.revives || 0)} />
              </div>
            </div>
            <div className="border-t border-pubg-border grid grid-cols-2 sm:grid-cols-4 divide-x divide-pubg-border/50">
              {[
                { label: t('survival_heals'), val: formatNumber(lt.heals || 0) },
                { label: t('survival_boosts'), val: formatNumber(lt.boosts || 0) },
                { label: t('survival_vehicle_destroys'), val: formatNumber(lt.vehicleDestroys || 0) },
                { label: t('survival_weapons_acquired'), val: formatNumber(lt.weaponsAcquired || 0) },
              ].map(({ label, val }) => (
                <div key={label} className="px-4 py-3 text-center">
                  <div className="font-mono font-bold text-white text-base">{val}</div>
                  <div className="text-xs text-pubg-muted mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Current Tier Stats */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-pubg-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={14} className={tierInfo.text} />
            <span className="text-sm font-semibold text-white">{t('survival_current_tier', tierNum)}</span>
          </div>
          {!tierHasData && (
            <span className="text-xs text-blue-400 flex items-center gap-1">
              <Info size={11} /> {t('survival_tier_empty')}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 divide-y divide-pubg-border/40">
          {[
            { label: t('survival_time_survived'), val: formatTime(g('timeSurvived')), best: formatTime(g('timeSurvived', 'careerBest')), last: formatTime(g('timeSurvived', 'lastMatchValue')) },
            { label: t('survival_damage_dealt'), val: formatNumber(Math.round(g('damageDealt'))), best: formatNumber(Math.round(g('damageDealt', 'careerBest'))), last: formatNumber(Math.round(g('damageDealt', 'lastMatchValue'))) },
            { label: t('survival_damage_taken'), val: formatNumber(Math.round(g('damageTaken'))), best: formatNumber(Math.round(g('damageTaken', 'careerBest'))), last: formatNumber(Math.round(g('damageTaken', 'lastMatchValue'))) },
            { label: t('survival_walk_distance'), val: formatDistance(g('distanceOnFoot')), best: formatDistance(g('distanceOnFoot', 'careerBest')), last: formatDistance(g('distanceOnFoot', 'lastMatchValue')) },
            { label: t('survival_ride_distance'), val: formatDistance(g('distanceByVehicle')), best: formatDistance(g('distanceByVehicle', 'careerBest')), last: formatDistance(g('distanceByVehicle', 'lastMatchValue')) },
            { label: t('survival_swim_distance'), val: formatDistance(g('distanceBySwimming')), best: formatDistance(g('distanceBySwimming', 'careerBest')), last: formatDistance(g('distanceBySwimming', 'lastMatchValue')) },
          ].map(({ label, val, best, last }) => (
            <div key={label} className="px-4 py-3">
              <div className="text-xs text-pubg-muted mb-1">{label}</div>
              <div className="text-white font-mono font-semibold text-sm">{val || '—'}</div>
              <div className="flex gap-3 mt-1 text-xs">
                <span className="text-yellow-400">{t('survival_best', best)}</span>
                <span className="text-blue-400">{t('survival_last', last)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
