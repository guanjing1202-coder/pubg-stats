import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pubgApi } from '../../utils/api';
import { MatchDetailSkeleton } from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { getMapName, formatDateTime, formatTime } from '../../utils/formatters';
import Badge from '../common/Badge';
import { Trophy, Users, Clock, Map, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import TelemetryReport from './TelemetryReport';
import { getTelemetryAssetUrl } from '../../utils/telemetry';

const SORT_FIELDS = [
  { key: 'winPlace', labelKey: 'match_rank' },
  { key: 'kills', labelKey: 'match_kills' },
  { key: 'damageDealt', labelKey: 'match_damage' },
  { key: 'assists', labelKey: 'match_assists' },
  { key: 'headshotKills', labelKey: 'match_headshots' },
  { key: 'longestKill', labelKey: 'match_longest' },
  { key: 'timeSurvived', labelKey: 'match_survived' },
];

function ParticipantRow({ p, isHighlight }) {
  const { t } = useLanguage();
  const s = p.attributes?.stats || {};
  const isWin = s.winPlace === 1;

  return (
    <tr className={`border-b border-pubg-border hover:bg-pubg-card/50 transition-colors text-sm
      ${isHighlight ? 'bg-pubg-orange/10 border-pubg-orange/20' : ''}
      ${isWin ? 'bg-yellow-500/5' : ''}`}>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className={`font-bold w-6 text-center ${isWin ? 'text-yellow-400' : 'text-gray-400'}`}>
            #{s.winPlace || '?'}
          </span>
          <div>
            <span className={`font-medium ${isHighlight ? 'text-pubg-orange' : 'text-white'}`}>{s.name}</span>
            {isHighlight && <span className="ml-1 text-xs text-pubg-orange">{t('match_you')}</span>}
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5 text-center font-bold font-mono text-white">{s.kills || 0}</td>
      <td className="px-3 py-2.5 text-center font-mono text-gray-300">{Math.round(s.damageDealt || 0)}</td>
      <td className="px-3 py-2.5 text-center text-gray-400">{s.assists || 0}</td>
      <td className="px-3 py-2.5 text-center text-gray-400">{s.headshotKills || 0}</td>
      <td className="px-3 py-2.5 text-center text-gray-400">{Math.round(s.longestKill || 0)}m</td>
      <td className="px-3 py-2.5 text-center text-gray-400">{formatTime(s.timeSurvived || 0)}</td>
      <td className="px-3 py-2.5 text-center text-gray-400">{s.revives || 0}</td>
    </tr>
  );
}

function TeamSection({ roster, participants, highlightName }) {
  const [expanded, setExpanded] = useState(true);
  const { t } = useLanguage();
  const rosterParticipantIds = roster?.relationships?.participants?.data?.map((p) => p.id) || [];
  const members = participants.filter((p) => rosterParticipantIds.includes(p.id));
  const rosterStats = roster?.attributes?.stats || {};
  const isWin = rosterStats.rank === 1;

  return (
    <div className={`card overflow-hidden mb-2 ${isWin ? 'border-yellow-500/30' : ''}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-pubg-card/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`font-bold text-lg ${isWin ? 'text-yellow-400' : 'text-gray-400'}`}>
            #{rosterStats.rank || '?'}
          </span>
          <span className="text-sm text-gray-300">{members.map((m) => m.attributes?.stats?.name).join(', ')}</span>
          {isWin && <Badge variant="win">WINNER WINNER</Badge>}
        </div>
        {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {expanded && (
        <div className="overflow-x-auto border-t border-pubg-border">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-xs text-pubg-muted uppercase tracking-wider border-b border-pubg-border">
                <th className="px-3 py-2 text-left">{t('match_player')}</th>
                <th className="px-3 py-2">{t('match_kills')}</th>
                <th className="px-3 py-2">{t('match_damage')}</th>
                <th className="px-3 py-2">{t('match_assists')}</th>
                <th className="px-3 py-2">{t('match_headshots')}</th>
                <th className="px-3 py-2">{t('match_longest')}</th>
                <th className="px-3 py-2">{t('match_survived')}</th>
                <th className="px-3 py-2">{t('match_revives')}</th>
              </tr>
            </thead>
            <tbody>
              {members.map((p) => (
                <ParticipantRow
                  key={p.id}
                  p={p}
                  isHighlight={p.attributes?.stats?.name === highlightName}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function MatchDetail({ platform, matchId, highlightPlayerName }) {
  const [viewMode, setViewMode] = useState('teams'); // 'teams' | 'all'
  const [sortField, setSortField] = useState('winPlace');
  const [sortAsc, setSortAsc] = useState(true);
  const { t, lang } = useLanguage();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['match', platform, matchId],
    queryFn: () => pubgApi.getMatch(platform, matchId),
  });

  if (isLoading) return <MatchDetailSkeleton />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  const match = data?.data;
  const attrs = match?.attributes || {};
  const included = data?.included || [];
  const participants = included.filter((i) => i.type === 'participant');
  const rosters = included.filter((i) => i.type === 'roster');
  const duration = Math.round((attrs.duration || 0) / 60);
  const telemetryUrl = getTelemetryAssetUrl(included);

  const sortedAll = [...participants].sort((a, b) => {
    const aV = a.attributes?.stats?.[sortField] ?? 0;
    const bV = b.attributes?.stats?.[sortField] ?? 0;
    return sortAsc ? aV - bV : bV - aV;
  });

  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(field === 'winPlace'); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Match header */}
      <div className="card p-5">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{getMapName(attrs.mapName)}</h2>
            <div className="text-sm text-pubg-muted mt-0.5">{formatDateTime(attrs.createdAt, t, lang)}</div>
          </div>
          <Badge variant="default">{attrs.gameMode}</Badge>
          {attrs.isCustomMatch && <Badge variant="orange">{t('match_custom')}</Badge>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Map size={14} className="text-pubg-orange" />
            <span className="text-pubg-muted">{t('match_map')}</span>
            <span className="text-white font-medium">{getMapName(attrs.mapName)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users size={14} className="text-pubg-orange" />
            <span className="text-pubg-muted">{t('match_participants')}</span>
            <span className="text-white font-medium">{t('match_people', participants.length)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={14} className="text-pubg-orange" />
            <span className="text-pubg-muted">{t('match_duration')}</span>
            <span className="text-white font-medium">{t('match_minutes', duration)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Trophy size={14} className="text-pubg-orange" />
            <span className="text-pubg-muted">{t('match_teams')}</span>
            <span className="text-white font-medium">{t('match_team_count', rosters.length)}</span>
          </div>
        </div>
      </div>

      <TelemetryReport
        telemetryUrl={telemetryUrl}
        matchStart={attrs.createdAt}
        highlightPlayerName={highlightPlayerName}
      />

      {/* View toggle */}
      <div className="flex items-center gap-2 border-b border-pubg-border pb-3">
        <button onClick={() => setViewMode('teams')}
          className={`tab-btn ${viewMode === 'teams' ? 'active' : ''}`}>{t('match_teams_view')}</button>
        <button onClick={() => setViewMode('all')}
          className={`tab-btn ${viewMode === 'all' ? 'active' : ''}`}>{t('match_all_players')}</button>
      </div>

      {/* Teams view */}
      {viewMode === 'teams' && (
        <div>
          {rosters
            .sort((a, b) => (a.attributes?.stats?.rank || 99) - (b.attributes?.stats?.rank || 99))
            .map((r) => (
              <TeamSection key={r.id} roster={r} participants={participants} highlightName={highlightPlayerName} />
            ))}
        </div>
      )}

      {/* All players view */}
      {viewMode === 'all' && (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-xs text-pubg-muted uppercase tracking-wider border-b border-pubg-border">
                {SORT_FIELDS.map((f) => (
                  <th key={f.key}
                    onClick={() => handleSort(f.key)}
                    className="px-3 py-3 cursor-pointer hover:text-white transition-colors select-none">
                    <div className="flex items-center gap-1 justify-center">
                      {t(f.labelKey)}
                      {sortField === f.key && (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                    </div>
                  </th>
                ))}
                <th className="px-3 py-3">{t('match_revives')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedAll.map((p) => (
                <ParticipantRow key={p.id} p={p} isHighlight={p.attributes?.stats?.name === highlightPlayerName} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
