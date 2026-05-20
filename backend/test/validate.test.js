const assert = require('node:assert/strict');
const test = require('node:test');
const {
  validatePlatform,
  validatePlatformRegion,
  validateGameMode,
  validatePlayerName,
  validatePlayerId,
  validateSeasonId,
  validateMatchId,
  validateTelemetryUrl,
} = require('../src/middleware/validate');

function runValidator(validator, req) {
  let statusCode = 200;
  let body = null;
  let nextCalled = false;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      body = payload;
      return this;
    },
  };

  validator(req, res, () => {
    nextCalled = true;
  });

  return { statusCode, body, nextCalled };
}

test('accepts valid platform and rejects unknown platform', () => {
  assert.equal(runValidator(validatePlatform, { params: { platform: 'steam' } }).nextCalled, true);

  const invalid = runValidator(validatePlatform, { params: { platform: 'pc-as' } });
  assert.equal(invalid.statusCode, 400);
  assert.equal(invalid.nextCalled, false);
});

test('accepts valid leaderboard region and game mode', () => {
  assert.equal(runValidator(validatePlatformRegion, { params: { platformRegion: 'pc-as' } }).nextCalled, true);
  assert.equal(runValidator(validateGameMode, { params: { gameMode: 'squad-fpp' } }).nextCalled, true);
});

test('validates player names and IDs', () => {
  assert.equal(runValidator(validatePlayerName, { query: { name: 'Player_01' } }).nextCalled, true);
  assert.equal(runValidator(validatePlayerId, { params: { playerId: 'account.abc_123-XYZ' } }).nextCalled, true);

  assert.equal(runValidator(validatePlayerName, { query: { name: '<script>' } }).statusCode, 400);
  assert.equal(runValidator(validatePlayerId, { params: { playerId: 'not-account' } }).statusCode, 400);
});

test('validates PUBG season and match IDs', () => {
  assert.equal(runValidator(validateSeasonId, { params: { seasonId: 'division.bro.official.pc-2018-30' } }).nextCalled, true);
  assert.equal(runValidator(validateSeasonId, { params: { seasonId: 'division.bro.official.console-2018-30' } }).nextCalled, true);
  assert.equal(runValidator(validateMatchId, { params: { matchId: '2b2b4c7e-1234-4fd1-9bd8-777777777777' } }).nextCalled, true);

  assert.equal(runValidator(validateSeasonId, { params: { seasonId: '../secret' } }).statusCode, 400);
  assert.equal(runValidator(validateMatchId, { params: { matchId: '../../etc/passwd' } }).statusCode, 400);
});

test('only allows official telemetry CDN URLs over HTTPS', () => {
  const valid = runValidator(validateTelemetryUrl, {
    query: { url: 'https://telemetry-cdn.pubg.com/bluehole-pubg/pc-na/sample-telemetry.json' },
  });
  assert.equal(valid.nextCalled, true);

  const legacyValid = runValidator(validateTelemetryUrl, {
    query: { url: 'https://telemetry-cdn.playbattlegrounds.com/bluehole-pubg/pc-na/sample-telemetry.json' },
  });
  assert.equal(legacyValid.nextCalled, true);

  assert.equal(runValidator(validateTelemetryUrl, { query: { url: 'http://telemetry-cdn.pubg.com/file.json' } }).statusCode, 400);
  assert.equal(runValidator(validateTelemetryUrl, { query: { url: 'https://evil.example/pubg/file.json' } }).statusCode, 400);
});
