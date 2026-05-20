import { User, Clock, Hash, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { getPlatformLabel, formatDateTime } from '../../utils/formatters';
import { useLanguage } from '../../contexts/LanguageContext';

const BAN_STYLES = {
  Innocent:         { style: 'bg-green-500/15 border-green-500/30 text-green-400',   Icon: ShieldCheck, key: 'ban_innocent' },
  Leaver:           { style: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400', Icon: ShieldAlert, key: 'ban_leaver' },
  Deserter:         { style: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400', Icon: ShieldAlert, key: 'ban_deserter' },
  PointsDecay:      { style: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400', Icon: ShieldAlert, key: 'ban_points_decay' },
  Team_Kill:        { style: 'bg-orange-500/15 border-orange-500/30 text-orange-400', Icon: ShieldAlert, key: 'ban_team_kill' },
  Reported:         { style: 'bg-orange-500/15 border-orange-500/30 text-orange-400', Icon: ShieldAlert, key: 'ban_reported' },
  Suspected_Hacker: { style: 'bg-red-500/15 border-red-500/30 text-red-400',          Icon: ShieldX,     key: 'ban_suspected_hacker' },
  Hacker:           { style: 'bg-red-500/15 border-red-500/30 text-red-400',          Icon: ShieldX,     key: 'ban_hacker' },
  PermanentBan:     { style: 'bg-red-500/15 border-red-500/30 text-red-400',          Icon: ShieldX,     key: 'ban_permanent' },
  Bot:              { style: 'bg-gray-500/15 border-gray-500/30 text-gray-400',       Icon: ShieldAlert, key: 'ban_bot' },
};

function BanBadge({ banType }) {
  const { t } = useLanguage();
  const cfg = BAN_STYLES[banType] || { style: 'bg-gray-500/15 border-gray-500/30 text-gray-400', Icon: ShieldAlert, key: null };
  const { style, Icon, key } = cfg;
  const label = key ? t(key) : banType;
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-semibold ${style}`}>
      <Icon size={12} />
      {t('header_account_status')}{label}
    </div>
  );
}

export default function PlayerHeader({ player, platform }) {
  const { t, lang } = useLanguage();
  const attrs = player?.data?.attributes || {};
  const id = player?.data?.id || '';

  return (
    <div className="card overflow-hidden">
      {/* Banner */}
      <div className="h-24 sm:h-32 bg-gradient-to-r from-pubg-darker via-pubg-dark to-pubg-card relative">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(245,166,35,0.1) 10px, rgba(245,166,35,0.1) 11px)' }} />
        <div className="absolute bottom-0 right-0 m-4 opacity-10">
          <User size={80} />
        </div>
      </div>

      {/* Profile info */}
      <div className="px-5 pb-5 -mt-6 relative">
        <div className="w-14 h-14 bg-pubg-orange rounded-xl flex items-center justify-center shadow-lg mb-3">
          <User size={28} className="text-black" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{attrs.name || t('header_unknown')}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-pubg-muted">
              <span className="flex items-center gap-1">
                <Hash size={12} />
                <span className="font-mono text-xs">{id.slice(0, 16)}…</span>
              </span>
              <span className="flex items-center gap-1">
                🖥️ {getPlatformLabel(platform)}
              </span>
              {attrs.updatedAt && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatDateTime(attrs.updatedAt, t, lang)}
                </span>
              )}
            </div>
          </div>
          {attrs.banType && <BanBadge banType={attrs.banType} />}
        </div>
      </div>
    </div>
  );
}
