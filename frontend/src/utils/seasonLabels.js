export function formatSeasonId(seasonId) {
  if (!seasonId) return '';

  return seasonId
    .replace('division.bro.official.', '')
    .replace('pc-2018-', 'S')
    .replace('console-2018-', 'S');
}
