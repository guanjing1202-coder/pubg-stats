import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Crosshair, Shield, Skull, Swords } from 'lucide-react';
import { pubgApi } from '../../utils/api';
import { analyzeTelemetry, formatTelemetryTime } from '../../utils/telemetry';
import { formatNumber } from '../../utils/formatters';
import ErrorMessage from '../common/ErrorMessage';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useLanguage } from '../../contexts/LanguageContext';

function StatPill({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-pubg-border/70 bg-pubg-border/20 p-3">
      <div className="flex items-center gap-2 text-xs text-pubg-muted uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="text-xl font-bold text-white font-mono mt-1">{value}</div>
    </div>
  );
}

function DamageRows({ rows, tone = 'orange' }) {
  const { t } = useLanguage();

  if (rows.length === 0) {
    return <div className="text-sm text-pubg-muted">{t('telemetry_no_data')}</div>;
  }

  const valueClass = tone === 'red' ? 'text-red-300' : tone === 'blue' ? 'text-sky-300' : 'text-pubg-orange';

  return (
    <div className="space-y-2">
      {rows.slice(0, 5).map((row) => (
        <div key={row.name} className="flex items-center justify-between gap-3 text-sm">
          <span className="text-gray-300 truncate">{row.name}</span>
          <span className={`${valueClass} font-mono font-bold`}>{formatNumber(row.value)}</span>
        </div>
      ))}
    </div>
  );
}

function AnalysisCard({ title, children }) {
  return (
    <div className="rounded-lg border border-pubg-border/70 bg-pubg-border/20 p-4 min-h-[148px]">
      <h4 className="text-sm font-semibold text-white mb-3">{title}</h4>
      {children}
    </div>
  );
}

function renderHighlightEvent(event, t) {
  if (event.type === 'revive') {
    return t('telemetry_event_revive', event.reviver || '-', event.victim || '-');
  }
  if (event.type === 'groggy') {
    return t('telemetry_event_groggy', event.attacker || '-', event.victim || '-');
  }
  return t('telemetry_event_kill', event.killer || '-', event.victim || '-', event.weapon || '-');
}

export default function TelemetryReport({ telemetryUrl, matchStart, highlightPlayerName }) {
  const [enabled, setEnabled] = useState(false);
  const { t } = useLanguage();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['telemetry', telemetryUrl],
    queryFn: () => pubgApi.getTelemetry(telemetryUrl),
    enabled: enabled && !!telemetryUrl,
    staleTime: 60 * 60 * 1000,
  });

  if (!telemetryUrl) {
    return null;
  }

  const report = data ? analyzeTelemetry(data, { matchStart, highlightPlayerName }) : null;

  return (
    <section className="card p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity size={15} className="text-pubg-orange" />
            {t('telemetry_title')}
          </h3>
          <p className="text-xs text-pubg-muted mt-1">{t('telemetry_subtitle')}</p>
        </div>
        {!enabled && (
          <button type="button" onClick={() => setEnabled(true)} className="btn-primary text-sm">
            {t('telemetry_load')}
          </button>
        )}
      </div>

      {enabled && isLoading && (
        <div className="py-10 flex flex-col items-center gap-3 text-pubg-muted text-sm">
          <LoadingSpinner />
          {t('telemetry_loading')}
        </div>
      )}

      {enabled && error && <ErrorMessage error={error} onRetry={refetch} />}

      {report && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatPill icon={<Swords size={13} />} label={t('telemetry_events')} value={formatNumber(report.totalEvents)} />
            <StatPill icon={<Skull size={13} />} label={t('telemetry_kills')} value={formatNumber(report.totalKills)} />
            <StatPill icon={<Crosshair size={13} />} label={t('telemetry_damage')} value={formatNumber(report.totalDamage)} />
            <StatPill icon={<Shield size={13} />} label={t('telemetry_phases')} value={formatNumber(report.phases.length)} />
          </div>

          {report.highlight && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                ['telemetry_highlight_kills', report.highlight.kills],
                ['telemetry_highlight_deaths', report.highlight.deaths],
                ['telemetry_highlight_damage_dealt', report.highlight.damageDealt],
                ['telemetry_highlight_damage_taken', report.highlight.damageTaken],
                ['telemetry_highlight_knocks', report.highlight.knocks],
                ['telemetry_highlight_revives', report.highlight.revives],
              ].map(([key, value]) => (
                <div key={key} className="bg-pubg-border/30 rounded-lg px-3 py-2">
                  <div className="text-xs text-pubg-muted">{t(key)}</div>
                  <div className="text-white font-mono font-bold">{formatNumber(value)}</div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <AnalysisCard title={t('telemetry_top_damage')}>
              <DamageRows rows={report.topDamage} />
            </AnalysisCard>
            <AnalysisCard title={t('telemetry_top_damage_taken')}>
              <DamageRows rows={report.topDamageTaken} tone="red" />
            </AnalysisCard>
            <AnalysisCard title={t('telemetry_damage_sources')}>
              <DamageRows rows={report.topDamageCausers} tone="blue" />
            </AnalysisCard>
            <AnalysisCard title={t('telemetry_damage_types')}>
              <DamageRows rows={report.topDamageCategories} />
            </AnalysisCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AnalysisCard title={t('telemetry_kill_timeline')}>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {report.kills.length === 0 ? (
                  <div className="text-sm text-pubg-muted">{t('telemetry_no_data')}</div>
                ) : (
                  report.kills.slice(0, 12).map((event, index) => (
                    <div key={`${event.time}-${event.victim}-${index}`} className="flex items-start gap-3 text-sm">
                      <span className="font-mono text-pubg-orange w-12 shrink-0">{formatTelemetryTime(event.time)}</span>
                      <span className="text-gray-300">
                        {t('telemetry_event_kill', event.killer || '-', event.victim || '-', event.weapon || '-')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </AnalysisCard>
          </div>

          {report.highlightEvents.length > 0 && (
            <div className="card p-4">
              <h4 className="text-sm font-semibold text-white mb-3">{t('telemetry_highlight_timeline', highlightPlayerName)}</h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {report.highlightEvents.slice(0, 16).map((event, index) => (
                  <div key={`${event.type}-${event.time}-${index}`} className="flex items-start gap-3 text-sm">
                    <span className="font-mono text-pubg-orange w-12 shrink-0">{formatTelemetryTime(event.time)}</span>
                    <span className="text-gray-300">{renderHighlightEvent(event, t)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
