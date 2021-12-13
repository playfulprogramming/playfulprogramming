import { UnicornInfo } from "./UnicornInfo";
import { LicenseInfo } from "./LicenseInfo";

export interface PostInfo {
  slug: string;
  title: string;
  published: string;
  edited?: string;
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

export interface RenderedPostInfo {
  headingsWithId?: Array<{
    // Title value
    value: string;
    // ID
    slug: string;
    depth: number;
  }>;
}
