import type { Platform, UserProfileSummary } from '@/types';
import { InfluencerCard } from './InfluencerCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Users } from 'lucide-react';

interface InfluencerGridProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  loading: boolean;
}

export function InfluencerGrid({ profiles, platform, loading }: InfluencerGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Users className="w-12 h-12 text-[var(--text-muted)] mb-4" />
        <p className="text-[var(--text-secondary)] text-lg">No influencers found</p>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          Try adjusting your search or switching platforms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {profiles.map((profile, index) => (
        <InfluencerCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
          index={index}
        />
      ))}
    </div>
  );
}
