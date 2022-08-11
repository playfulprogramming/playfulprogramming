import { UnicornInfo } from "./UnicornInfo";
import { LicenseInfo } from "./LicenseInfo";
import { Languages } from "types/index";
import { MarkdownInstance } from "astro";

export interface RawPostInfo {
  title: string;
  published: string;
  authors: string[];
  tags: string[];
  attached: string[];
  license: string;
  description?: string;
  edited?: string;
  series?: string;
  order?: number;
  originalLink?: string;
}

export interface PostInfo extends RawPostInfo {
  slug: string;
  locale: Languages;
  Content: MarkdownInstance<never>['Content'];
  authorsMeta: UnicornInfo[];
  licenseMeta: LicenseInfo;
  excerpt: string;
  wordCount: number;
  collectionSlug?: string | null;
  translations: Partial<Record<Languages, string>>;
  suggestedArticles: [PostInfo, PostInfo, PostInfo];
  headingsWithId?: Array<{
    // Title value
    value: string;
    // ID
    slug: string;
    depth: number;
  }>;
}