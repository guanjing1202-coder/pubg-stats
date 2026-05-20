const axios = require('axios');

const BASE_URL = 'https://api.pubg.com';

const pubgClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.PUBG_API_KEY}`,
    Accept: 'application/vnd.api+json',
  },
  timeout: 15000,
});

// Intercept responses to normalize errors
pubgClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message =
      status === 401 ? 'Invalid or missing API key'
      : status === 404 ? 'Resource not found'
      : status === 415 ? 'Unsupported media type'
      : status === 429 ? 'Rate limit exceeded, please try again in a minute'
      : err.message;
    const error = new Error(message);
    error.status = status || 500;
    return Promise.reject(error);
  }
);

// ── Players ──────────────────────────────────────────────────────────────────

async function getPlayersByName(platform, names) {
  const { data } = await pubgClient.get(
    `/shards/${platform}/players?filter[playerNames]=${encodeURIComponent(names)}`
  );
  return data;
}

async function getPlayerById(platform, playerId) {
  const { data } = await pubgClient.get(`/shards/${platform}/players/${playerId}`);
  return data;
}

// ── Seasons ───────────────────────────────────────────────────────────────────

async function getSeasons(platform) {
  const { data } = await pubgClient.get(`/shards/${platform}/seasons`);
  return data;
}

async function getPlayerSeasonStats(platform, playerId, seasonId) {
  const { data } = await pubgClient.get(
    `/shards/${platform}/players/${playerId}/seasons/${seasonId}`
  );
  return data;
}

async function getPlayerRankedStats(platform, playerId, seasonId) {
  const { data } = await pubgClient.get(
    `/shards/${platform}/players/${playerId}/seasons/${seasonId}/ranked`
  );
  return data;
}

async function getPlayerLifetimeStats(platform, playerId) {
  const { data } = await pubgClient.get(
    `/shards/${platform}/players/${playerId}/seasons/lifetime`
  );
  return data;
}

// ── Matches ───────────────────────────────────────────────────────────────────

async function getMatch(platform, matchId) {
  const { data } = await pubgClient.get(`/shards/${platform}/matches/${matchId}`);
  return data;
}

// ── Mastery ───────────────────────────────────────────────────────────────────

async function getWeaponMastery(platform, playerId) {
  const { data } = await pubgClient.get(
    `/shards/${platform}/players/${playerId}/weapon_mastery`
  );
  return data;
}

async function getSurvivalMastery(platform, playerId) {
  const { data } = await pubgClient.get(
    `/shards/${platform}/players/${playerId}/survival_mastery`
  );
  return data;
}

// ── Leaderboards ──────────────────────────────────────────────────────────────

async function getLeaderboard(platformRegion, seasonId, gameMode) {
  const { data } = await pubgClient.get(
    `/shards/${platformRegion}/leaderboards/${seasonId}/${gameMode}`
  );
  return data;
}

// ── Clans ────────────────────────────────────────────────────────────────────

async function getClan(platform, clanId) {
  const { data } = await pubgClient.get(`/shards/${platform}/clans/${clanId}`);
  return data;
}

// ── Status ────────────────────────────────────────────────────────────────────

async function getStatus() {
  const { data } = await pubgClient.get('/status');
  return data;
}

// ── Telemetry ─────────────────────────────────────────────────────────────────

async function getTelemetry(telemetryUrl) {
  const { data } = await axios.get(telemetryUrl, {
    headers: { Accept: 'application/json', 'Accept-Encoding': 'gzip' },
    timeout: 30000,
  });
  return data;
}

module.exports = {
  getPlayersByName,
  getPlayerById,
  getSeasons,
  getPlayerSeasonStats,
  getPlayerRankedStats,
  getPlayerLifetimeStats,
  getMatch,
  getWeaponMastery,
  getSurvivalMastery,
  getLeaderboard,
  getClan,
  getStatus,
  getTelemetry,
};
