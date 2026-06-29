import { useState, useEffect } from 'react';
import type { ProfileDetailResponse, FullUserProfile } from '../types';

export function useProfileData(username: string | undefined) {
  const [data, setData] = useState<FullUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prevUsername, setPrevUsername] = useState(username);

  if (username !== prevUsername) {
    setPrevUsername(username);
    setData(null);
    if (!username) {
      setError('No username provided');
      setLoading(false);
    } else {
      setError(null);
      setLoading(true);
    }
  }

  useEffect(() => {
    if (!username) return;

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
        setError('Profile not found');
        setLoading(false);
      });
      
    return () => {
      active = false;
    };
  }, [username]);

  return { data, loading, error };
}
