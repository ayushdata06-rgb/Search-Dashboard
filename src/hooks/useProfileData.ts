import { useState, useEffect } from 'react';
import type { ProfileDetailResponse, FullUserProfile } from '../types';
import { useGlobalSearch } from './useGlobalSearch';

export function useProfileData(username: string | undefined) {
  const [data, setData] = useState<FullUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prevUsername, setPrevUsername] = useState(username);
  
  const [jsonFailed, setJsonFailed] = useState(false);
  const { data: globalProfiles, loading: globalLoading } = useGlobalSearch();

  if (username !== prevUsername) {
    setPrevUsername(username);
    setData(null);
    setJsonFailed(false);
    if (!username) {
      setError('No username provided');
      setLoading(false);
    } else {
      setError(null);
      setLoading(true);
    }
  }

  useEffect(() => {
    if (!username || username !== prevUsername) return;

    let active = true;

    import(`../assets/data/profiles/${username}.json`)
      .then((mod: { default: ProfileDetailResponse }) => {
        if (!active) return;
        const response = mod.default;
        if (response?.data?.user_profile) {
          setData(response.data.user_profile);
        } else {
          setError('Invalid profile data');
        }
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setJsonFailed(true);
      });
      
    return () => {
      active = false;
    };
  }, [username, prevUsername]);

  useEffect(() => {
    if (jsonFailed && !globalLoading && username) {
      const fallbackProfile = globalProfiles.find(p => (p.username ?? p.handle ?? p.custom_name ?? p.user_id) === username);
      if (fallbackProfile) {
        setData({
          ...fallbackProfile,
          description: "Info not available",
          recent_posts: [],
          url: "",
          is_verified: fallbackProfile.is_verified ?? false,
          avg_likes: 0,
          avg_comments: 0,
          avg_views: fallbackProfile.avg_views ?? 0,
        } as FullUserProfile);
        setError(null);
      } else {
        setError('Profile not found');
      }
      setLoading(false);
    }
  }, [jsonFailed, globalLoading, username, globalProfiles]);

  return { data, loading, error };
}
