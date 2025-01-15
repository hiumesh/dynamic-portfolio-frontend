interface Portfolio {
  user_id: string;
  status: string;
  basic_details: {
    email: string;
    name?: string;
    avatar?: string;
    slug?: string;
    about?: string;
    tagline?: string;
    college?: string;
    graduation_year?: string;
    work_domains?: string[];
    social_profiles?: { platform: string; url: string }[];
  };
  skills?: string[];
  additional_details: {
    hackathon_metadata?: {
      heading?: string;
      description?: string;
      count?: number;
    };
    work_gallery_metadata?: {
      heading?: string;
      description?: string;
      count?: number;
    };
    work_experience_metadata?: {
      heading?: string;
      description?: string;
      count?: number;
    };
    education_metadata?: {
      heading?: string;
      description?: string;
      count?: number;
    };
    certification_metadata?: {
      heading?: string;
      description?: string;
      count?: number;
    };
    blog_metadata: {
      heading?: string;
      description?: string;
      count?: number;
    };
  };
}
