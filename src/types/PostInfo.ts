import { UnicornInfo } from "./UnicornInfo";
import { LicenseInfo } from "./LicenseInfo";
import { Languages } from "types/index";
import { MarkdownInstance } from "astro";

export interface PostInfo {
  slug: string;
  locale: Languages;
  Content: MarkdownInstance<never>['Content'];
  title: string;
  published: string;
  edited?: string;
  authors: UnicornInfo[];
  license: LicenseInfo;
  excerpt: string;
  wordCount: number;
  description?: string;
  series?: string;
  collectionSlug?: string | null;
  order?: number;
  originalLink?: string;
  content: string;
  tags: string[];
  translations: Partial<Record<Languages, string>>;
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
