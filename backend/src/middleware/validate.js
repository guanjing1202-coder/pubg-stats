const PLATFORMS = new Set(['steam', 'kakao', 'psn', 'xbox', 'console', 'stadia']);
const PLATFORM_REGIONS = new Set([
  'pc-as', 'pc-eu', 'pc-na', 'pc-oc', 'pc-ru', 'pc-sa', 'pc-sea', 'pc-kakao',
  'xbox-as', 'xbox-eu', 'xbox-na', 'xbox-oc', 'xbox-sa',
]);
const GAME_MODES = new Set(['solo', 'solo-fpp', 'duo', 'duo-fpp', 'squad', 'squad-fpp']);

const PLAYER_ID_RE = /^account\.[A-Za-z0-9_-]+$/;
const CLAN_ID_RE = /^clan\.[A-Za-z0-9_-]+$/;
const MATCH_ID_RE = /^[A-Za-z0-9-]{8,}$/;
const SEASON_ID_RE = /^division\.bro\.official\.(?:pc|console)-2018-\d+$|^division\.bro\.official\.(?:playstation|xbox|stadia)-\d+$/;
const PLAYER_NAME_RE = /^[\w.\- ]{2,32}$/;

const TELEMETRY_HOSTS = new Set([
  'telemetry-cdn.pubg.com',
  'telemetry-cdn.playbattlegrounds.com',
]);

function badRequest(res, error) {
  return res.status(400).json({ error });
}

function validatePlatform(req, res, next) {
  const { platform } = req.params;
  if (!PLATFORMS.has(platform)) {
    return badRequest(res, 'Invalid platform');
  }
  next();
}

function validatePlatformRegion(req, res, next) {
  const { platformRegion } = req.params;
  if (!PLATFORM_REGIONS.has(platformRegion)) {
    return badRequest(res, 'Invalid platform region');
  }
  next();
}

function validateGameMode(req, res, next) {
  const { gameMode } = req.params;
  if (!GAME_MODES.has(gameMode)) {
    return badRequest(res, 'Invalid game mode');
  }
  next();
}

function validatePlayerName(req, res, next) {
  const { name } = req.query;
  if (!name || typeof name !== 'string') {
    return badRequest(res, 'Player name is required');
  }
  if (!PLAYER_NAME_RE.test(name.trim())) {
    return badRequest(res, 'Invalid player name');
  }
  next();
}

function validatePlayerId(req, res, next) {
  const { playerId } = req.params;
  if (!PLAYER_ID_RE.test(playerId)) {
    return badRequest(res, 'Invalid player ID');
  }
  next();
}

function validateClanId(req, res, next) {
  const { clanId } = req.params;
  if (!CLAN_ID_RE.test(clanId)) {
    return badRequest(res, 'Invalid clan ID');
  }
  next();
}

function validateSeasonId(req, res, next) {
  const { seasonId } = req.params;
  if (!SEASON_ID_RE.test(seasonId)) {
    return badRequest(res, 'Invalid season ID');
  }
  next();
}

function validateMatchId(req, res, next) {
  const { matchId } = req.params;
  if (!MATCH_ID_RE.test(matchId)) {
    return badRequest(res, 'Invalid match ID');
  }
  next();
}

function validateTelemetryUrl(req, res, next) {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return badRequest(res, 'Telemetry URL is required');
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !TELEMETRY_HOSTS.has(parsed.hostname.toLowerCase())) {
      return badRequest(res, 'Invalid telemetry URL');
    }
  } catch {
    return badRequest(res, 'Invalid telemetry URL');
  }

  next();
}

module.exports = {
  validatePlatform,
  validatePlatformRegion,
  validateGameMode,
  validatePlayerName,
  validatePlayerId,
  validateClanId,
  validateSeasonId,
  validateMatchId,
  validateTelemetryUrl,
  constants: {
    PLATFORMS,
    PLATFORM_REGIONS,
    GAME_MODES,
    TELEMETRY_HOSTS,
  },
};
