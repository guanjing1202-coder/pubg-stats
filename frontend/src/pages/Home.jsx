import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import { pubgApi } from '../utils/api';
import { getApiStatusState } from '../utils/apiStatusState';
import { useRecentSearches, useFavorites } from '../hooks/useLocalStorage';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart3, ClipboardList, Crosshair, Server, Shield, Swords, Clock, Star, Trophy, X, ChevronRight } from 'lucide-react';

const API_STATUS_VIEW = {
  online: {
    dotClass: 'bg-green-400',
    textClass: 'text-green-300',
    labelKey: 'home_api_status_ok',
    pulse: true,
  },
  checking: {
    dotClass: 'bg-gray-500',
    textClass: 'text-pubg-muted',
    labelKey: 'home_api_status_loading',
    pulse: true,
  },
  network: {
    dotClass: 'bg-red-400',
    textClass: 'text-red-300',
    labelKey: 'home_api_status_offline',
    pulse: false,
  },
  degraded: {
    dotClass: 'bg-yellow-400',
    textClass: 'text-yellow-300',
    labelKey: 'home_api_status_degraded',
    pulse: false,
  },
};

function PlayerLink({ name, platform, onRemove, icon }) {
  const Icon = icon;
  return (
    <div className="group flex items-center gap-2 card px-3 py-2.5 hover:border-pubg-orange/50 transition-all">
      <Icon size={13} className="text-pubg-muted shrink-0" />
      <Link to={`/player/${platform}/${encodeURIComponent(name)}`}
        className="flex-1 min-w-0 flex items-center gap-2 text-sm">
        <span className="text-gray-300 hover:text-white truncate transition-colors">{name}</span>
        <span className="text-xs text-pubg-muted shrink-0">{platform}</span>
      </Link>
      <Link to={`/player/${platform}/${encodeURIComponent(name)}`}
        className="text-pubg-muted hover:text-pubg-orange transition-colors opacity-0 group-hover:opacity-100 shrink-0">
        <ChevronRight size={14} />
      </Link>
      {onRemove && (
        <button onClick={onRemove}
          className="text-pubg-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0 p-0.5">
          <X size={12} />
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const { data: status, error: statusError, isLoading: statusLoading } = useQuery({
    queryKey: ['apiStatus'],
    queryFn: pubgApi.getStatus,
    refetchInterval: 60000,
  });
  const { searches, removeSearch, clearSearches } = useRecentSearches();
  const { favorites, removeFavorite } = useFavorites();

  const apiStatus = getApiStatusState({
    status,
    error: statusError,
    isLoading: statusLoading,
  });
  const apiStatusView = API_STATUS_VIEW[apiStatus.kind] || API_STATUS_VIEW.degraded;

  const FEATURES = [
    { Icon: Crosshair, titleKey: 'home_feature_season_title', descKey: 'home_feature_season_desc' },
    { Icon: Trophy, titleKey: 'home_feature_ranked_title', descKey: 'home_feature_ranked_desc' },
    { Icon: BarChart3, titleKey: 'home_feature_lifetime_title', descKey: 'home_feature_lifetime_desc' },
    { Icon: Swords, titleKey: 'home_feature_weapons_title', descKey: 'home_feature_weapons_desc' },
    { Icon: Shield, titleKey: 'home_feature_survival_title', descKey: 'home_feature_survival_desc' },
    { Icon: ClipboardList, titleKey: 'home_feature_matches_title', descKey: 'home_feature_matches_desc' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-pubg-dark to-pubg-darker">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-pubg-orange/5 rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-600/5 rounded-full filter blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
          {/* API status */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 bg-pubg-card border border-pubg-border rounded-full text-xs mb-6 ${apiStatusView.textClass}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${apiStatusView.pulse ? 'animate-pulse' : ''} ${apiStatusView.dotClass}`} />
            <Server size={11} />
            {t(apiStatusView.labelKey)}
          </div>

          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-12 bg-pubg-orange/40" />
            <span className="text-pubg-orange text-xs font-semibold tracking-[0.3em] uppercase">by Guan Jing</span>
            <div className="h-px w-12 bg-pubg-orange/40" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-2 leading-tight">
            GJ <span className="text-pubg-orange">STATS</span>
          </h1>
          <p className="text-pubg-muted text-sm sm:text-base font-medium tracking-widest mb-3 uppercase">
            {t('home_tagline')}
          </p>
          <p className="text-gray-500 text-sm mb-10 max-w-lg mx-auto">
            {t('home_subtitle')}
          </p>

          <SearchBar large />
        </div>
      </section>

      {/* Recent + Favorites */}
      {(searches.length > 0 || favorites.length > 0) && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent searches */}
            {searches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Clock size={14} className="text-pubg-muted" /> {t('home_recent_searches')}
                  </h3>
                  <button onClick={clearSearches} className="text-xs text-pubg-muted hover:text-red-400 transition-colors">
                    {t('home_clear')}
                  </button>
                </div>
                <div className="space-y-1.5">
                  {searches.slice(0, 5).map((s) => (
                    <PlayerLink key={`${s.platform}-${s.name}`} name={s.name} platform={s.platform}
                      onRemove={() => removeSearch(s.name, s.platform)} icon={Clock} />
                  ))}
                </div>
              </div>
            )}

            {/* Favorites */}
            {favorites.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Star size={14} className="text-yellow-400" /> {t('home_favorites')}
                  </h3>
                </div>
                <div className="space-y-1.5">
                  {favorites.slice(0, 5).map((f) => (
                    <PlayerLink key={`${f.platform}-${f.name}`} name={f.name} platform={f.platform}
                      onRemove={() => removeFavorite(f.name, f.platform)} icon={Star} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 border-t border-pubg-border/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{t('home_full_data')}</h2>
          <p className="text-pubg-muted text-sm">{t('home_full_data_sub')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ Icon, ...f }) => (
            <div key={f.titleKey} className="card p-5 hover:border-pubg-orange/40 transition-all group">
              <div className="w-10 h-10 rounded-lg border border-pubg-orange/20 bg-pubg-orange/10 flex items-center justify-center mb-3 group-hover:border-pubg-orange/40 transition-colors">
                <Icon size={20} className="text-pubg-orange" />
              </div>
              <h3 className="font-semibold text-white mb-1 group-hover:text-pubg-orange transition-colors">{t(f.titleKey)}</h3>
              <p className="text-sm text-pubg-muted">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-t border-pubg-border bg-pubg-dark/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-wrap justify-center gap-8 sm:gap-16 text-center">
          {[
            { val: '8+', labelKey: 'home_stat_maps' },
            { val: '6', labelKey: 'home_stat_modes' },
            { val: '32', labelKey: 'home_stat_matches' },
            { val: 'Top500', labelKey: 'home_stat_global' },
          ].map((s) => (
            <div key={s.labelKey}>
              <div className="text-2xl font-black text-pubg-orange font-mono">{s.val}</div>
              <div className="text-xs text-pubg-muted mt-0.5">{t(s.labelKey)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
