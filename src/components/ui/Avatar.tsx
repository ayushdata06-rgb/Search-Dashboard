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

const ringColors: Record<Platform, string> = {
  instagram: 'ring-[var(--insta)]',
  youtube: 'ring-[var(--youtube)]',
  tiktok: 'ring-[var(--tiktok)]',
};

export function Avatar({ src, alt, size = 'md', platform, className }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-[var(--bg-base)] flex-shrink-0',
        sizeClasses[size],
        platform ? ringColors[platform] : 'ring-[var(--border)]',
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
