function getCharacterName(character) {
  return character?.name || character?.accountId || null;
}

function normalizeTime(event, matchStartMs) {
  const eventMs = Date.parse(event?._D || '');
  if (!Number.isFinite(eventMs) || !Number.isFinite(matchStartMs)) return 0;
  return Math.max(Math.round((eventMs - matchStartMs) / 1000), 0);
}

function addToMap(map, key, value) {
  if (!key || !Number.isFinite(value) || value <= 0) return;
  map.set(key, (map.get(key) || 0) + value);
}

function mapToSortedRows(map) {
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);
}

export function formatTelemetryItemName(value) {
  if (!value) return '-';

  const cleaned = String(value)
    .replace(/^Item_/, '')
    .replace(/^Weapon_/, '')
    .replace(/^Damage_/, '')
    .replace(/_C$/, '')
    .replace(/^weapon_/, '')
    .replace(/_/g, ' ');

  if (cleaned.toLowerCase() === 'akm') return 'AKM';

  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getTelemetryAssetUrl(included = []) {
  const asset = included.find((item) => item.type === 'asset' && (item.attributes?.URL || item.attributes?.url));
  return asset?.attributes?.URL || asset?.attributes?.url || null;
}

export function formatTelemetryTime(seconds = 0) {
  const normalizedSeconds = Math.max(Math.round(Number(seconds) || 0), 0);
  const mins = Math.floor(normalizedSeconds / 60);
  const secs = normalizedSeconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function analyzeTelemetry(events = [], { matchStart, highlightPlayerName } = {}) {
  const firstEvent = events.find((event) => event?._D);
  const matchStartMs = Date.parse(matchStart || firstEvent?._D || '');

  const kills = [];
  const phases = [];
  const groggies = [];
  const revives = [];
  const damageDealt = new Map();
  const damageTaken = new Map();
  const damageCausers = new Map();
  const damageCategories = new Map();
  let damageEventCount = 0;

  events.forEach((event) => {
    const type = event?._T;
    const time = normalizeTime(event, matchStartMs);

    if (type === 'LogPlayerKill' || type === 'LogPlayerKillV2') {
      const killer = getCharacterName(event.killer);
      const victim = getCharacterName(event.victim);
      if (victim) {
        kills.push({
          time,
          killer,
          victim,
          weapon: event.damageCauserName || event.damageTypeCategory || event.killerDamageInfo?.damageCauserName || '-',
          distance: Math.round(event.distance || event.killerDamageInfo?.distance || 0),
        });
      }
    }

    if (type === 'LogPlayerTakeDamage') {
      const attacker = getCharacterName(event.attacker);
      const victim = getCharacterName(event.victim);
      const damage = Number(event.damage || 0);
      damageEventCount += 1;
      addToMap(damageDealt, attacker, damage);
      addToMap(damageTaken, victim, damage);
      addToMap(damageCausers, formatTelemetryItemName(event.damageCauserName), damage);
      addToMap(damageCategories, formatTelemetryItemName(event.damageTypeCategory), damage);
    }

    if (type === 'LogPlayerMakeGroggy') {
      const attacker = getCharacterName(event.attacker);
      const victim = getCharacterName(event.victim);
      if (victim) {
        groggies.push({ time, attacker, victim });
      }
    }

    if (type === 'LogPlayerRevive') {
      const reviver = getCharacterName(event.reviver);
      const victim = getCharacterName(event.victim);
      if (victim) {
        revives.push({ time, reviver, victim });
      }
    }

    if (type === 'LogPhaseChange') {
      phases.push({
        time,
        phase: event.phase || event.common?.isGame || phases.length + 1,
      });
    }
  });

  const totalDamage = Array.from(damageDealt.values()).reduce((sum, value) => sum + value, 0);
  const highlightName = highlightPlayerName || null;
  const highlight = highlightName ? {
    kills: kills.filter((event) => event.killer === highlightName).length,
    deaths: kills.filter((event) => event.victim === highlightName).length,
    damageDealt: Math.round(damageDealt.get(highlightName) || 0),
    damageTaken: Math.round(damageTaken.get(highlightName) || 0),
    knocks: groggies.filter((event) => event.attacker === highlightName).length,
    revives: revives.filter((event) => event.reviver === highlightName).length,
  } : null;

  const highlightEvents = highlightName
    ? [
        ...kills.filter((event) => event.killer === highlightName || event.victim === highlightName)
          .map((event) => ({ ...event, type: 'kill' })),
        ...groggies.filter((event) => event.attacker === highlightName || event.victim === highlightName)
          .map((event) => ({ ...event, type: 'groggy' })),
        ...revives.filter((event) => event.reviver === highlightName || event.victim === highlightName)
          .map((event) => ({ ...event, type: 'revive' })),
      ].sort((a, b) => a.time - b.time)
    : [];

  return {
    totalEvents: events.length,
    totalKills: kills.length,
    totalDamage: Math.round(totalDamage),
    damageEventCount,
    kills: kills.sort((a, b) => a.time - b.time),
    phases: phases.sort((a, b) => a.time - b.time),
    topDamage: mapToSortedRows(damageDealt),
    topDamageTaken: mapToSortedRows(damageTaken),
    topDamageCausers: mapToSortedRows(damageCausers),
    topDamageCategories: mapToSortedRows(damageCategories),
    highlight,
    highlightEvents,
  };
}
