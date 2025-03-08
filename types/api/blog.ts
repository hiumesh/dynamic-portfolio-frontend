interface BlogPost {
  id: number;
  title: string;
  cover_image: string;
  tags: string[];
  slug: string;
  publisher_id: string;
  publisher_avatar: string;
  publisher_name: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

type BlogPosts = BlogPost[];

type Blog = {
  body: string;
} & BlogPost;
