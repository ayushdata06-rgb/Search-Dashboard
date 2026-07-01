import { useEffect, useMemo } from 'react';
import type { Platform } from '@/types';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SearchDropdown } from '@/components/influencer/SearchDropdown';
import { InfluencerGrid } from '@/components/influencer/InfluencerGrid';
import { Pagination } from '@/components/ui/Pagination';
import { PlatformBox } from '@/components/influencer/PlatformBox';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { useListStore } from '@/store/useListStore';

export function DashboardPage() {
  const { data: allProfiles, loading } = useGlobalSearch();
  const featuredPage = useListStore((s) => s.featuredPage);
  const setFeaturedPage = useListStore((s) => s.setFeaturedPage);
  const shuffledCreators = useListStore((s) => s.shuffledCreators);
  const setShuffledCreators = useListStore((s) => s.setShuffledCreators);

  // Shuffle creators on mount if we haven't already
  useEffect(() => {
    if (!loading && allProfiles.length > 0 && shuffledCreators.length === 0) {
      const shuffled = [...allProfiles].sort(() => Math.random() - 0.5);
      setShuffledCreators(shuffled);
    }
  }, [loading, allProfiles, shuffledCreators.length, setShuffledCreators]);

  // Use shuffled creators if available, else fallback to allProfiles (during first load)
  const displayProfiles = shuffledCreators.length > 0 ? shuffledCreators : allProfiles;

  // Pagination logic
  const itemsPerPage = 6;
  const currentProfiles = useMemo(() => {
    const start = (featuredPage - 1) * itemsPerPage;
    return displayProfiles.slice(start, start + itemsPerPage);
  }, [displayProfiles, featuredPage]);

  return (
    <PageWrapper>
      {/* 1. HEADING */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight mb-2">
          Find Your Influencer
        </h1>
        <p className="text-[var(--text-muted)]">
          Search across Instagram, YouTube and TikTok in one place
        </p>
      </div>

      {/* 2. GLOBAL SEARCH BAR */}
      <div className="mb-12">
        <SearchDropdown />
      </div>

      {/* 3. BROWSE BY PLATFORM */}
      <div className="mb-12">
        <h2 className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-4 font-bold">
          Browse by Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PlatformBox platform="instagram" creatorCount={10} />
          <PlatformBox platform="youtube" creatorCount={10} />
          <PlatformBox platform="tiktok" creatorCount={10} />
        </div>
      </div>

      {/* 4. FEATURED CREATORS GRID */}
      <div>
        <h2 className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-4 font-bold">
          Featured Creators
        </h2>
        
        <InfluencerGrid
          profiles={currentProfiles}
          // The grid expects a single platform for the key stagger, but these are mixed.
          // We pass a dummy 'all' or just the first item's platform as a workaround if required,
          // but let's pass a special 'mixed' string if the types allow it. Actually InfluencerGrid
          // expects Platform type ('instagram'|'youtube'|'tiktok'). Let's update InfluencerGrid 
          // to accept Platform | 'mixed'.
          platform={'instagram'} // Just passing a default since InfluencerGrid expects a valid Platform for the Skeleton key
          loading={loading && shuffledCreators.length === 0}
          currentPage={featuredPage}
        />

        {!loading && displayProfiles.length > 0 && (
          <Pagination
            currentPage={featuredPage}
            totalItems={displayProfiles.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setFeaturedPage}
            label="featured creators"
          />
        )}
      </div>
    </PageWrapper>
  );
}
