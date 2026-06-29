import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, UserPlus } from 'lucide-react';
import { useListStore } from '@/store/useListStore';
import { SavedListItem } from './SavedListItem';

interface SavedListPanelProps {
  onClose: () => void;
}

export function SavedListPanel({ onClose }: SavedListPanelProps) {
  const savedProfiles = useListStore((s) => s.savedProfiles);
  const removeProfile = useListStore((s) => s.removeProfile);
  const clearList = useListStore((s) => s.clearList);

  const handleRemove = useCallback(
    (username: string) => {
      removeProfile(username);
    },
    [removeProfile]
  );

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[380px] z-50 bg-[var(--bg-surface)] border-l border-[var(--border)] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-lg font-semibold font-display text-[var(--text-primary)]">
              My List
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {savedProfiles.length} influencer{savedProfiles.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <div className="flex items-center gap-2">
            {savedProfiles.length > 0 && (
              <button
                onClick={clearList}
                className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                aria-label="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-2">
          {savedProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <UserPlus className="w-12 h-12 text-[var(--text-muted)] mb-4" />
              <p className="text-[var(--text-secondary)] font-medium mb-1">
                Your list is empty
              </p>
              <p className="text-sm text-[var(--text-muted)]">
                Start adding influencers from the search to build your list
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {savedProfiles.map((profile) => (
                <SavedListItem
                  key={profile.username}
                  profile={profile}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedProfiles.length > 0 && (
          <div className="p-4 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)] text-center">
              Share this list with your team
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
}
