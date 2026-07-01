import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InfluencerSummary } from '../types';

interface ListState {
  savedProfiles: InfluencerSummary[];
  addProfile: (profile: InfluencerSummary) => void;
  removeProfile: (username: string) => void;
  isInList: (username: string) => boolean;
  clearList: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  featuredPage: number;
  setFeaturedPage: (page: number) => void;
  platformPages: Record<string, number>;
  setPlatformPage: (platform: string, page: number) => void;
  shuffledCreators: any[];
  setShuffledCreators: (creators: any[]) => void;
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
      currentPage: 1,
      setCurrentPage: (page) => set({ currentPage: page }),
      featuredPage: 1,
      setFeaturedPage: (page) => set({ featuredPage: page }),
      platformPages: {},
      setPlatformPage: (platform, page) =>
        set((state) => ({ platformPages: { ...state.platformPages, [platform]: page } })),
      shuffledCreators: [],
      setShuffledCreators: (creators) => set({ shuffledCreators: creators }),
    }),
    { 
      name: 'wobb-saved-list',
      version: 1,
      partialize: (state) => {
        // Exclude shuffledCreators from localStorage so it gets fresh data on hard reload
        // but survives navigation within the same session.
        const { ...rest } = state;
        return {
          ...rest,
          shuffledCreators: [] 
        };
      }
    }
  )
);
