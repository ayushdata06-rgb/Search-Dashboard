import { useState } from 'react';
import { cn } from '@/utils/cn';
import type { Platform } from '@/types';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  platform?: Platform;
  className?: string;
  username?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-28 h-28 text-3xl',
};

const platformBgWrapper: Record<Platform, string> = {
  instagram: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600',
  youtube: 'bg-red-500',
  tiktok: 'bg-cyan-400',
};

export function Avatar({ src, alt, size = 'md', platform, className, username }: AvatarProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const initials = alt ? alt.charAt(0).toUpperCase() : '?';

  return (
    <div
      className={cn(
        'rounded-full flex-shrink-0 flex items-center justify-center p-[2px]',
        sizeClasses[size],
        platform ? platformBgWrapper[platform] : 'bg-[var(--border)]',
        className
      )}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-[var(--bg-base)] border-[2px] border-[var(--bg-base)] flex items-center justify-center">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => {
              if (imgSrc === src && username && platform) {
                setImgSrc(`https://unavatar.io/${platform}/${username}`);
              } else {
                setImgSrc('');
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-bold">
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}
