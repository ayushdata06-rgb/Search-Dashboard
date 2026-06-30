import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, List } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useListStore } from '@/store/useListStore';
import { SavedListPanel } from '@/components/list/SavedListPanel';

export function Navbar() {
  const [panelOpen, setPanelOpen] = useState(false);
  const savedCount = useListStore((s) => s.savedProfiles.length);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-[var(--border)] backdrop-blur-xl bg-[var(--bg-base)]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors">
              <span aria-hidden="true">&larr;</span> Back to Searchify
            </Link>
            <div className="h-4 w-px bg-[var(--border)] hidden sm:block"></div>

          </div>

          <button
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all text-sm font-medium text-[var(--text-primary)]"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">My List</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[var(--accent)] text-white min-w-[20px] text-center">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {panelOpen && <SavedListPanel onClose={() => setPanelOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
