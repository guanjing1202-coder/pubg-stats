import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pubgApi } from '../utils/api';
import { LeaderboardSkeleton } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SelectField from '../components/common/SelectField';
import { PLATFORM_REGIONS, GAME_MODES } from '../utils/constants';
import { formatSeasonId } from '../utils/seasonLabels';
import { Link } from 'react-router-dom';
import { Medal, Trophy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LEADERBOARD_MODES = GAME_MODES.filter((m) => !m.value.includes('fpp') || m.value === 'squad-fpp');

function RankIcon({ rank }) {
  const topStyles = {
    1: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400',
    2: 'bg-gray-400/10 border-gray-400/30 text-gray-300',
    3: 'bg-amber-700/15 border-amber-600/40 text-amber-500',
  };

  if (topStyles[rank]) {
    return (
      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border ${topStyles[rank]}`}>
        <Medal size={15} />
      </span>
    );
  }

  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-pubg-border/30 text-pubg-muted font-mono text-sm">
      {rank}
    </span>
  );
}

export default function Leaderboard() {
  const [platformRegion, setPlatformRegion] = useState('pc-as');
  const [gameMode, setGameMode] = useState('squad');
  const [seasonId, setSeasonId] = useState('');
  const { t } = useLanguage();

  const platform = platformRegion.split('-')[0] === 'pc' ? 'steam' : 'xbox';
  const { data: seasonsData } = useQuery({
    queryKey: ['seasons', platform],
    queryFn: () => pubgApi.getSeasons(platform),
  });

  const seasons = seasonsData?.data || [];
  const currentSeason = seasons.find((s) => s.attributes?.isCurrentSeason);
  const effectiveSeason = seasonId || currentSeason?.id;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['leaderboard', platformRegion, effectiveSeason, gameMode],
    queryFn: () => pubgApi.getLeaderboard(platformRegion, effectiveSeason, gameMode),
    enabled: !!effectiveSeason,
  });

  const players = data?.included?.filter((i) => i.type === 'player') || [];
  const regionOptions = PLATFORM_REGIONS.map((region) => ({
    value: region.value,
    label: region.label,
  }));
  const modeOptions = LEADERBOARD_MODES.map((mode) => ({
    value: mode.value,
    label: t(mode.labelKey),
  }));
  const seasonOptions = seasons.slice(0, 8).map((season) => ({
    value: season.id,
    label: `${formatSeasonId(season.id)}${season.attributes?.isCurrentSeason ? ` (${t('season_current')})` : ''}`,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-pubg-orange/20 rounded-xl flex items-center justify-center">
          <Trophy size={20} className="text-pubg-orange" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{t('leaderboard_title')}</h1>
          <p className="text-sm text-pubg-muted">
            {t('leaderboard_subtitle')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(190px,1fr)_minmax(160px,0.8fr)_minmax(180px,0.9fr)]">
        <SelectField
          label={t('leaderboard_region')}
          value={platformRegion}
          onChange={(e) => setPlatformRegion(e.target.value)}
          options={regionOptions}
        />
        <SelectField
          label={t('leaderboard_mode')}
          value={gameMode}
          onChange={(e) => setGameMode(e.target.value)}
          options={modeOptions}
        />
        {seasons.length > 0 && (
          <SelectField
            label={t('leaderboard_season')}
            value={effectiveSeason}
            onChange={(e) => setSeasonId(e.target.value)}
            options={seasonOptions}
            className="sm:col-span-2 lg:col-span-1"
          />
        )}
      </div>

      {/* Leaderboard table */}
      {isLoading ? <LeaderboardSkeleton /> : error ? <ErrorMessage error={error} onRetry={refetch} /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className="text-xs text-pubg-muted uppercase tracking-wider border-b border-pubg-border">
                  <th className="px-4 py-3 text-left w-16">{t('leaderboard_rank')}</th>
                  <th className="px-4 py-3 text-left">{t('leaderboard_player')}</th>
                  <th className="px-4 py-3 text-center">{t('leaderboard_games')}</th>
                  <th className="px-4 py-3 text-center">{t('leaderboard_wins')}</th>
                  <th className="px-4 py-3 text-center">{t('leaderboard_kills')}</th>
                  <th className="px-4 py-3 text-center">{t('leaderboard_kda')}</th>
                  <th className="px-4 py-3 text-center">{t('leaderboard_rp')}</th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-pubg-muted">
                      <div className="sticky left-0 w-screen max-w-[calc(100vw-2rem)] text-center">
                        {t('leaderboard_no_data')}
                      </div>
                    </td>
                  </tr>
                ) : (
                  players.map((p, idx) => {
                    const attrs = p.attributes || {};
                    const stats = attrs.stats || {};
                    const rank = stats.rank || idx + 1;
                    const kda = stats.kills > 0
                      ? ((stats.kills + (stats.assists || 0) * 0.5) / Math.max(stats.deaths || 1, 1)).toFixed(2)
                      : '-';

                    return (
                      <tr key={p.id} className={`border-b border-pubg-border/50 hover:bg-pubg-card/50 transition-colors
                        ${rank <= 3 ? 'bg-yellow-500/5' : ''}`}>
                        <td className="px-4 py-3 w-16">
                          <div className="flex items-center justify-center w-8">
                            <RankIcon rank={rank} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/player/${platform}/${encodeURIComponent(attrs.name)}`}
                            className="text-white hover:text-pubg-orange transition-colors font-medium">
                            {attrs.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center text-gray-400 font-mono text-sm">{stats.gamesPlayed || '-'}</td>
                        <td className="px-4 py-3 text-center text-gray-400 font-mono text-sm">{stats.wins || '-'}</td>
                        <td className="px-4 py-3 text-center text-white font-mono text-sm font-bold">{stats.kills || '-'}</td>
                        <td className="px-4 py-3 text-center text-pubg-orange font-mono text-sm font-bold">{kda}</td>
                        <td className="px-4 py-3 text-center text-pubg-orange font-mono text-sm font-bold">{stats.rankPoints || '-'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
