import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { formatCompact } from '@/utils/formatters';
import { Avatar } from '@/components/ui/Avatar';
import { PLATFORM_CONFIG } from '@/types';

export function SearchDropdown() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: globalProfiles, loading } = useGlobalSearch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const filtered = debouncedQuery.length > 0
    ? globalProfiles.filter((p) => {
        const username = (p.username ?? p.handle ?? p.custom_name ?? '').toLowerCase();
        const fullname = p.fullname.toLowerCase();
        const searchStr = debouncedQuery.toLowerCase();
        return username.includes(searchStr) || fullname.includes(searchStr);
      })
    : [];

  return (
    <div className="relative w-full max-w-[680px] mx-auto z-30" ref={containerRef}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value.length > 0) setIsOpen(true);
          else setIsOpen(false);
        }}
        onFocus={() => {
          if (query.length > 0) setIsOpen(true);
        }}
        placeholder="Search any creator across all platforms..."
        className="w-full pl-12 pr-12 py-3.5 rounded-[16px] bg-[#1a1a24] border border-white/10 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_20px_rgba(147,51,234,0.15)] transition-all text-[15px]"
      />
      {query.length > 0 && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors p-1"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && query.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#1a1a24] border border-white/10 rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-h-[340px] overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center text-sm text-[var(--text-muted)]">
                Searching...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-center text-[14px] text-[var(--text-muted)]">
                No creators found for '{query}'
              </div>
            ) : (
              <div className="flex flex-col py-2">
                {filtered.map((profile) => {
                  const username = profile.username ?? profile.handle ?? profile.custom_name ?? profile.user_id;
                  const config = PLATFORM_CONFIG[profile.platform];
                  return (
                    <div
                      key={`${profile.platform}-${profile.user_id}`}
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/dashboard/profile/${username}?platform=${profile.platform}`);
                      }}
                      className="flex items-center gap-3 px-4 h-[60px] hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <Avatar
                        src={profile.picture}
                        alt={profile.fullname}
                        size="sm"
                        platform={profile.platform}
                        className="w-[38px] h-[38px] flex-shrink-0"
                      />
                      <div className="flex flex-col flex-1 min-w-0 justify-center">
                        <div className="flex items-center justify-between">
                          <span className="text-[15px] font-bold text-white truncate">
                            @{username}
                          </span>
                          <span className="text-[13px] text-[var(--text-muted)] flex-shrink-0 tabular-nums">
                            {formatCompact(profile.followers)} followers
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[13px] text-[var(--text-secondary)] truncate">
                            {profile.fullname}
                          </span>
                          <div
                            className="px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase tracking-wider text-white flex-shrink-0"
                            style={{ backgroundColor: config.color }}
                          >
                            {config.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
