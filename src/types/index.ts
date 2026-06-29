export type Platform = 'instagram' | 'youtube' | 'tiktok';

export interface UserProfileSummary {
  user_id: string;
  username?: string;
  custom_name?: string;
  handle?: string;
  sec_uid?: string;
  url: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  account_type?: number;
  followers: number;
  engagements?: number;
  engagement_rate?: number;
  avg_views?: number;
}

export interface SearchAccount {
  account: {
    user_profile: UserProfileSummary;
    audience_source: string;
  };
  match?: Record<string, unknown>;
  search_result_id?: string;
}

export interface SearchData {
  total: number;
  accounts: SearchAccount[];
}

export interface FullUserProfile extends UserProfileSummary {
  type?: string;
  description?: string;
  is_business?: boolean;
  is_hidden?: boolean;
  gender?: string;
  age_group?: string;
  language?: {
    code: string;
    name: string;
  };
  posts_count?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_reels_plays?: number;
  avg_shares?: number;
  avg_saves?: number;
  avg_dislikes?: number;
  total_likes?: number;
  total_views?: number;
  stat_history?: StatHistoryEntry[];
}

export interface StatHistoryEntry {
  month: string;
  followers: number;
  following?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_views?: number;
  avg_dislikes?: number;
  avg_shares?: number;
  avg_saves?: number;
  total_likes?: number;
  total_views?: number;
}

export interface ProfileDetailResponse {
  cached?: boolean;
  contact?: {
    showEmail: boolean;
    showPhone: boolean;
    email?: string;
    phone?: string | null;
  };
  data: {
    success: boolean;
    version?: string;
    report_info?: {
      report_id: string;
      created: string;
      profile_updated: string;
    };
    user_profile: FullUserProfile;
  };
}

export interface InfluencerSummary {
  username: string;
  fullName: string;
  platform: Platform;
  followers: number;
  engagementRate: number;
  avatarUrl: string;
  isVerified: boolean;
}
