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
    skills: string[];
    hackathon_metadata?: {
      heading?: string;
      description?: string;
    };
  };
  created_at: string;
}

interface UserEducation {
  id: number;
  order_index: number;
  type: "SCHOOL" | "COLLEGE";
  institute_name: string;
  grade: string;
  attributes: null | {
    degree?: string;
    class?: "X" | "XII";
    passing_year?: string;
    field_of_study?: string;
    start_year?: string;
    end_year?: string;
  };
}

type UserEducations = UserEducation[];

interface UserWorkExperience {
  id: number;
  order_index: number;
  company_name: string;
  company_url: string;
  job_type: "FULL_TIME" | "PART_TIME" | "SEMI_FULL_TIME" | "INTERN";
  job_title: string;
  location: string;
  start_date: string;
  end_date?: string;
  description: string[];
  skills_used: string[];
  certificate_link?: string;
}

type UserWorkExperiences = UserWorkExperience[];

interface UserCertification {
  id: number;
  order_index: number;
  title: string;
  description: string[];
  completion_date: string;
  certificate_link?: string;
  skills_used: string[];
}

type UserCertifications = UserCertification[];

interface PostPresignedUrl {
  file_name: string;
  key: string;
  url: string;
}

type PostPresignedUrls = PostPresignedUrl[];

interface FileObject {
  file_name: string;
  key: string;
  url: string;
  file?: File;
}

type FileObjects = FileObject[];

interface UserHackathon {
  id: number;
  order_index: number;
  title: string;
  avatar: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  certificate_link?: string;
  attributes: null | {
    links: {
      platform: string;
      label: string;
      url: string;
    }[];
  };
}

type UserHackathons = UserHackathon[];
