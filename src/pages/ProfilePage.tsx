import { useRef, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  ArrowLeft,
  Plus,
  Check,
  ExternalLink,
  BadgeCheck,
} from 'lucide-react';
import type { Platform } from '@/types';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProfileData } from '@/hooks/useProfileData';
import { useListStore } from '@/store/useListStore';
import { formatCompact, formatEngagementRate, formatNumber } from '@/utils/formatters';
import { getPlatformLabel } from '@/utils/formatters';

export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get('platform') as Platform) || 'instagram';
  const { data: user, loading, error } = useProfileData(username);
  const statsRef = useRef<HTMLDivElement>(null);

  const addProfile = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);
  const isInList = useListStore((s) => s.isInList(username ?? ''));

  const handleToggleList = useCallback(() => {
    if (!user || !username) return;
    if (isInList) {
      removeProfile(username);
    } else {
      addProfile({
        username,
        fullName: user.fullname,
        platform,
        followers: user.followers,
        engagementRate: user.engagement_rate ?? 0,
        avatarUrl: user.picture,
        isVerified: user.is_verified,
      });
    }
  }, [user, username, platform, isInList, addProfile, removeProfile]);

  // GSAP text animation removed to support formatted M/K strings

  if (loading) {
    return (
      <PageWrapper>
        <Spinner size="lg" />
      </PageWrapper>
    );
  }

  if (error || !user) {
    return (
      <PageWrapper>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </Link>
        <ErrorMessage message={error ?? 'Could not load profile'} />
      </PageWrapper>
    );
  }

  const stats = [
    { label: 'Followers', value: user.followers },
    ...(user.posts_count ? [{ label: 'Posts', value: user.posts_count }] : []),
    ...(user.avg_likes ? [{ label: 'Avg Likes', value: user.avg_likes }] : []),
  ];

  return (
    <PageWrapper>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to search
      </Link>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card relative overflow-hidden p-6 sm:p-8 mb-6"
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--accent)] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[var(--accent-secondary)] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar
            src={user.picture}
            alt={user.fullname}
            size="xl"
            platform={platform}
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text-primary)] tracking-tight">
                {user.fullname}
              </h1>
              {user.is_verified && (
                <BadgeCheck className="w-6 h-6 text-[var(--accent)]" />
              )}
            </div>
            <p className="text-[var(--text-secondary)] mb-2">
              @{user.username ?? username}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
              <Badge variant={platform}>{getPlatformLabel(platform)}</Badge>
              <span className="text-xs text-[var(--text-muted)]">
                {formatEngagementRate(user.engagement_rate)} engagement
              </span>
            </div>
            {user.description && (
              <p className="text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
                {user.description}
              </p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-[var(--bg-base)] border border-[var(--border)] p-3 text-center transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-[0_4px_20px_rgba(147,51,234,0.15)] hover:-translate-y-1"
            >
              <div className="stat-value text-lg font-bold font-mono text-[var(--text-primary)]">
                {formatCompact(stat.value)}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            onClick={handleToggleList}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isInList
                ? 'bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30'
                : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:scale-105 active:scale-95'
              }`}
          >
            {isInList ? (
              <>
                <Check className="w-4 h-4" />
                Added to List
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add to List
              </>
            )}
          </button>
          {user.url && (
            <a
              href={user.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]/50 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              View on {getPlatformLabel(platform)}
            </a>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <ProfileTabs user={user} />
    </PageWrapper>
  );
}

/* ---------- Sub-component: Profile Tabs ---------- */
import { useState } from 'react';
import type { FullUserProfile } from '@/types';

function ProfileTabs({ user }: { user: FullUserProfile }) {
  const [activeTab, setActiveTab] = useState<'about' | 'stats' | 'analytics'>('about');
  const tabs = [
    { id: 'about' as const, label: 'About' },
    { id: 'stats' as const, label: 'Stats' },
    { id: 'analytics' as const, label: 'Analytics' },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="flex border-b border-[var(--border)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'text-[var(--accent)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="profile-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          {activeTab === 'about' && <AboutTab user={user} />}
          {activeTab === 'stats' && <StatsTab user={user} />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AboutTab({ user }: { user: FullUserProfile }) {
  return (
    <div className="space-y-4 text-sm">
      {user.description && (
        <div>
          <h3 className="text-[var(--text-primary)] font-semibold mb-1">Bio</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
            {user.description}
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {user.gender && (
          <div>
            <span className="text-[var(--text-muted)]">Gender</span>
            <p className="text-[var(--text-primary)] font-medium capitalize">{user.gender.toLowerCase()}</p>
          </div>
        )}
        {user.age_group && (
          <div>
            <span className="text-[var(--text-muted)]">Age Group</span>
            <p className="text-[var(--text-primary)] font-medium">{user.age_group}</p>
          </div>
        )}
        {user.language && (
          <div>
            <span className="text-[var(--text-muted)]">Language</span>
            <p className="text-[var(--text-primary)] font-medium">{user.language.name}</p>
          </div>
        )}
        {user.is_business !== undefined && (
          <div>
            <span className="text-[var(--text-muted)]">Account Type</span>
            <p className="text-[var(--text-primary)] font-medium">
              {user.is_business ? 'Business' : 'Personal'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatsTab({ user }: { user: FullUserProfile }) {
  const detailedStats = [
    { label: 'Followers', value: formatCompact(user.followers) },
    ...(user.posts_count ? [{ label: 'Posts', value: formatNumber(user.posts_count) }] : []),
    ...(user.avg_likes ? [{ label: 'Avg Likes', value: formatCompact(user.avg_likes) }] : []),
    ...(user.avg_comments ? [{ label: 'Avg Comments', value: formatCompact(user.avg_comments) }] : []),
    ...(user.avg_views && user.avg_views > 0 ? [{ label: 'Avg Views', value: formatCompact(user.avg_views) }] : []),
    ...(user.avg_reels_plays ? [{ label: 'Avg Reels Plays', value: formatCompact(user.avg_reels_plays) }] : []),
    ...(user.avg_shares ? [{ label: 'Avg Shares', value: formatCompact(user.avg_shares) }] : []),
    ...(user.avg_saves ? [{ label: 'Avg Saves', value: formatCompact(user.avg_saves) }] : []),
    ...(user.total_likes ? [{ label: 'Total Likes', value: formatCompact(user.total_likes) }] : []),
    ...(user.total_views ? [{ label: 'Total Views', value: formatCompact(user.total_views) }] : []),
    { label: 'Engagement Rate', value: formatEngagementRate(user.engagement_rate) },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {detailedStats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl bg-[var(--bg-base)] border border-[var(--border)] p-4 transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-[0_4px_20px_rgba(147,51,234,0.15)] hover:-translate-y-1"
        >
          <div className="text-lg font-bold font-mono text-[var(--text-primary)]">
            {stat.value}
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-[var(--text-secondary)] mb-1">Analytics coming soon</p>
      <p className="text-sm text-[var(--text-muted)]">
        Detailed growth trends and audience insights will appear here
      </p>
    </div>
  );
}
