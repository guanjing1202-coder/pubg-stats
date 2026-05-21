import { ChevronDown } from 'lucide-react';

export default function SelectField({
  label,
  value,
  onChange,
  options,
  className = '',
  selectClassName = '',
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="block text-xs text-pubg-muted mb-1.5">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={onChange}
          className={`w-full appearance-none rounded-lg border border-pubg-border bg-pubg-dark px-3 py-2 pr-9 text-sm text-gray-300 outline-none transition-colors hover:border-pubg-muted focus:border-pubg-orange ${selectClassName}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-pubg-dark">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-pubg-muted"
        />
      </span>
    </label>
  );
}
