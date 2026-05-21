import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Hash, Shield, Users } from 'lucide-react';
import { pubgApi } from '../utils/api';
import { useLanguage } from '../contexts/LanguageContext';
import { ClanPageSkeleton } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

export default function Clan() {
  const { platform, clanId } = useParams();
  const decodedClanId = decodeURIComponent(clanId);
  const { t } = useLanguage();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['clan', platform, decodedClanId],
    queryFn: () => pubgApi.getClan(platform, decodedClanId),
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading) return <ClanPageSkeleton />;
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <ErrorMessage error={error} onRetry={refetch} />
      </div>
    );
  }

  const attrs = data?.data?.attributes || {};
  const name = attrs.clanName || attrs.name || t('clan_unknown');
  const tag = attrs.clanTag || attrs.tag;
  const level = attrs.clanLevel ?? attrs.level;
  const members = attrs.clanMemberCount ?? attrs.memberCount;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-pubg-muted hover:text-white transition-colors">
        <ArrowLeft size={16} />
        {t('match_home')}
      </Link>

      <section className="card overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-pubg-darker via-pubg-dark to-pubg-card relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(245,166,35,0.1) 10px, rgba(245,166,35,0.1) 11px)' }} />
          <Shield size={96} className="absolute right-6 bottom-2 text-pubg-orange opacity-10" />
        </div>
        <div className="px-5 pb-5 -mt-7 relative">
          <div className="w-16 h-16 bg-pubg-orange rounded-xl flex items-center justify-center shadow-lg mb-4">
            <Shield size={32} className="text-black" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                {tag && (
                  <span className="text-pubg-orange font-mono font-bold text-lg">[{tag}]</span>
                )}
                <h1 className="text-3xl font-black text-white">{name}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-pubg-muted">
                <span className="flex items-center gap-1">
                  <Hash size={12} />
                  <span className="font-mono text-xs">{decodedClanId}</span>
                </span>
                <span>{platform}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="card p-4">
          <div className="text-xs text-pubg-muted uppercase tracking-wider">{t('clan_level')}</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">{level ?? '-'}</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-pubg-muted uppercase tracking-wider">{t('clan_members')}</div>
          <div className="flex items-center gap-2 text-2xl font-bold text-white font-mono mt-1">
            <Users size={18} className="text-pubg-orange" />
            {members ?? '-'}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-pubg-muted uppercase tracking-wider">{t('clan_tag')}</div>
          <div className="text-2xl font-bold text-pubg-orange font-mono mt-1">{tag || '-'}</div>
        </div>
      </section>
    </div>
  );
}
