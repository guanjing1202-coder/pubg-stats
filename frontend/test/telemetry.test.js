import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeTelemetry,
  formatTelemetryTime,
  getTelemetryAssetUrl,
} from '../src/utils/telemetry.js';

const matchStart = '2026-05-20T10:00:00.000Z';

test('extracts telemetry asset URL from match includes', () => {
  const included = [
    { type: 'participant', attributes: {} },
    { type: 'asset', attributes: { URL: 'https://telemetry-cdn.pubg.com/sample.json' } },
  ];

  assert.equal(getTelemetryAssetUrl(included), 'https://telemetry-cdn.pubg.com/sample.json');
});

test('analyzes kills, damage, knocks, revives, and highlighted player events', () => {
  const events = [
    {
      _T: 'LogPlayerTakeDamage',
      _D: '2026-05-20T10:01:00.000Z',
      attacker: { name: 'Alpha' },
      victim: { name: 'Bravo' },
      damage: 42.6,
    },
    {
      _T: 'LogPlayerMakeGroggy',
      _D: '2026-05-20T10:01:20.000Z',
      attacker: { name: 'Alpha' },
      victim: { name: 'Bravo' },
    },
    {
      _T: 'LogPlayerRevive',
      _D: '2026-05-20T10:01:40.000Z',
      reviver: { name: 'Charlie' },
      victim: { name: 'Bravo' },
    },
    {
      _T: 'LogPlayerKill',
      _D: '2026-05-20T10:02:00.000Z',
      killer: { name: 'Alpha' },
      victim: { name: 'Bravo' },
      damageCauserName: 'weapon_akm',
      distance: 92.4,
    },
    {
      _T: 'LogPhaseChange',
      _D: '2026-05-20T10:03:00.000Z',
      phase: 2,
    },
  ];

  const report = analyzeTelemetry(events, { matchStart, highlightPlayerName: 'Alpha' });

  assert.equal(report.totalEvents, 5);
  assert.equal(report.totalKills, 1);
  assert.equal(report.totalDamage, 43);
  assert.equal(report.damageEventCount, 1);
  assert.deepEqual(report.kills[0], {
    time: 120,
    killer: 'Alpha',
    victim: 'Bravo',
    weapon: 'weapon_akm',
    distance: 92,
  });
  assert.deepEqual(report.topDamage[0], { name: 'Alpha', value: 43 });
  assert.deepEqual(report.topDamageTaken[0], { name: 'Bravo', value: 43 });
  assert.deepEqual(report.phases[0], { time: 180, phase: 2 });
  assert.deepEqual(report.highlight, {
    kills: 1,
    deaths: 0,
    damageDealt: 43,
    damageTaken: 0,
    knocks: 1,
    revives: 0,
  });
  assert.deepEqual(
    report.highlightEvents.map((event) => event.type),
    ['groggy', 'kill']
  );
});

test('reads LogPlayerKillV2 weapon and distance from killer damage info', () => {
  const events = [
    {
      _T: 'LogPlayerKillV2',
      _D: '2026-05-20T10:04:00.000Z',
      killer: { name: 'Alpha' },
      victim: { name: 'Delta' },
      killerDamageInfo: {
        damageCauserName: 'Item_Weapon_BerylM762_C',
        distance: 133.8,
      },
    },
  ];

  const report = analyzeTelemetry(events, { matchStart });

  assert.equal(report.totalKills, 1);
  assert.deepEqual(report.kills[0], {
    time: 240,
    killer: 'Alpha',
    victim: 'Delta',
    weapon: 'Item_Weapon_BerylM762_C',
    distance: 134,
  });
});

test('formats invalid or negative telemetry times as zero', () => {
  assert.equal(formatTelemetryTime(-7), '0:00');
  assert.equal(formatTelemetryTime(Number.NaN), '0:00');
  assert.equal(formatTelemetryTime(125), '2:05');
});
