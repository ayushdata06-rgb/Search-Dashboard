import { useState, useMemo } from 'react';
import type { Platform } from '@/types';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PlatformFilter } from '@/components/influencer/PlatformFilter';
import { SearchBar } from '@/components/influencer/SearchBar';
import { InfluencerGrid } from '@/components/influencer/InfluencerGrid';
import { useInfluencerSearch } from '@/hooks/useInfluencerSearch';
import { useDebounce } from '@/hooks/useDebounce';

export function DashboardPage() {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: allProfiles, loading } = useInfluencerSearch(platform);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return allProfiles;
    const q = debouncedQuery.toLowerCase();
    return allProfiles.filter((p) => {
      const username = (p.username ?? p.handle ?? p.custom_name ?? '').toLowerCase();
      const fullname = p.fullname.toLowerCase();
      return username.includes(q) || fullname.includes(q);
    });
  }, [allProfiles, debouncedQuery]);

  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
    setSearchQuery('');
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[var(--text-primary)] tracking-tight mb-2">
          Find Influencers
        </h1>
        <p className="text-[var(--text-secondary)]">
          Browse top creators across social platforms
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <PlatformFilter selected={platform} onChange={handlePlatformChange} />
        <div className="flex-1 w-full sm:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={debouncedQuery ? filtered.length : undefined}
          />
        </div>
      </div>

      <p className="text-xs text-[var(--text-muted)] mb-4">
        Showing {filtered.length} of {allProfiles.length} on {platform}
      </p>

      <InfluencerGrid
        profiles={filtered}
        platform={platform}
        loading={loading}
      />
    </PageWrapper>
  );
}
