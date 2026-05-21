import { useLanguage } from '../../contexts/LanguageContext';
import {
  LEADERBOARD_SKELETON_COLUMNS,
  LOADING_SKELETON_COUNTS,
} from './loadingSkeletonConfig';

export function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} border-2 border-pubg-border border-t-pubg-orange rounded-full animate-spin`} />
    </div>
  );
}

export function PageLoader() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-12 h-12 border-2 border-pubg-border border-t-pubg-orange rounded-full animate-spin" />
      <p className="text-pubg-muted text-sm">{t('loading')}</p>
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return <div className={`skeleton h-24 ${className}`} />;
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton h-16 rounded-xl" />
      ))}
    </div>
  );
}

function SkeletonLine({ className = '' }) {
  return <div className={`skeleton h-3 ${className}`} />;
}

export function StatsGridSkeleton({
  count = LOADING_SKELETON_COUNTS.statCards,
  className = '',
}) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card p-3 min-h-[92px]">
          <div className="flex items-center justify-between gap-3">
            <SkeletonLine className="w-16" />
            <div className="skeleton h-5 w-5 rounded-md" />
          </div>
          <div className="skeleton h-7 w-20 rounded-md mt-4" />
          <SkeletonLine className="w-24 mt-3" />
        </div>
      ))}
    </div>
  );
}

export function ModeTabsSkeleton({ count = 6 }) {
  return (
    <div className="flex items-center gap-2 overflow-hidden border-b border-pubg-border pb-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton h-9 rounded-lg ${index === 0 ? 'w-20' : 'w-16'}`}
        />
      ))}
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="grid grid-cols-[64px_1fr_repeat(5,92px)] gap-0 border-b border-pubg-border px-4 py-3">
            {LEADERBOARD_SKELETON_COLUMNS.map((column) => (
              <div key={column.key} className="flex items-center justify-center first:justify-start">
                <SkeletonLine className={`${column.width} h-2.5`} />
              </div>
            ))}
          </div>
          {Array.from({ length: LOADING_SKELETON_COUNTS.leaderboardRows }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[64px_1fr_repeat(5,92px)] items-center border-b border-pubg-border/50 px-4 py-3 last:border-0"
            >
              <div className="skeleton h-8 w-8 rounded-lg" />
              <div className="flex items-center gap-3">
                <div className="skeleton h-8 w-8 rounded-lg" />
                <div>
                  <SkeletonLine className={`${index % 3 === 0 ? 'w-40' : 'w-32'} h-3.5`} />
                  <SkeletonLine className="w-20 h-2.5 mt-2" />
                </div>
              </div>
              {LEADERBOARD_SKELETON_COLUMNS.slice(2).map((column, cellIndex) => (
                <div key={`${column.key}-${cellIndex}`} className="flex justify-center">
                  <SkeletonLine className={`${column.width} h-3`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PlayerPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5 animate-fade-in" aria-hidden="true">
      <div className="card overflow-hidden">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-pubg-darker via-pubg-dark to-pubg-card relative overflow-hidden">
          <div className="absolute inset-0 skeleton rounded-none opacity-70" />
        </div>
        <div className="px-5 pb-5 -mt-6 relative">
          <div className="skeleton w-14 h-14 rounded-xl mb-3" />
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="skeleton h-8 w-44 rounded-md" />
              <div className="flex flex-wrap gap-3">
                <SkeletonLine className="w-32" />
                <SkeletonLine className="w-20" />
                <SkeletonLine className="w-36" />
              </div>
            </div>
            <div className="skeleton h-8 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <SkeletonLine className="w-16" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="skeleton h-7 w-14 rounded" />
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 pt-4">
          <ModeTabsSkeleton count={LOADING_SKELETON_COUNTS.playerTabs} />
        </div>
        <div className="p-4 sm:p-5 space-y-5">
          <ModeTabsSkeleton count={6} />
          <StatsGridSkeleton />
        </div>
      </div>
    </div>
  );
}

export function ClanPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5 animate-fade-in" aria-hidden="true">
      <div className="skeleton h-5 w-24 rounded" />

      <section className="card overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-pubg-darker via-pubg-dark to-pubg-card relative overflow-hidden">
          <div className="absolute inset-0 skeleton rounded-none opacity-60" />
        </div>
        <div className="px-5 pb-5 -mt-7 relative">
          <div className="skeleton w-16 h-16 rounded-xl mb-4" />
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="skeleton h-6 w-16 rounded-md" />
                <div className="skeleton h-9 w-48 rounded-md" />
              </div>
              <div className="flex flex-wrap gap-3">
                <SkeletonLine className="w-52" />
                <SkeletonLine className="w-16" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: LOADING_SKELETON_COUNTS.clanStats }).map((_, index) => (
          <div key={index} className="card p-4 min-h-[92px]">
            <SkeletonLine className="w-24" />
            <div className="skeleton h-8 w-20 rounded-md mt-4" />
          </div>
        ))}
      </section>
    </div>
  );
}

