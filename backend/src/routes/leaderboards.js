const router = require('express').Router();
const api = require('../services/pubgApi');
const { cacheMiddleware } = require('../middleware/cache');
const { validatePlatformRegion, validateSeasonId, validateGameMode } = require('../middleware/validate');

// Get leaderboard — uses platform-region shard (e.g. pc-na, pc-eu, pc-as)
router.get('/:platformRegion/leaderboards/:seasonId/:gameMode', validatePlatformRegion, validateSeasonId, validateGameMode, cacheMiddleware(7200), async (req, res) => {
  try {
    const { platformRegion, seasonId, gameMode } = req.params;
    const data = await api.getLeaderboard(platformRegion, seasonId, gameMode);
    res.sendCached(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
