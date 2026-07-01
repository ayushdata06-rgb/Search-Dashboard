import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Check, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { PLATFORM_CONFIG, type Platform, type UserProfileSummary } from '@/types';

export const InfluencerCard = memo(function InfluencerCard({
  profile,
  platform,
  index,
}: InfluencerCardProps) {
  const navigate = useNavigate();
  const addProfile = useListStore((s) => s.addProfile);
  const isInList = useListStore((s) => s.isInList(profile.username ?? profile.user_id));

  const displayUsername = profile.username ?? profile.handle ?? profile.custom_name ?? profile.user_id;

  const handleClick = useCallback(() => {
    navigate(`/dashboard/profile/${displayUsername}?platform=${platform}`);
  }, [navigate, displayUsername, platform]);

  const handleToggleList = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isInList) {
        const key = profile.username ?? profile.user_id;
        addProfile({
          username: key,
          fullName: profile.fullname,
          platform,
          followers: profile.followers,
          engagement: profile.engagement_rate ?? 0,
          avatarUrl: profile.picture,
          isVerified: profile.is_verified,
        });
        toast.success(`@${displayUsername} added to your list`);
      }
    },
    [profile, platform, isInList, addProfile, displayUsername]
  );

  const config = PLATFORM_CONFIG[platform];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={handleClick}
      className="card p-5 cursor-pointer group"
      style={{
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease'
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget;
        target.style.boxShadow = `0 8px 24px ${config.glow}`;
        target.style.transform = 'translateY(-6px)';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget;
        target.style.boxShadow = 'none';
        target.style.transform = 'none';
      }}
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
          disabled={isInList}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isInList
              ? 'bg-green-500/15 text-green-500 border border-green-500/20 cursor-not-allowed'
              : 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20'
          }`}
        >
          {isInList ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Added
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
