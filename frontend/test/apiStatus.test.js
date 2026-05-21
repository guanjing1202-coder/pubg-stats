import test from 'node:test';
import assert from 'node:assert/strict';
import { getApiStatusState } from '../src/utils/apiStatusState.js';

test('classifies homepage API status query states', () => {
  assert.equal(getApiStatusState({ isLoading: true }).kind, 'checking');
  assert.equal(getApiStatusState({ status: { data: { id: 'pubg-api' } } }).kind, 'online');
  assert.equal(getApiStatusState({ error: { message: 'Network Error' } }).kind, 'network');
  assert.equal(getApiStatusState({ error: { status: 500, message: 'Internal server error' } }).kind, 'degraded');
});

test('treats an empty status response as degraded instead of online', () => {
  assert.equal(getApiStatusState({ status: {} }).kind, 'degraded');
});
