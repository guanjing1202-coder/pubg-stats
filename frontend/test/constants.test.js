import test from 'node:test';
import assert from 'node:assert/strict';
import { PLATFORMS } from '../src/utils/constants.js';

test('platform metadata uses semantic icon types instead of emoji glyphs', () => {
  const iconTypes = new Set(PLATFORMS.map((platform) => platform.iconType));

  assert.deepEqual(iconTypes, new Set(['pc', 'console']));
  assert.equal(PLATFORMS.some((platform) => platform.icon), false);
});
