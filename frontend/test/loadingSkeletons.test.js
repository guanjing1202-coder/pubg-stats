import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LEADERBOARD_SKELETON_COLUMNS,
  LOADING_SKELETON_COUNTS,
} from '../src/components/common/loadingSkeletonConfig.js';

test('loading skeletons mirror the main data surfaces', () => {
  assert.equal(LEADERBOARD_SKELETON_COLUMNS.length, 7);
  assert.equal(LOADING_SKELETON_COUNTS.leaderboardRows, 8);
  assert.equal(LOADING_SKELETON_COUNTS.playerTabs, 6);
  assert.equal(LOADING_SKELETON_COUNTS.statCards, 12);
});
