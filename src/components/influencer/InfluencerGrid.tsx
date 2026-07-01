import { motion, AnimatePresence } from 'framer-motion';
import type { Platform, UserProfileSummary } from '@/types';
import { InfluencerCard } from './InfluencerCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Users } from 'lucide-react';

interface InfluencerGridProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  loading: boolean;
  currentPage: number;
}

export function InfluencerGrid({ profiles, platform, loading, currentPage }: InfluencerGridProps) {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key={`loading-${platform}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </motion.div>
      ) : profiles.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <Users className="w-12 h-12 text-[var(--text-muted)] mb-4" />
          <p className="text-[var(--text-secondary)] text-lg">No influencers found</p>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Try adjusting your search or switching platforms
          </p>
        </motion.div>
      ) : (
        <motion.div
          key={`grid-${platform}-${currentPage}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {profiles.map((profile, index) => (
              <InfluencerCard
                key={profile.user_id}
                profile={profile}
                platform={profile.platform || platform}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
