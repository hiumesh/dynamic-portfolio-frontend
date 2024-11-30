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
