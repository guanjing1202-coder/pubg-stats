const router = require('express').Router();
const api = require('../services/pubgApi');
const { cacheMiddleware } = require('../middleware/cache');
const { validatePlatform, validateMatchId, validateTelemetryUrl } = require('../middleware/validate');

// ── Telemetry ─────────────────────────────────────────────────────────────────
// MUST be defined before /:platform/matches/:matchId to avoid path collision.
// Frontend calls: GET /api/telemetry?url=...
router.get('/telemetry', validateTelemetryUrl, cacheMiddleware(3600), async (req, res) => {
  try {
    const { url } = req.query;
    const data = await api.getTelemetry(url);
    res.sendCached(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ── Match details ─────────────────────────────────────────────────────────────
// /matches endpoints do NOT count against PUBG rate limits.
router.get('/:platform/matches/:matchId', validatePlatform, validateMatchId, cacheMiddleware(3600), async (req, res) => {
  try {
    const { platform, matchId } = req.params;
    const data = await api.getMatch(platform, matchId);
    res.sendCached(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
