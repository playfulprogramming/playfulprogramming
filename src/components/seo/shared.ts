import { Languages, UnicornInfo } from "../../types";

export interface SEOProps {
  description?: string;
  langData?: {
    currentLang: Languages;
    otherLangs: Languages[];
  };
  title: string;
  unicornsData?: UnicornInfo[];
  keywords?: string[];
  publishedTime?: string;
  editedTime?: string;
  type?: "article" | "profile" | "book";
  pathName?: string;
  canonical?: string;
  isbn?: string;
  shareImage?: string;
}
