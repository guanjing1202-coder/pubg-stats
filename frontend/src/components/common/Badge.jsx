const VARIANTS = {
  win: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  top10: 'bg-green-500/20 text-green-400 border-green-500/30',
  default: 'bg-pubg-border/50 text-gray-400 border-pubg-border',
  orange: 'bg-pubg-orange/20 text-pubg-orange border-pubg-orange/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  );
}
