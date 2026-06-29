import { X } from 'lucide-react';
import type { InfluencerSummary } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { formatCompact } from '@/utils/formatters';

interface SavedListItemProps {
  profile: InfluencerSummary;
  onRemove: (username: string) => void;
}

export function SavedListItem({ profile, onRemove }: SavedListItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors group">
      <Avatar
        src={profile.avatarUrl}
        alt={profile.fullName}
        size="sm"
        platform={profile.platform}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
          {profile.fullName}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">
            {formatCompact(profile.followers)}
          </span>
          <Badge variant={profile.platform} className="text-[10px] px-1.5 py-0">
            {profile.platform}
          </Badge>
        </div>
      </div>
      <button
        onClick={() => onRemove(profile.username)}
        className="p-1 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
        aria-label={`Remove ${profile.fullName}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
