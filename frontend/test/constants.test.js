import test from 'node:test';
import assert from 'node:assert/strict';
import { PLATFORMS, PLATFORM_REGIONS } from '../src/utils/constants.js';
import { translations } from '../src/i18n/translations.js';

test('platform metadata uses semantic icon types instead of emoji glyphs', () => {
  const iconTypes = new Set(PLATFORMS.map((platform) => platform.iconType));

  assert.deepEqual(iconTypes, new Set(['pc', 'console']));
  assert.equal(PLATFORMS.some((platform) => platform.icon), false);
});

test('platform and region metadata use translation keys for display labels', () => {
  assert.equal(PLATFORMS.every((platform) => platform.labelKey), true);
  assert.equal(PLATFORM_REGIONS.every((region) => region.labelKey), true);
  assert.equal(PLATFORMS.some((platform) => platform.label), false);
});

test('Chinese homepage copy is localized instead of reusing English marketing text', () => {
  assert.equal(/Search players|Season stats|Ranked|Weapon mastery|Match history/i.test(translations.zh.home_subtitle), false);
  assert.equal(/Tracker|Analytics/i.test(translations.zh.home_tagline), false);
  assert.equal(/Unofficial tool|Data sourced/i.test(translations.zh.footer_unofficial), false);
});
