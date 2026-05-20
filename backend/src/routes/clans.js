const router = require('express').Router();
const api = require('../services/pubgApi');
const { cacheMiddleware } = require('../middleware/cache');
const { pubgRateLimitMiddleware } = require('../middleware/pubgRateLimiter');
const { validatePlatform, validateClanId } = require('../middleware/validate');

// Get clan by ID
router.get('/:platform/clans/:clanId', validatePlatform, validateClanId, cacheMiddleware(3600), pubgRateLimitMiddleware, async (req, res) => {
  try {
    const { platform, clanId } = req.params;
    const data = await api.getClan(platform, clanId);
    res.sendCached(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
