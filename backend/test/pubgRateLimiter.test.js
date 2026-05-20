const assert = require('node:assert/strict');
const test = require('node:test');

process.env.PUBG_RATE_LIMIT_PER_MINUTE = '600';

const { schedulePubgRequest } = require('../src/middleware/pubgRateLimiter');

test('queues PUBG API tasks instead of running them concurrently', async () => {
  const starts = [];

  await Promise.all([
    schedulePubgRequest(() => {
      starts.push(Date.now());
      return 'first';
    }),
    schedulePubgRequest(() => {
      starts.push(Date.now());
      return 'second';
    }),
  ]);

  assert.equal(starts.length, 2);
  assert.ok(starts[1] - starts[0] >= 90);
});
