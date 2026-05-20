import { Suspense, lazy, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { pubgApi } from '../utils/api';
import { useFavorites, useRecentSearches } from '../hooks/useLocalStorage';
import { useLanguage } from '../contexts/LanguageContext';
import { Star } from 'lucide-react';
import PlayerHeader from '../components/player/PlayerHeader';
import SeasonStats from '../components/player/SeasonStats';
import RankedStats from '../components/player/RankedStats';
import MatchHistory from '../components/player/MatchHistory';
import WeaponMastery from '../components/weapon/WeaponMastery';
import SurvivalMastery from '../components/player/SurvivalMastery';
import { PageLoader } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const LifetimeStats = lazy(() => import('../components/player/LifetimeStats'));
const SeasonTrend = lazy(() => import('../components/player/SeasonTrend'));

const TAB_KEYS = [
  { key: 'season', labelKey: 'player_tab_season' },
  { key: 'ranked', labelKey: 'player_tab_ranked' },
  { key: 'lifetime', labelKey: 'player_tab_lifetime' },
  { key: 'matches', labelKey: 'player_tab_matches' },
  { key: 'weapons', labelKey: 'player_tab_weapons' },
  { key: 'survival', labelKey: 'player_tab_survival' },
];

export default function Player() {
  const { platform, playerName } = useParams();
  const [tab, setTab] = useState('season');
  const [selectedSeason, setSelectedSeason] = useState(null);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { addSearch } = useRecentSearches();
  const { t } = useLanguage();

  // Fetch player
  const { data: playerData, isLoading: playerLoading, error: playerError, refetch } = useQuery({
    queryKey: ['player', platform, playerName],
    queryFn: () => pubgApi.searchPlayer(platform, decodeURIComponent(playerName)),
  });

  // Fetch seasons
  const { data: seasonsData } = useQuery({
    queryKey: ['seasons', platform],
    queryFn: () => pubgApi.getSeasons(platform),
  });

  const player = playerData?.data?.[0] ? { data: playerData.data[0] } : null;
  const playerId = player?.data?.id;
  const resolvedName = player?.data?.attributes?.name || decodeURIComponent(playerName);

  // Record search history once player loads
  useEffect(() => {
    if (resolvedName) addSearch(resolvedName, platform);
  }, [resolvedName, platform]);

  const favorited = isFavorite(resolvedName, platform);
  const toggleFavorite = () => favorited
    ? removeFavorite(resolvedName, platform)
    : addFavorite(resolvedName, platform);

  const seasons = (seasonsData?.data || []).filter(
    (s) => !s.attributes?.isOffseason
  );
  const currentSeason = seasons.find((s) => s.attributes?.isCurrentSeason);
  const effectiveSeason = selectedSeason || currentSeason?.id;

  if (playerLoading) return <PageLoader />;
  if (playerError || !player) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <ErrorMessage
          error={playerError || new Error(`${t('player_not_found')} "${playerName}"，${t('player_not_found_hint')}`)}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5 animate-fade-in">
      {/* Player header */}
      <div className="relative">
        <PlayerHeader player={player} platform={platform} />
        <button
          onClick={toggleFavorite}
          title={favorited ? t('player_favorite_remove') : t('player_favorite_add')}
          className={`absolute top-3 right-3 p-2 rounded-lg border transition-all
            ${favorited
              ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
              : 'bg-pubg-card/80 border-pubg-border text-pubg-muted hover:text-yellow-400 hover:border-yellow-500/40'}`}>
          <Star size={16} fill={favorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Season selector (for season/ranked tabs) */}
      {(tab === 'season' || tab === 'ranked') && seasons.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-pubg-muted">{t('player_season_label')}</span>
          <div className="flex items-center gap-1 flex-wrap">
            {seasons.slice(0, 10).map((s) => {
              const isCurrent = s.attributes?.isCurrentSeason;
              const isSelected = effectiveSeason === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeason(s.id)}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${isSelected ? 'bg-pubg-orange text-black font-semibold' : 'bg-pubg-card border border-pubg-border text-gray-400 hover:text-white'}`}
                >
                  {s.id.replace('division.bro.official.', '').replace('pc-2018-', 'S').replace('console-2018-', 'S')}
                  {isCurrent && ' ★'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card overflow-hidden">
        <div className="flex items-center overflow-x-auto border-b border-pubg-border px-4 pt-4 gap-1">
          {TAB_KEYS.map((tk) => (
            <button key={tk.key} onClick={() => setTab(tk.key)}
              className={`tab-btn ${tab === tk.key ? 'active' : ''}`}>
              {t(tk.labelKey)}
            </button>
          ))}
        </div>
        <div className="p-4 sm:p-5">
          {tab === 'season' && <SeasonStats platform={platform} playerId={playerId} seasonId={effectiveSeason} />}
          {tab === 'ranked' && <RankedStats platform={platform} playerId={playerId} seasonId={effectiveSeason} />}
          {tab === 'lifetime' && (
            <Suspense fallback={<PageLoader />}>
              <div className="space-y-5">
                {seasons.length >= 2 && (
                  <SeasonTrend platform={platform} playerId={playerId} seasons={seasons} />
                )}
                <LifetimeStats platform={platform} playerId={playerId} />
              </div>
            </Suspense>
          )}
          {tab === 'matches' && <MatchHistory player={player} platform={platform} />}
          {tab === 'weapons' && <WeaponMastery platform={platform} playerId={playerId} />}
          {tab === 'survival' && <SurvivalMastery platform={platform} playerId={playerId} />}
        </div>
      </div>
    </div>
  );
}
