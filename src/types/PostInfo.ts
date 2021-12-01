import { UnicornInfo } from "./UnicornInfo";
import { LicenseInfo } from "./LicenseInfo";

export interface PostInfo {
  id: string;
  excerpt: string;
  html: string;
  frontmatter: {
    title: string;
    subtitle: string;
    published: string;
    tags: string[];
    edited?: string; // This does not exist currently, but we want it to in the future
    description: string;
    authors: Array<UnicornInfo>;
    license: LicenseInfo;
    originalLink?: string;
  };
  fields: {
    slug: string;
    inlineCount: number;
    headingsWithId: Array<{
      value: string;
      slug: string;
      depth: number;
    }>;
  };
  wordCount: {
    words: number;
  };
}
