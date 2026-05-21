import { useQuery } from '@tanstack/react-query';
import { pubgApi } from '../../utils/api';
import { WeaponMasterySkeleton } from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { formatNumber } from '../../utils/formatters';
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Swords } from 'lucide-react';

// Map internal weapon IDs to display names
const WEAPON_NAMES = {
  Item_Weapon_ACE32_C: 'ACE32',
  Item_Weapon_AK47_C: 'AKM',
  Item_Weapon_AUG_C: 'AUG A3',
  Item_Weapon_AWM_C: 'AWM',
  Item_Weapon_Berreta686_C: 'S686',
  Item_Weapon_BerylM762_C: 'Beryl M762',
  Item_Weapon_BizonPP19_C: 'PP-19 Bizon',
  Item_Weapon_DP12_C: 'DBS',
  Item_Weapon_DP28_C: 'DP-28',
  Item_Weapon_FNFal_C: 'SLR',
  Item_Weapon_G18_C: 'P18C',
  Item_Weapon_G36C_C: 'G36C',
  Item_Weapon_Groza_C: 'Groza',
  Item_Weapon_HK416_C: 'M416',
  Item_Weapon_Kar98k_C: 'Kar98k',
  Item_Weapon_L6_C: 'Lynx AMR',
  Item_Weapon_M16A4_C: 'M16A4',
  Item_Weapon_M1911_C: 'P1911',
  Item_Weapon_M249_C: 'M249',
  Item_Weapon_M24_C: 'M24',
  Item_Weapon_M9_C: 'P92',
  Item_Weapon_Mk12_C: 'Mk12',
  Item_Weapon_Mk14_C: 'Mk14 EBR',
  Item_Weapon_Mk47Mutant_C: 'Mk47 Mutant',
  Item_Weapon_MP5K_C: 'MP5K',
  Item_Weapon_MP9_C: 'MP9',
  Item_Weapon_MicroUZI_C: 'Micro UZI',
  Item_Weapon_Mosin_C: 'Mosin-Nagant',
  Item_Weapon_NagantM1895_C: 'R1895',
  Item_Weapon_P90_C: 'P90',
  Item_Weapon_Pan_C: 'Pan',
  Item_Weapon_QBU88_C: 'QBU',
  Item_Weapon_QBZ95_C: 'QBZ95',
  Item_Weapon_Rhino_C: 'Deagle',
  Item_Weapon_SCAR_L_C: 'SCAR-L',
  Item_Weapon_SKS_C: 'SKS',
  Item_Weapon_SRS_C: 'Mk13 Mortar',
  Item_Weapon_Saiga12_C: 'S12K',
  Item_Weapon_Tommy_C: 'Tommy Gun',
  Item_Weapon_UMP_C: 'UMP45',
  Item_Weapon_UrbanRifle_C: 'G36C',
  Item_Weapon_Vector_C: 'Vector',
  Item_Weapon_VSS_C: 'VSS',
  Item_Weapon_Win94_C: 'Win94',
  Item_Weapon_Winchester_C: 'S1897',
  Item_Weapon_DesertEagle_C: 'Deagle',
};

function getWeaponName(id) {
  if (WEAPON_NAMES[id]) return WEAPON_NAMES[id];
  // Fallback: strip prefix/suffix
  return id
    .replace(/^Item_Weapon_/, '')
    .replace(/_C$/, '')
    .replace(/_/g, ' ');
}

const SORT_OPTIONS = [
  { value: 'kills', labelKey: 'weapon_kills' },
  { value: 'headShots', labelKey: 'weapon_headshots' },
  { value: 'damage', labelKey: 'weapon_damage' },
  { value: 'xp', labelKey: 'weapon_xp' },
  { value: 'longestKill', labelKey: 'weapon_longest' },
];

// Tier color
const TIER_COLORS = ['text-gray-400', 'text-amber-700', 'text-gray-300', 'text-yellow-400', 'text-cyan-400', 'text-pubg-orange'];