export function MatchDetailSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in" aria-hidden="true">
      <div className="card p-5">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="space-y-3">
            <div className="skeleton h-7 w-44 rounded-md" />
            <SkeletonLine className="w-36" />
          </div>
          <div className="skeleton h-6 w-20 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="skeleton h-4 w-4 rounded" />
              <SkeletonLine className="w-16" />
              <SkeletonLine className="w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <SkeletonLine className="w-40" />
          <div className="skeleton h-8 w-28 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-pubg-border/60 p-3">
              <SkeletonLine className="w-20" />
              <div className="skeleton h-7 w-16 rounded-md mt-3" />
            </div>
          ))}
        </div>
      </div>

      <ModeTabsSkeleton count={2} />

      <div className="space-y-2">
        {Array.from({ length: LOADING_SKELETON_COUNTS.matchTeams }).map((_, teamIndex) => (
          <div key={teamIndex} className="card overflow-hidden">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="skeleton h-7 w-8 rounded" />
                <div className="min-w-0 space-y-2">
                  <SkeletonLine className={`${teamIndex % 2 === 0 ? 'w-52' : 'w-40'} max-w-full`} />
                  <SkeletonLine className="w-24 h-2.5" />
                </div>
              </div>
              <div className="skeleton h-4 w-4 rounded" />
            </div>
            {teamIndex < 2 && (
              <div className="border-t border-pubg-border px-4 py-3 space-y-3">
                {Array.from({ length: LOADING_SKELETON_COUNTS.matchParticipantRows }).map((__, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-[1fr_repeat(4,48px)] items-center gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="skeleton h-5 w-8 rounded" />
                      <SkeletonLine className="w-28" />
                    </div>
                    {Array.from({ length: 4 }).map((___, cellIndex) => (
                      <SkeletonLine key={cellIndex} className="w-10 justify-self-center" />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlayerStatsSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in" aria-hidden="true">
      <ModeTabsSkeleton count={6} />
      <StatsGridSkeleton />
    </div>
  );
}

export function RankedStatsSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in" aria-hidden="true">
      <ModeTabsSkeleton count={3} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: LOADING_SKELETON_COUNTS.rankedTierCards }).map((_, index) => (
          <div key={index}>
            <SkeletonLine className="w-28 mb-2" />
            <div className="card p-6 flex flex-col items-center gap-3 text-center min-h-[184px]">
              <div className="skeleton w-16 h-16 rounded-2xl" />
              <div className="skeleton h-7 w-24 rounded-md" />
              <div className="skeleton h-5 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
      <StatsGridSkeleton count={8} className="xl:grid-cols-4" />
    </div>
  );
}

export function LifetimeStatsSkeleton() {
  return (
    <div className="space-y-5 animate-fade-in" aria-hidden="true">
      <ModeTabsSkeleton count={6} />
      <div className="card p-5">
        <SkeletonLine className="w-32 mb-4" />
        <div className="h-[240px] flex items-center justify-center">
          <div className="relative h-44 w-44">
            <div className="absolute inset-0 skeleton rounded-full opacity-70" />
            <div className="absolute inset-8 bg-pubg-card rounded-full" />
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-pubg-border/70" />
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-pubg-border/70" />
          </div>
        </div>
      </div>
      <StatsGridSkeleton />
    </div>
  );
}

export function WeaponMasterySkeleton() {
  return (
    <div className="space-y-4 animate-fade-in" aria-hidden="true">
      <div className="card p-4 flex flex-wrap gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="skeleton h-6 w-20 rounded-md" />
            <SkeletonLine className="w-24" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SkeletonLine className="w-32" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton h-7 w-16 rounded" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: LOADING_SKELETON_COUNTS.weaponCards }).map((_, index) => (
          <div key={index} className="card p-4 min-h-[154px]">
            <div className="flex justify-between gap-3 mb-3">
              <div className="space-y-2">
                <div className="skeleton h-4 w-28 rounded" />
                <SkeletonLine className="w-16" />
              </div>
              <div className="skeleton h-6 w-12 rounded" />
            </div>
            <div className="skeleton h-1 w-full rounded-full mb-4" />
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((__, itemIndex) => (
                <div key={itemIndex} className="space-y-2">
                  <div className="skeleton h-4 w-10 mx-auto rounded" />
                  <SkeletonLine className="w-12 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SurvivalMasterySkeleton() {
  return (
    <div className="space-y-5 animate-fade-in" aria-hidden="true">
      <div className="card p-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="skeleton w-24 h-24 rounded-2xl" />
        <div className="flex-1 w-full space-y-3">
          <SkeletonLine className="w-28" />
          <div className="skeleton h-9 w-36 rounded-md" />
          <SkeletonLine className="w-24" />
          <div className="flex flex-wrap gap-5">
            <SkeletonLine className="w-24" />
            <SkeletonLine className="w-32" />
          </div>
          <div className="skeleton h-1.5 w-full max-w-xs rounded-full" />
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-pubg-border flex items-center justify-between">
          <SkeletonLine className="w-40" />
          <div className="flex gap-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton h-7 w-14 rounded" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {Array.from({ length: LOADING_SKELETON_COUNTS.survivalRows }).map((_, index) => (
            <div key={index} className="flex items-center justify-between px-4 py-3 border-b border-pubg-border/40">
              <SkeletonLine className="w-28" />
              <SkeletonLine className="w-16" />
            </div>
          ))}
        </div>
      </div>
      <StatsGridSkeleton count={6} className="xl:grid-cols-3" />
    </div>
  );
}
