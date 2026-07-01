import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { formatCompact } from '@/utils/formatters';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

export function SearchBar() {
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
    <div className="relative w-full z-50" ref={containerRef}>
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
        placeholder="Search by name or username..."
        className="w-full pl-12 pr-12 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all text-sm"
      />
      {query.length > 0 && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && query.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a24] border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-h-[360px] overflow-y-auto overflow-x-hidden custom-scrollbar"
          >
            {loading ? (
              <div className="p-4 text-center text-sm text-[var(--text-muted)]">
                Searching...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-center text-sm text-[var(--text-muted)]">
                No creators found for '{query}'
              </div>
            ) : (
              <div className="flex flex-col p-2">
                {filtered.map((profile) => {
                  const username = profile.username ?? profile.handle ?? profile.custom_name ?? '';
                  return (
                    <div
                      key={`${profile.platform}-${profile.user_id}`}
                      onClick={() => {
                        setIsOpen(false);
                        navigate(`/profile/${username}`);
                      }}
                      className="flex items-center gap-3 px-3 h-[56px] rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
                    >
                      <Avatar
                        src={profile.picture}
                        alt={profile.fullname}
                        size="sm"
                        platform={profile.platform}
                        className="w-9 h-9"
                      />
                      <div className="flex flex-col flex-1 min-w-0 justify-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white truncate">
                            @{username}
                          </span>
                          <span className="text-[13px] text-[var(--text-muted)] truncate">
                            {profile.fullname}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={profile.platform} className="text-[10px] px-1.5 py-0">
                          {profile.platform}
                        </Badge>
                        <span className="text-sm text-[var(--text-muted)] tabular-nums">
                          {formatCompact(profile.followers)}
                        </span>
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
