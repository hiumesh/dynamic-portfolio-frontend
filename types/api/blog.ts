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

interface BlogComment {
  id: number;
  parent_id: number;
  body: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  attributes: null | {
    replies_count?: number;
    reaction_metadata?: {
      clap?: number;
      like?: number;
      heart?: number;
    };
  };
  reactions: string[];
  created_at: string;
  updated_at: string;
}

type BlogComments = BlogComment[];
