import { useState, useEffect } from 'react';
import type { Platform, SearchData, UserProfileSummary } from '../types';

export interface GlobalProfile extends UserProfileSummary {
  platform: Platform;
}

export function useGlobalSearch() {
  const [data, setData] = useState<GlobalProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      import('../assets/data/search/instagram.json').then((mod) => ({ p: 'instagram' as Platform, data: mod.default as SearchData })),
      import('../assets/data/search/youtube.json').then((mod) => ({ p: 'youtube' as Platform, data: mod.default as SearchData })),
      import('../assets/data/search/tiktok.json').then((mod) => ({ p: 'tiktok' as Platform, data: mod.default as SearchData })),
    ])
      .then((results) => {
        if (!active) return;
        const allProfiles: GlobalProfile[] = [];
        for (const res of results) {
          const profiles = res.data.accounts.map((item) => ({
            ...item.account.user_profile,
            platform: res.p,
          }));
          allProfiles.push(...profiles);
        }
        setData(allProfiles);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setData([]);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}
