import {UnicornInfo} from "./UnicornInfo";

type PostType = {
  slug: string
  title: string
  published: string
  edited: string
  coverImage: string
  authors: UnicornInfo[]
  excerpt: string
  wordCount: number;
  series?: string;
  order?: number;
  ogImage: {
    url: string
  }
  content: string
}

export default PostType
