import { UnicornInfo } from "./UnicornInfo";
import { LicenseInfo } from "./LicenseInfo";

interface PostType {
  slug: string;
  title: string;
  published: string;
  edited?: string;
  coverImage: string;
  authors: UnicornInfo[];
  license: LicenseInfo;
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
