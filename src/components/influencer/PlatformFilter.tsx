import { motion } from 'framer-motion';
import { SiInstagram, SiYoutube, SiTiktok } from 'react-icons/si';
import type { Platform } from '@/types';
import { cn } from '@/utils/cn';
import { getPlatformLabel } from '@/utils/formatters';

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
}

const PLATFORMS: Platform[] = ['instagram', 'youtube', 'tiktok'];

const platformIcons: Record<Platform, React.ReactNode> = {
  instagram: <SiInstagram className="w-4 h-4" />,
  youtube: <SiYoutube className="w-4 h-4" />,
  tiktok: <SiTiktok className="w-4 h-4" />,
};

const platformStyles: Record<Platform, string> = {
  instagram: 'text-[var(--insta)]',
  youtube: 'text-[var(--youtube)]',
  tiktok: 'text-[var(--tiktok)]',
};

const platformBg: Record<Platform, string> = {
  instagram: 'bg-[var(--insta)]',
  youtube: 'bg-[var(--youtube)]',
  tiktok: 'bg-[var(--tiktok)]',
};

export function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] w-fit">
      {PLATFORMS.map((p) => {
        const isActive = selected === p;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              'relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors z-10',
              isActive
                ? `${platformStyles[p]} opacity-100`
                : `${platformStyles[p]} opacity-40 hover:opacity-100`
            )}
          >
            {platformIcons[p]}
            <span className="relative z-10">{getPlatformLabel(p)}</span>
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className={cn('absolute bottom-0 left-0 right-0 h-[2px] rounded-full', platformBg[p])}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
