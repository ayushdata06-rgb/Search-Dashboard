import { motion } from 'framer-motion';
import type { Platform } from '@/types';
import { cn } from '@/utils/cn';
import { getPlatformLabel } from '@/utils/formatters';

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
}

const PLATFORMS: Platform[] = ['instagram', 'youtube', 'tiktok'];

const platformStyles: Record<Platform, string> = {
  instagram: 'text-[var(--insta)]',
  youtube: 'text-[var(--youtube)]',
  tiktok: 'text-[var(--tiktok)]',
};

export function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] w-fit">
      {PLATFORMS.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={cn(
            'relative px-5 py-2.5 rounded-lg text-sm font-medium transition-colors z-10',
            selected === p
              ? platformStyles[p]
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          )}
        >
          {selected === p && (
            <motion.div
              layoutId="platform-indicator"
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-secondary)]/20 border border-[var(--accent)]/30 shadow-[inset_0_0_10px_rgba(147,51,234,0.1)]"
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            />
          )}
          <span className="relative z-10">{getPlatformLabel(p)}</span>
        </button>
      ))}
    </div>
  );
}
