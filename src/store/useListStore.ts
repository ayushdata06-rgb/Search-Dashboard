import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InfluencerSummary } from '../types';

interface ListState {
  savedProfiles: InfluencerSummary[];
  addProfile: (profile: InfluencerSummary) => void;
  removeProfile: (username: string) => void;
  isInList: (username: string) => boolean;
  clearList: () => void;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      savedProfiles: [],
      addProfile: (profile) => {
        if (get().isInList(profile.username)) return;
        set((state) => ({ savedProfiles: [...state.savedProfiles, profile] }));
      },
      removeProfile: (username) =>
        set((state) => ({
          savedProfiles: state.savedProfiles.filter((p) => p.username !== username),
        })),
      isInList: (username) =>
        get().savedProfiles.some((p) => p.username === username),
      clearList: () => set({ savedProfiles: [] }),
    }),
    { name: 'wobb-saved-list' }
  )
);
