import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  resultCount?: number;
}

export function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or username..."
        className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_20px_var(--accent-glow)] transition-all text-sm"
      />
      {resultCount !== undefined && value.length > 0 && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">
          {resultCount} results
        </span>
      )}
    </div>
  );
}
