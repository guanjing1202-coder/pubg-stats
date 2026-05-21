import { Link } from 'react-router-dom';
import { ChevronRight, Trophy, Target, Zap, Clock, User, Gamepad2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { pubgApi } from '../../utils/api';
import { getMapName, formatDateTime } from '../../utils/formatters';
import Badge from '../common/Badge';
import { useLanguage } from '../../contexts/LanguageContext';

const GAME_MODE_LABEL_KEYS = {
  'squad': 'mode_squad', 'squad-fpp': 'mode_squad_fpp',
  'duo': 'mode_duo', 'duo-fpp': 'mode_duo_fpp',
  'solo': 'mode_solo', 'solo-fpp': 'mode_solo_fpp',
};

function MatchRow({ matchId, platform, playerId, playerName }) {
  const { t, lang } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: ['match', platform, matchId],
    queryFn: () => pubgApi.getMatch(platform, matchId),
    staleTime: 30 * 60 * 1000,
  });

  if (isLoading) {
    return <div className="skeleton h-[72px] rounded-xl" />;
  }

  if (!data) return null;

  const match = data.data;
  const attrs = match?.attributes || {};
  const included = data.included || [];

  // Match by playerId first (more reliable), fall back to name
  const participant = included.find(
    (inc) =>
      inc.type === 'participant' &&
      (inc.attributes?.stats?.playerId === playerId ||
       inc.attributes?.stats?.name === playerName)
  );

  // participant not found in this match (observer, spectator, etc.)
  if (!participant) {
    return (
      <div className="card flex items-center gap-3 px-4 py-3 opacity-50">
        <User size={16} className="text-pubg-muted" />
        <span className="text-sm text-pubg-muted flex-1">Match {matchId.slice(0,8)}…</span>
        <Badge variant="default">{t('match_unavailable')}</Badge>
      </div>
    );
  }

  const pStats = participant.attributes.stats;
  const isWin = pStats.winPlace === 1;
  const isTop10 = typeof pStats.winPlace === 'number' && pStats.winPlace > 0 && pStats.winPlace <= 10;
  const duration = Math.round((attrs.duration || 0) / 60);
  const kills = pStats.kills || 0;
  const damage = Math.round(pStats.damageDealt || 0);
  const assists = pStats.assists || 0;
  const dbnos = pStats.DBNOs ?? 0;
  const placement = pStats.winPlace;
  const modeLabelKey = GAME_MODE_LABEL_KEYS[attrs.gameMode];
  const modeLabel = modeLabelKey ? t(modeLabelKey) : (attrs.gameMode || '');

  return (
    <Link
      to={`/match/${platform}/${matchId}`}
      state={{ playerName, from: window.location.pathname }}
      className={`card flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:border-pubg-orange/50 transition-all group
        ${isWin ? 'border-yellow-500/30 bg-yellow-500/5' : isTop10 ? 'border-green-500/20 bg-green-500/3' : ''}`}
    >
      {/* Placement badge */}
      <div className={`shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-center
        ${isWin ? 'bg-yellow-500/20 text-yellow-400' : isTop10 ? 'bg-green-500/20 text-green-400' : 'bg-pubg-border/40 text-gray-500'}`}>
        {placement != null ? (
          <>
            <span className="text-xl leading-tight">#{placement}</span>
            {isWin && <span className="text-[9px] leading-none font-bold mt-0.5">{t('match_winner')}</span>}
          </>
        ) : (
          <User size={20} />
        )}
      </div>

      {/* Map info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-white truncate">{getMapName(attrs.mapName)}</span>
          {modeLabel && <Badge variant="default">{modeLabel}</Badge>}
          {isWin && <Badge variant="win">{t('badge_win')}</Badge>}
          {!isWin && isTop10 && <Badge variant="top10">{t('badge_top10')}</Badge>}
        </div>
        <div className="text-xs text-pubg-muted mt-0.5">{formatDateTime(attrs.createdAt, t, lang)}</div>
      </div>

      {/* Desktop stats */}
      <div className="hidden sm:flex items-center gap-5 shrink-0">
        <div className="text-center min-w-[36px]">
          <div className="flex items-center justify-center gap-1 font-bold font-mono text-white">
            <Target size={11} className="text-pubg-orange" />
            {kills}
          </div>
          <div className="text-xs text-pubg-muted">{t('match_kills')}</div>
        </div>
        {assists > 0 && (
          <div className="text-center min-w-[36px]">
            <div className="font-bold font-mono text-gray-400">{assists}</div>
            <div className="text-xs text-pubg-muted">{t('match_assists')}</div>
          </div>
        )}
        {dbnos > 0 && (
          <div className="text-center min-w-[36px]">
            <div className="font-bold font-mono text-gray-400">{dbnos}</div>
            <div className="text-xs text-pubg-muted">{t('match_knocks')}</div>
          </div>
        )}
        <div className="text-center min-w-[48px]">
          <div className="flex items-center justify-center gap-1 font-bold font-mono text-white">
            <Zap size={11} className="text-blue-400" />
            {damage}
          </div>
          <div className="text-xs text-pubg-muted">{t('match_damage')}</div>
        </div>
        <div className="text-center min-w-[36px]">
          <div className="flex items-center justify-center gap-1 font-mono text-gray-400 text-sm">
            <Clock size={11} />
            {duration}m
          </div>
          <div className="text-xs text-pubg-muted">{t('match_duration')}</div>
        </div>
      </div>

      {/* Mobile stats */}
      <div className="sm:hidden shrink-0 text-right">
        <div className="text-white font-bold font-mono text-sm">{kills}K {assists > 0 ? `${assists}A` : ''}</div>
        <div className="text-xs text-pubg-muted">{damage} dmg</div>
      </div>

      <ChevronRight size={16} className="text-pubg-border group-hover:text-pubg-orange transition-colors shrink-0" />
    </Link>
  );
}

export default function MatchHistory({ player, platform }) {
  const { t } = useLanguage();
  const matches = player?.data?.relationships?.matches?.data || [];
  const playerName = player?.data?.attributes?.name;
  const playerId = player?.data?.id; // account.xxxx — used for reliable matching

  if (matches.length === 0) {
    return (
      <div className="text-center py-16 text-pubg-muted">
        <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-pubg-border/30 border border-pubg-border flex items-center justify-center">
          <Gamepad2 size={30} className="text-pubg-muted" />
        </div>
        <p className="font-medium text-gray-400 mb-1">{t('match_history_empty')}</p>
        <p className="text-sm">{t('match_history_empty_sub')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-fade-in">
      <p className="text-xs text-pubg-muted mb-3">
        {t('match_history_count', matches.length)}
      </p>
      {matches.map((m) => (
        <MatchRow
          key={m.id}
          matchId={m.id}
          platform={platform}
          playerId={playerId}
          playerName={playerName}
        />
      ))}
    </div>
  );
}
