import { useState, useEffect } from 'react';
import type { Platform, SearchData, UserProfileSummary } from '../types';

export function useInfluencerSearch(platform: Platform) {
  const [data, setData] = useState<UserProfileSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [prevPlatform, setPrevPlatform] = useState(platform);

  if (platform !== prevPlatform) {
    setPrevPlatform(platform);
    setData([]);
    setLoading(true);
  }

  useEffect(() => {
    let active = true;

    import(`../assets/data/search/${platform}.json`)
      .then((mod: { default: SearchData }) => {
        if (!active) return;
        const searchData = mod.default;
        const profiles = searchData.accounts.map(
          (item) => item.account.user_profile
        );
        setData(profiles);
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
  }, [platform]);

  return { data, loading };
}
