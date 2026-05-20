const DEFAULT_LIMIT = 10;
const WINDOW_MS = 60 * 1000;

const limitPerMinute = Math.max(
  1,
  parseInt(process.env.PUBG_RATE_LIMIT_PER_MINUTE || DEFAULT_LIMIT, 10)
);
const intervalMs = Math.ceil(WINDOW_MS / limitPerMinute);

let queue = [];
let active = false;
let nextRunAt = 0;

function drainQueue() {
  if (active || queue.length === 0) return;

  const now = Date.now();
  const delay = Math.max(nextRunAt - now, 0);
  active = true;

  setTimeout(() => {
    const next = queue.shift();
    nextRunAt = Date.now() + intervalMs;
    active = false;

    if (next) {
      next();
    }
    drainQueue();
  }, delay);
}

function schedulePubgRequest(task) {
  return new Promise((resolve, reject) => {
    queue.push(() => {
      Promise.resolve()
        .then(task)
        .then(resolve, reject);
    });
    drainQueue();
  });
}

function pubgRateLimitMiddleware(req, res, next) {
  schedulePubgRequest(() => new Promise((resolve) => {
    res.on('finish', resolve);
    next();
  })).catch(next);
}

function getPubgRateLimitState() {
  return {
    limitPerMinute,
    intervalMs,
    queueLength: queue.length,
    nextRunAt,
  };
}

module.exports = {
  schedulePubgRequest,
  pubgRateLimitMiddleware,
  getPubgRateLimitState,
};
