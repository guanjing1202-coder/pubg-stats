import test from 'node:test';
import assert from 'node:assert/strict';
import { getErrorState } from '../src/utils/errorState.js';

test('classifies common API failures into actionable UI states', () => {
  assert.equal(getErrorState({ status: 401, message: 'Invalid or missing API key' }).kind, 'auth');
  assert.equal(getErrorState({ status: 404, message: 'Resource not found' }).kind, 'notFound');
  assert.equal(getErrorState({ status: 429, message: 'Rate limit exceeded' }).kind, 'rateLimit');
  assert.equal(getErrorState({ message: 'Network Error' }).kind, 'network');
  assert.equal(getErrorState({ status: 500, message: 'Request failed with status code 500' }).kind, 'network');
  assert.equal(getErrorState({ message: 'timeout of 10000ms exceeded' }).kind, 'timeout');
  assert.equal(getErrorState({ status: 500, message: 'Internal server error' }).kind, 'server');
});

test('keeps the original error message available for fallback display', () => {
  const state = getErrorState({ status: 418, message: 'Short and stout' });

  assert.equal(state.kind, 'generic');
  assert.equal(state.message, 'Short and stout');
});
