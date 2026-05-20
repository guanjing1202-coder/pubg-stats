import axios from 'axios';
import { API_BASE } from './constants';

const client = axios.create({ baseURL: API_BASE });

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.error || err.message;
    const error = new Error(msg);
    error.status = err.response?.status;
    return Promise.reject(error);
  }
);

export const pubgApi = {
  // Status
  getStatus: () => client.get('/status'),

  // Players
  searchPlayer: (platform, name) =>
    client.get(`/${platform}/players`, { params: { name } }),
  getPlayer: (platform, playerId) =>
    client.get(`/${platform}/players/${playerId}`),

  // Seasons
  getSeasons: (platform) => client.get(`/${platform}/seasons`),
  getSeasonStats: (platform, playerId, seasonId) =>
    client.get(`/${platform}/players/${playerId}/seasons/${seasonId}`),
  getRankedStats: (platform, playerId, seasonId) =>
    client.get(`/${platform}/players/${playerId}/seasons/${seasonId}/ranked`),
  getLifetimeStats: (platform, playerId) =>
    client.get(`/${platform}/players/${playerId}/lifetime`),

  // Matches
  getMatch: (platform, matchId) =>
    client.get(`/${platform}/matches/${matchId}`),
  getTelemetry: (url) =>
    client.get('/telemetry', { params: { url } }),

  // Mastery
  getWeaponMastery: (platform, playerId) =>
    client.get(`/${platform}/players/${playerId}/weapon_mastery`),
  getSurvivalMastery: (platform, playerId) =>
    client.get(`/${platform}/players/${playerId}/survival_mastery`),

  // Leaderboard
  getLeaderboard: (platformRegion, seasonId, gameMode) =>
    client.get(`/${platformRegion}/leaderboards/${seasonId}/${gameMode}`),
};
