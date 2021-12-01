import { UnicornInfo } from "./UnicornInfo";

interface PostType {
  slug: string;
  title: string;
  published: string;
  edited?: string;
  coverImage: string;
  authors: UnicornInfo[];
  excerpt: string;
  wordCount: number;
  description?: string;
  series?: string;
  order?: number;
  originalLink?: string;
  content: string;
  tags: string[];
}

export default PostType;
