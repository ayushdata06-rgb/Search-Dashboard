import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { SiInstagram, SiYoutube, SiTiktok } from 'react-icons/si';
import type { Platform, SearchData } from '@/types';
import { PLATFORM_CONFIG } from '@/types';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { InfluencerGrid } from '@/components/influencer/InfluencerGrid';
import { Pagination } from '@/components/ui/Pagination';
import { useListStore } from '@/store/useListStore';

export function PlatformPage() {
  const { platform } = useParams<{ platform: Platform }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback if somehow undefined
  const currentPlatform = platform || 'instagram';
  const config = PLATFORM_CONFIG[currentPlatform];

  const currentPage = useListStore((s) => s.platformPages[currentPlatform] || 1);
  const setCurrentPage = useListStore((s) => s.setPlatformPage);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load platform creators
  useEffect(() => {
    let active = true;
    setLoading(true);
    
    import(`../assets/data/search/${currentPlatform}.json`)
      .then((mod: { default: SearchData }) => {
        if (!active) return;
        const profiles = mod.default.accounts.map((item) => item.account.user_profile);
        setCreators(profiles);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setCreators([]);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [currentPlatform]);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return creators;
    const q = debouncedQuery.toLowerCase();
    return creators.filter((p) => {
      const username = (p.username ?? p.handle ?? p.custom_name ?? p.user_id).toLowerCase();
      const fullname = p.fullname.toLowerCase();
      return username.includes(q) || fullname.includes(q);
    });
  }, [creators, debouncedQuery]);

  const itemsPerPage = 6;
  
  const currentProfiles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const getPlatformIcon = () => {
    switch (currentPlatform) {
      case 'instagram':
        return <SiInstagram size={18} color={config.color} />;
      case 'youtube':
        return <SiYoutube size={18} color={config.color} />;
      case 'tiktok':
        return <SiTiktok size={18} color={config.color} />;
    }
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">
          Searching across
        </p>
        <h1 
          className="text-3xl sm:text-4xl font-bold font-display tracking-tight"
          style={{ color: config.color }}
        >
          {config.label}
        </h1>
      </div>

      <div className="w-full max-w-[680px] mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(currentPlatform, 1);
            }}
            placeholder={`Search ${config.label} creators...`}
            className="w-full pl-12 pr-14 py-3.5 rounded-[16px] bg-[var(--bg-surface)] border border-[var(--border)] text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-white/20 transition-all text-[15px]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(currentPlatform, 1);
                }}
                className="text-[var(--text-muted)] hover:text-white transition-colors p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="pointer-events-none flex items-center justify-center p-1">
              {getPlatformIcon()}
            </div>
          </div>
        </div>
        {searchQuery && (
          <p className="text-[13px] text-[var(--text-muted)] mt-3 ml-2">
            Showing {filtered.length} of {creators.length} creators
          </p>
        )}
      </div>

      {filtered.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="w-12 h-12 text-white/5 mb-4" />
          <p className="text-[var(--text-secondary)] text-lg mb-1">No creators found</p>
          <p className="text-[var(--text-muted)] text-sm">Try a different search term</p>
        </div>
      ) : (
        <InfluencerGrid
          profiles={currentProfiles}
          platform={currentPlatform}
          loading={loading}
          currentPage={currentPage}
        />
      )}

      {!loading && filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(currentPlatform, page)}
          label="creators"
        />
      )}
    </PageWrapper>
  );
}
