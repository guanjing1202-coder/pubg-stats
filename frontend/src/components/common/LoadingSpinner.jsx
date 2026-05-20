import { useLanguage } from '../../contexts/LanguageContext';

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
