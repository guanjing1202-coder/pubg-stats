const router = require('express').Router();
const api = require('../services/pubgApi');
const { cacheMiddleware } = require('../middleware/cache');
const { pubgRateLimitMiddleware } = require('../middleware/pubgRateLimiter');
const {
  validatePlatform,
  validatePlayerName,
  validatePlayerId,
  validateSeasonId,
} = require('../middleware/validate');

// Search players by name
router.get('/:platform/players', validatePlatform, validatePlayerName, cacheMiddleware(60), pubgRateLimitMiddleware, async (req, res) => {
  try {
    const { platform } = req.params;
    const { name } = req.query;
    const data = await api.getPlayersByName(platform, name);
    res.sendCached(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Get player by ID
router.get('/:platform/players/:playerId', validatePlatform, validatePlayerId, cacheMiddleware(60), pubgRateLimitMiddleware, async (req, res) => {
  try {
    const { platform, playerId } = req.params;
    const data = await api.getPlayerById(platform, playerId);
    res.sendCached(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Season stats (normal)
router.get('/:platform/players/:playerId/seasons/:seasonId', validatePlatform, validatePlayerId, validateSeasonId, cacheMiddleware(300), pubgRateLimitMiddleware, async (req, res) => {
  try {
    const { platform, playerId, seasonId } = req.params;
    const data = await api.getPlayerSeasonStats(platform, playerId, seasonId);
    res.sendCached(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Ranked stats
router.get('/:platform/players/:playerId/seasons/:seasonId/ranked', validatePlatform, validatePlayerId, validateSeasonId, cacheMiddleware(300), pubgRateLimitMiddleware, async (req, res) => {
  try {
    const { platform, playerId, seasonId } = req.params;
    const data = await api.getPlayerRankedStats(platform, playerId, seasonId);
    res.sendCached(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Lifetime stats
router.get('/:platform/players/:playerId/lifetime', validatePlatform, validatePlayerId, cacheMiddleware(300), pubgRateLimitMiddleware, async (req, res) => {
  try {
    const { platform, playerId } = req.params;
    const data = await api.getPlayerLifetimeStats(platform, playerId);
    res.sendCached(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Weapon mastery
router.get('/:platform/players/:playerId/weapon_mastery', validatePlatform, validatePlayerId, cacheMiddleware(600), pubgRateLimitMiddleware, async (req, res) => {
  try {
    const { platform, playerId } = req.params;
    const data = await api.getWeaponMastery(platform, playerId);
    res.sendCached(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Survival mastery
router.get('/:platform/players/:playerId/survival_mastery', validatePlatform, validatePlayerId, cacheMiddleware(600), pubgRateLimitMiddleware, async (req, res) => {
  try {
    const { platform, playerId } = req.params;
    const data = await api.getSurvivalMastery(platform, playerId);
    res.sendCached(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
