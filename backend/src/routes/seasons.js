const router = require('express').Router();
const api = require('../services/pubgApi');
const { cacheMiddleware } = require('../middleware/cache');
const { pubgRateLimitMiddleware } = require('../middleware/pubgRateLimiter');
const { validatePlatform } = require('../middleware/validate');

const SEASONS_CACHE_TTL = parseInt(process.env.SEASONS_CACHE_TTL || '604800', 10); // 7 days

// List all seasons for a platform
router.get('/:platform/seasons', validatePlatform, cacheMiddleware(SEASONS_CACHE_TTL), pubgRateLimitMiddleware, async (req, res) => {
  try {
    const { platform } = req.params;
    const data = await api.getSeasons(platform);
    res.sendCached(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
