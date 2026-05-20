const NodeCache = require('node-cache');

const cache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes default
  checkperiod: 120,
  useClones: false,
});

function cacheMiddleware(ttl) {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    if (cached) {
      return res.json(cached);
    }
    res.sendCached = (data) => {
      cache.set(key, data, ttl || parseInt(process.env.CACHE_TTL || '300', 10));
      res.json(data);
    };
    next();
  };
}

module.exports = { cache, cacheMiddleware };