function WeaponCard({ weapon }) {
  const { t } = useLanguage();
  const hsRate = weapon.kills > 0 ? ((weapon.headShots / weapon.kills) * 100).toFixed(1) : '0';
  const tierColor = TIER_COLORS[weapon.tier] || 'text-gray-400';

  return (
    <div className="card p-4 hover:border-pubg-orange/40 transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <h4 className="font-semibold text-white text-sm truncate">{weapon.name}</h4>
          <div className="text-xs text-pubg-muted mt-0.5">
            {formatNumber(weapon.xp)} XP
          </div>
        </div>
        <div className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded bg-pubg-border/50 ${tierColor}`}>
          Lv.{weapon.level}
        </div>
      </div>

      {/* XP Progress */}
      <div className="w-full h-1 bg-pubg-border rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-pubg-orange rounded-full transition-all"
          style={{ width: `${Math.min((weapon.xp % 5000) / 50, 100)}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-1 text-center">
        <div>
          <div className="text-white font-bold font-mono text-sm">{formatNumber(weapon.kills)}</div>
          <div className="text-xs text-pubg-muted">{t('weapon_kills')}</div>
        </div>
        <div>
          <div className="text-white font-bold font-mono text-sm">{hsRate}%</div>
          <div className="text-xs text-pubg-muted">{t('weapon_hs_rate')}</div>
        </div>
        <div>
          <div className="text-white font-bold font-mono text-sm">{Math.round(weapon.longestKill)}m</div>
          <div className="text-xs text-pubg-muted">{t('weapon_longest_kill')}</div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-pubg-border/50 grid grid-cols-2 gap-1 text-center">
        <div>
          <div className="text-gray-400 font-mono text-xs">{formatNumber(weapon.headShots)}</div>
          <div className="text-xs text-pubg-muted">{t('weapon_headshots_count')}</div>
        </div>
        <div>
          <div className="text-gray-400 font-mono text-xs">{weapon.mostKills}</div>
          <div className="text-xs text-pubg-muted">{t('weapon_most_kills')}</div>
        </div>
      </div>
    </div>
  );
}

export default function WeaponMastery({ platform, playerId }) {
  const [sortBy, setSortBy] = useState('kills');
  const [showAll, setShowAll] = useState(false);
  const { t } = useLanguage();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['weaponMastery', platform, playerId],
    queryFn: () => pubgApi.getWeaponMastery(platform, playerId),
  });

  if (isLoading) return <WeaponMasterySkeleton />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;

  // Real API structure: data.attributes.weaponSummaries is a dictionary
  const weaponSummaries = data?.data?.attributes?.weaponSummaries || {};

  const weaponList = Object.entries(weaponSummaries)
    .map(([id, w]) => {
      // Prefer OfficialStatsTotal (official matches) over StatsTotal
      const s = (w.OfficialStatsTotal?.Kills > 0 ? w.OfficialStatsTotal : null)
             || w.StatsTotal
             || {};
      return {
        id,
        name: getWeaponName(id),
        level: w.LevelCurrent || 0,
        tier: w.TierCurrent || 0,
        xp: w.XPTotal || 0,
        kills: s.Kills || 0,
        headShots: s.HeadShots || 0,
        damage: s.DamagePlayer || 0,
        longestKill: s.LongestKill || s.LongestDefeat || 0,
        mostKills: s.MostKillsInAGame || s.MostDefeatsInAGame || 0,
        groggies: s.Groggies || 0,
      };
    })
    .filter((w) => w.kills > 0 || w.xp > 0)
    .sort((a, b) => {
      switch (sortBy) {
        case 'headShots': return b.headShots - a.headShots;
        case 'damage':    return b.damage - a.damage;
        case 'xp':        return b.xp - a.xp;
        case 'longestKill': return b.longestKill - a.longestKill;
        default:          return b.kills - a.kills;
      }
    });

  const displayed = showAll ? weaponList : weaponList.slice(0, 12);
  const totalKills = weaponList.reduce((s, w) => s + w.kills, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Summary bar */}
      {weaponList.length > 0 && (
        <div className="card p-4 flex flex-wrap gap-6">
          <div>
            <div className="text-xl font-bold text-white font-mono">{weaponList.length}</div>
            <div className="text-xs text-pubg-muted">{t('weapon_mastered')}</div>
          </div>
          <div>
            <div className="text-xl font-bold text-pubg-orange font-mono">{formatNumber(totalKills)}</div>
            <div className="text-xs text-pubg-muted">{t('weapon_total_kills')}</div>
          </div>
          <div>
            <div className="text-xl font-bold text-white font-mono">
              {weaponList[0]?.name || '-'}
            </div>
            <div className="text-xs text-pubg-muted">{t('weapon_favorite')}</div>
          </div>
        </div>
      )}

      {/* Sort controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-pubg-muted">{t('weapon_record_count', weaponList.length)}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-pubg-muted">{t('weapon_sort')}</span>
          {SORT_OPTIONS.map((s) => (
            <button key={s.value} onClick={() => setSortBy(s.value)}
              className={`text-xs px-2.5 py-1 rounded transition-colors ${sortBy === s.value ? 'bg-pubg-orange text-black font-semibold' : 'bg-pubg-border text-gray-400 hover:text-white'}`}>
              {t(s.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {weaponList.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {displayed.map((w) => <WeaponCard key={w.id} weapon={w} />)}
          </div>
          {weaponList.length > 12 && (
            <div className="text-center pt-2">
              <button onClick={() => setShowAll(!showAll)} className="btn-ghost text-sm">
                {showAll ? t('weapon_collapse') : t('weapon_show_all', weaponList.length)}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-pubg-muted">
          <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-pubg-border/30 border border-pubg-border flex items-center justify-center">
            <Swords size={26} className="text-pubg-muted" />
          </div>
          <p>{t('weapon_no_data')}</p>
        </div>
      )}
    </div>
  );
}
