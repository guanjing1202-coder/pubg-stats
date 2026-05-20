const router = require('express').Router();
const api = require('../services/pubgApi');
const { cacheMiddleware } = require('../middleware/cache');
const { validatePlatform } = require('../middleware/validate');

// List all seasons for a platform
router.get('/:platform/seasons', validatePlatform, cacheMiddleware(3600), async (req, res) => {
  try {
    const { platform } = req.params;
    const data = await api.getSeasons(platform);
    res.sendCached(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
