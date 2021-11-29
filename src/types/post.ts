import Author from './author'

type PostType = {
  slug: string
  title: string
  published: string
  edited: string
  coverImage: string
  author: Author
  excerpt: string
  wordCount: number;
  ogImage: {
    url: string
  }
  content: string
}

export default PostType
