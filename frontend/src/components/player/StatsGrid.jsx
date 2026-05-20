import StatCard from '../common/StatCard';
import {
  formatKDA, formatWinRate, formatAvgDamage, formatNumber,
  formatDistance, formatTime, formatTopRate,
} from '../../utils/formatters';
import { Target, Trophy, Zap, Clock, Crosshair, Heart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function StatsGrid({ stats, title }) {
  const { t } = useLanguage();
  if (!stats) return null;
  const {
    kills, deaths, assists, wins, top10s, rounds,
    damage, headshotKills, longestKill,
    timeSurvived, walkDistance, boosts, heals, revives,
  } = stats;

  const kda = formatKDA(kills, deaths, assists);
  const winRate = formatWinRate(wins, rounds);
  const top10Rate = formatTopRate(top10s, rounds);
  const avgDmg = formatAvgDamage(damage, rounds);
  const hsRate = kills > 0 ? ((headshotKills / kills) * 100).toFixed(1) + '%' : '0%';
  const avgKills = rounds > 0 ? (kills / rounds).toFixed(2) : '0';

  return (
    <div>
      {title && <h3 className="text-sm font-semibold text-pubg-muted uppercase tracking-wider mb-3">{title}</h3>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <StatCard label={t('stat_kda')} value={kda} sub={t('stat_kda_sub', kills, deaths, assists)} highlight icon={<Target size={14} />} />
        <StatCard label={t('stat_win_rate')} value={winRate} sub={t('stat_win_rate_sub', wins, rounds)} icon={<Trophy size={14} />} />
        <StatCard label={t('stat_avg_damage')} value={avgDmg} sub={t('stat_avg_damage_sub', formatNumber(Math.round(damage)))} icon={<Zap size={14} />} />
        <StatCard label={t('stat_avg_kills')} value={avgKills} sub={t('stat_avg_kills_sub', formatNumber(kills))} icon={<Target size={14} />} />
        <StatCard label={t('stat_hs_rate')} value={hsRate} sub={t('stat_hs_rate_sub', formatNumber(headshotKills))} icon={<Crosshair size={14} />} />
        <StatCard label={t('stat_longest_kill')} value={`${Math.round(longestKill || 0)}m`} icon={<Crosshair size={14} />} />
        <StatCard label={t('stat_top10_rate')} value={top10Rate} sub={t('stat_top10_rate_sub', top10s)} />
        <StatCard label={t('stat_avg_survive')} value={formatTime((timeSurvived || 0) / Math.max(rounds, 1))} sub={t('stat_avg_survive_sub', formatTime(timeSurvived))} icon={<Clock size={14} />} />
        <StatCard label={t('stat_walk')} value={formatDistance(walkDistance)} />
        <StatCard label={t('stat_heals')} value={formatNumber(heals)} sub={t('stat_heals_sub', formatNumber(boosts))} icon={<Heart size={14} />} />
        <StatCard label={t('stat_revives')} value={formatNumber(revives)} />
        <StatCard label={t('stat_knocks')} value={formatNumber(stats.dBNOs)} />
        <StatCard label={t('stat_rounds')} value={formatNumber(rounds)} />
      </div>
    </div>
  );
}
