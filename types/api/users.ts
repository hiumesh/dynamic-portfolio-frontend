interface UserProfile {
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  slug: string;
  status: string;
  attributes: null | {
    college?: string;
    graduation_year?: string;
    work_domains?: string[];
    social_profiles?: { platform: string; url: string }[];
  };
  created_at: string;
}
