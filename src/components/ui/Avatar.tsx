import { cn } from '@/utils/cn';
import type { Platform } from '@/types';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  platform?: Platform;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-28 h-28',
};

const platformBgWrapper: Record<Platform, string> = {
  instagram: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600',
  youtube: 'bg-red-500',
  tiktok: 'bg-cyan-400',
};

export function Avatar({ src, alt, size = 'md', platform, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full flex-shrink-0 flex items-center justify-center p-[2px]',
        sizeClasses[size],
        platform ? platformBgWrapper[platform] : 'bg-[var(--border)]',
        className
      )}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-[var(--bg-base)] border-[2px] border-[var(--bg-base)]">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}
