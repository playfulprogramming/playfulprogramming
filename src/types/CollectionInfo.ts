import { UnicornInfo } from "./UnicornInfo";
import { PostInfo } from "types/PostInfo";

export interface CollectionInfo {
  slug: string;
  title: string;
  authors: UnicornInfo[];
  description: string;
  associatedSeries: string;
  coverImg: {
    height: number;
    width: number;
    relativePath: string;
  };
  posts: Pick<
    PostInfo,
    "description" | "excerpt" | "title" | "order" | "series"
  >[];
  content: string;
  buttons: Array<{ text: string; url: string }>;
}
