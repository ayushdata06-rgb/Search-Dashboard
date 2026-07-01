import { useRef, useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Check, Plus, BadgeCheck, Calendar, Tag, MapPin, ExternalLink, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import type { Platform } from '@/types';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useProfileData } from '@/hooks/useProfileData';
import { useListStore } from '@/store/useListStore';
import { formatCompact, formatEngagementRate } from '@/utils/formatters';
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
      toast.error(`@${username} removed from your list`);
    } else {
      addProfile({
        username,
        fullName: user.fullname,
        platform,
        followers: user.followers,
        engagement: user.engagement_rate ?? 0,
        avatarUrl: user.picture,
        isVerified: user.is_verified,
      });
      toast.success(`@${username} added to your list`);
    }
  }, [user, username, platform, isInList, addProfile, removeProfile]);

  useEffect(() => {
    if (!user || !statsRef.current) return;
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>('.stat-value');
      targets.forEach((el, index) => {
        const val = parseFloat(el.getAttribute('data-val') || '0');
        const format = el.getAttribute('data-format');
        
        gsap.fromTo(el, 
          { innerHTML: 0 },
          {
            innerHTML: val,
            duration: 1.5,
            ease: 'power2.out',
            delay: index * 0.15,
            onUpdate: function() {
              const current = Number(this.targets()[0].innerHTML);
              el.textContent = format === 'percent' 
                ? formatEngagementRate(current)
                : formatCompact(current);
            }
          }
        );
      });
    }, statsRef);
    return () => ctx.revert();
  }, [user]);

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
        <ErrorMessage message={error ?? 'Could not load profile'} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* 1. NAVBAR */}
      <div className="flex items-center justify-end sticky top-0 z-10 bg-[var(--bg-base)]/80 backdrop-blur-md py-4 mb-6 border-b border-[var(--border)]">
        
        <button
          onClick={handleToggleList}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            isInList
              ? 'bg-[var(--success)]/15 text-[var(--success)] border border-[var(--success)]/30'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isInList ? (
            <><Check className="w-4 h-4" /> In List</>
          ) : (
            <><Plus className="w-4 h-4" /> Add to List</>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* TOP SECTION: Avatar and Stats */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* 2. TOP-RIGHT PROFILE SECTION (actually on the left visually but described as "Top-Right Profile Section") */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white/3 rounded-2xl p-6 border border-white/5"
          >
            <Avatar src={user.picture} alt={user.fullname} size="xl" platform={platform} className="w-[120px] h-[120px] shadow-xl" />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">@{user.username ?? username}</h1>
                {user.is_verified && <BadgeCheck className="w-5 h-5 text-purple-500" />}
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-3">{user.fullname}</p>
              
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                <Badge variant={platform}>{getPlatformLabel(platform)}</Badge>
                {user.is_business && <Badge variant="tiktok">Business</Badge>}
              </div>

              {user.description && (
                <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                  {user.description}
                </p>
              )}
            </div>
          </motion.div>

          {/* 3. TOP-CENTRE STATS BAR */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex-[1.5] bg-white/3 rounded-2xl border border-white/5 flex items-center p-6"
            ref={statsRef}
          >
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x divide-white/10">
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Followers</span>
                <span className="stat-value text-2xl font-bold text-white" data-val={user.followers}>0</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Following</span>
                <span className="stat-value text-2xl font-bold text-white" data-val={892}>0</span> {/* Dummy data as it's not strictly in user except maybe some platforms */}
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Posts</span>
                <span className="stat-value text-2xl font-bold text-white" data-val={user.posts_count ?? 214}>0</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Avg Engagement</span>
                <span className="stat-value text-2xl font-bold text-white" data-val={user.engagement_rate ?? 0} data-format="percent">0%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM SECTION: Info and Analytics */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* 4. LEFT SIDE - INFO */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex-1 bg-white/3 rounded-2xl p-6 border border-white/5"
          >
            <h3 className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-6">About</h3>
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-[var(--text-muted)] mr-3" />
                <span className="text-[var(--text-secondary)] w-24">Joined</span>
                <span className="text-white font-medium">2010</span>
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 text-[var(--text-muted)] mr-3" />
                <span className="text-[var(--text-secondary)] w-24">Category</span>
                <span className="text-white font-medium capitalize">{user.age_group ? `${user.age_group} ${user.gender || 'Unknown'}` : 'Lifestyle'}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-[var(--text-muted)] mr-3" />
                <span className="text-[var(--text-secondary)] w-24">Location</span>
                <span className="text-white font-medium">{user.language ? user.language.name : 'Unknown'}</span>
              </div>
              <div className="flex items-center">
                <BadgeCheck className="w-4 h-4 text-[var(--text-muted)] mr-3" />
                <span className="text-[var(--text-secondary)] w-24">Verified</span>
                <span className="text-white font-medium">{user.is_verified ? 'Yes' : 'No'}</span>
              </div>
              {user.url && (
                <div className="flex items-center">
                  <LinkIcon className="w-4 h-4 text-[var(--text-muted)] mr-3" />
                  <span className="text-[var(--text-secondary)] w-24">Website</span>
                  <a href={user.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1">
                    {new URL(user.url).hostname.replace('www.', '')} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* 5. RIGHT SIDE - ANALYTICS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex-[2] bg-white/3 rounded-2xl p-6 border border-white/5"
          >
            <h3 className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-6">Analytics</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-[#111118] p-4 rounded-xl border border-white/5">
                <div className="text-xs text-[var(--text-muted)] mb-1">Engagement Rate</div>
                <div className="text-xl font-bold text-green-400">{formatEngagementRate(user.engagement_rate ?? 0)}</div>
              </div>
              <div className="bg-[#111118] p-4 rounded-xl border border-white/5">
                <div className="text-xs text-[var(--text-muted)] mb-1">Avg Likes</div>
                <div className="text-xl font-bold text-white">{formatCompact(user.avg_likes ?? 5200000)}</div>
              </div>
              <div className="bg-[#111118] p-4 rounded-xl border border-white/5">
                <div className="text-xs text-[var(--text-muted)] mb-1">Avg Comments</div>
                <div className="text-xl font-bold text-white">{formatCompact(user.avg_comments ?? 42000)}</div>
              </div>
              <div className="bg-[#111118] p-4 rounded-xl border border-white/5">
                <div className="text-xs text-[var(--text-muted)] mb-1">Est. Reach</div>
                <div className="text-xl font-bold text-white">{formatCompact((user.followers ?? 0) * 0.6)}</div>
              </div>
            </div>

            {/* Simple CSS Bar Chart */}
            <div className="bg-[#111118] p-5 rounded-xl border border-white/5">
              <div className="text-sm font-medium text-white mb-4">Engagement Comparison</div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 sm:w-32 shrink-0 text-xs text-[var(--text-secondary)]">Their engagement</div>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  <div className="w-12 text-xs font-bold text-white text-right">{formatEngagementRate(user.engagement_rate ?? 0)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 sm:w-32 shrink-0 text-xs text-[var(--text-secondary)]">Platform average</div>
                  <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white/20 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <div className="w-12 text-xs font-bold text-white text-right">0.35%</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
