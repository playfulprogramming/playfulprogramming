import { UnicornInfo } from "./UnicornInfo";
import { PostInfo } from "types/PostInfo";

export interface CollectionInfo {
  slug: string;
  title: string;
  authors: UnicornInfo[];
  description: string;
  associatedSeries: string;
  published: string;
  isbn?: string;
  type?: "book";
  coverImg: {
    height: number;
    width: number;
    relativePath: string;
  };
  socialImg?: string;
  posts: Pick<
    PostInfo,
    | "description"
    | "excerpt"
    | "title"
    | "order"
    | "series"
    | "slug"
    | "authors"
    | "content"
  >[];
  content: string;
  buttons: Array<{ text: string; url: string }>;
  chapterList?: Array<{
    title: string;
    description: string;
    order: string;
  }>;
  aboveFoldMarkdown?: string;
}
