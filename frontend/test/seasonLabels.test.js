import test from 'node:test';
import assert from 'node:assert/strict';
import { formatSeasonId } from '../src/utils/seasonLabels.js';

test('formats PUBG season ids for compact UI controls', () => {
  assert.equal(formatSeasonId('division.bro.official.pc-2018-36'), 'S36');
  assert.equal(formatSeasonId('division.bro.official.console-2018-35'), 'S35');
});

test('keeps unrecognized season ids readable', () => {
  assert.equal(formatSeasonId('division.bro.official.esports-2026-alpha'), 'esports-2026-alpha');
  assert.equal(formatSeasonId('custom-season'), 'custom-season');
});
