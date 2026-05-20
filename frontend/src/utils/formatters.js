import { MAP_NAMES } from './constants';

export function formatKDA(kills, deaths, assists) {
  const d = Math.max(deaths, 1);
  return ((kills + assists * 0.5) / d).toFixed(2);
}

export function formatWinRate(wins, rounds) {
  if (!rounds) return '0%';
  return ((wins / rounds) * 100).toFixed(1) + '%';
}

export function formatTopRate(top10s, rounds) {
  if (!rounds) return '0%';
  return ((top10s / rounds) * 100).toFixed(1) + '%';
}

export function formatDamage(dmg) {
  return Math.round(dmg || 0).toLocaleString();
}

export function formatAvgDamage(dmg, rounds) {
  if (!rounds) return '0';
  return Math.round(dmg / rounds).toLocaleString();
}

export function formatNumber(n) {
  return (n || 0).toLocaleString();
}

export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatDistance(meters) {
  if (meters >= 1000) return (meters / 1000).toFixed(1) + ' km';
  return Math.round(meters) + ' m';
}

export function formatDate(dateStr, lang = 'zh') {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export function formatDateTime(dateStr, t, lang = 'zh') {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return t ? t('date_minutes_ago', Math.max(mins, 0)) : `${Math.max(mins, 0)} 分钟前`;
  if (hours < 24) return t ? t('date_hours_ago', hours) : `${hours} 小时前`;
  if (days < 7) return t ? t('date_days_ago', days) : `${days} 天前`;
  return formatDate(dateStr, lang);
}

export function getMapName(mapId) {
  return MAP_NAMES[mapId] || mapId || 'Unknown';
}

export function getRankTier(tier, subTier) {
  if (!tier) return null;
  return subTier ? `${tier} ${subTier}` : tier;
}

export function getPlatformLabel(platform) {
  const map = { steam: 'Steam', psn: 'PlayStation', xbox: 'Xbox', kakao: 'Kakao', stadia: 'Stadia' };
  return map[platform] || platform;
}

export function extractPlayerStats(statsObj) {
  if (!statsObj) return null;
  const rounds = statsObj.roundsPlayed || 0;
  const wins = statsObj.wins || 0;
  // PUBG API has no 'deaths' field in season stats.
  // Use 'losses' if present, otherwise roundsPlayed - wins (each non-win = one death).
  const deaths = statsObj.losses !== undefined
    ? statsObj.losses
    : Math.max(rounds - wins, 0);
  return {
    kills: statsObj.kills || 0,
    deaths,
    assists: statsObj.assists || 0,
    wins,
    top10s: statsObj.top10s || 0,
    rounds,
    damage: statsObj.damageDealt || 0,
    headshotKills: statsObj.headshotKills || 0,
    longestKill: statsObj.longestKill || 0,
    timeSurvived: statsObj.timeSurvived || 0,
    walkDistance: statsObj.walkDistance || 0,
    rideDistance: statsObj.rideDistance || 0,
    swimDistance: statsObj.swimDistance || 0,
    boosts: statsObj.boosts || 0,
    heals: statsObj.heals || 0,
    revives: statsObj.revives || 0,
    teamKills: statsObj.teamKills || 0,
    vehicleDestroys: statsObj.vehicleDestroys || 0,
    weaponsAcquired: statsObj.weaponsAcquired || 0,
    dBNOs: statsObj.dBNOs || 0,       // knocks (down but not out)
    roadKills: statsObj.roadKills || 0,
  };
}
