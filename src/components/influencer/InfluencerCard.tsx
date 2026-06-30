import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Check, BadgeCheck } from 'lucide-react';
import type { Platform, UserProfileSummary } from '@/types';
import { useListStore } from '@/store/useListStore';
import { formatCompact, formatEngagementRate } from '@/utils/formatters';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

interface InfluencerCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  index: number;
}

export const InfluencerCard = memo(function InfluencerCard({
  profile,
  platform,
  index,
}: InfluencerCardProps) {
  const navigate = useNavigate();
  const addProfile = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);
  const isInList = useListStore((s) => s.isInList(profile.username ?? profile.user_id));

  const displayUsername = profile.username ?? profile.handle ?? profile.custom_name ?? profile.user_id;

  const handleClick = useCallback(() => {
    navigate(`/dashboard/profile/${displayUsername}?platform=${platform}`);
  }, [navigate, displayUsername, platform]);

  const handleToggleList = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const key = profile.username ?? profile.user_id;
      if (isInList) {
        removeProfile(key);
      } else {
        addProfile({
          username: key,
          fullName: profile.fullname,
          platform,
          followers: profile.followers,
          engagementRate: profile.engagement_rate ?? 0,
          avatarUrl: profile.picture,
          isVerified: profile.is_verified,
        });
      }
    },
    [profile, platform, isInList, addProfile, removeProfile]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={handleClick}
      className="card p-5 cursor-pointer group"
    >
      <div className="flex items-center gap-4 mb-3">
        <Avatar
          src={profile.picture}
          alt={profile.fullname}
          size="lg"
          platform={platform}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[var(--text-primary)] truncate">
              @{displayUsername}
            </span>
            {profile.is_verified && (
              <BadgeCheck className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)] truncate">
            {profile.fullname}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm">
        <div>
          <span className="font-mono font-semibold text-[var(--text-primary)]">
            {formatCompact(profile.followers)}
          </span>
          <span className="text-[var(--text-muted)] ml-1">followers</span>
        </div>
        <div className="w-px h-4 bg-[var(--border)]" />
        <div>
          <span className="font-mono font-semibold text-[var(--text-primary)]">
            {formatEngagementRate(profile.engagement_rate)}
          </span>
          <span className="text-[var(--text-muted)] ml-1">eng.</span>
        </div>
        {profile.avg_views !== undefined && profile.avg_views > 0 && (
          <>
            <div className="w-px h-4 bg-[var(--border)]" />
            <div>
              <span className="font-mono font-semibold text-[var(--text-primary)]">
                {formatCompact(profile.avg_views)}
              </span>
              <span className="text-[var(--text-muted)] ml-1">views</span>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={platform}>{platform}</Badge>
        <div className="flex-1" />
        <button
          onClick={handleToggleList}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isInList
              ? 'bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/20'
              : 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20'
          }`}
        >
          {isInList ? (
            <>
              <Check className="w-3.5 h-3.5" />
              In List
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              Add
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
});
