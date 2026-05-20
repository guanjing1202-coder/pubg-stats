export default function StatCard({ label, value, sub, highlight = false, icon }) {
  return (
    <div className={`card p-4 flex flex-col gap-1 ${highlight ? 'border-pubg-orange/50 bg-pubg-orange/5' : ''}`}>
      {icon && <div className="text-pubg-orange mb-1">{icon}</div>}
      <div className={`text-xl sm:text-2xl font-bold font-mono ${highlight ? 'text-pubg-orange' : 'text-white'}`}>
        {value ?? '-'}
      </div>
      <div className="text-xs text-pubg-muted uppercase tracking-wider">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}
