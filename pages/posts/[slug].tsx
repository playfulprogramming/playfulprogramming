import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import {getPostBySlug, getAllPosts, postsDirectory} from '../../lib/api'
import { serialize } from "next-mdx-remote/serialize";
// TODO: Type
import imageSize from "rehype-img-size";
import {PostRenderer} from "../../components/PostRenderer";
import remarkImages from "remark-images";
import {join} from "path";

type Props = {
  compiledSource: string
}

const Post = ({  compiledSource }: Props) => {
  // const router = useRouter()
  // if (!router.isFallback) {
  //   return <ErrorPage statusCode={404} />
  // }
  return (
      // <p>test</p>
    <PostRenderer post={compiledSource} />
  )
}

export default Post

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'slug',
    'content'
  ])
  const markdown = post.content || '';

  // pass your markdown string to the serialize function
  const {compiledSource} = await serialize(markdown, {
    mdxOptions: {
      // use the image size plugin, you can also specify which folder to load images from
      // in my case images are in /public/images/, so I just prepend 'public'
      // rehypePlugins: [[imageSize, { dir: "public" }]],
      remarkPlugins: [remarkImages],
      filepath: join(postsDirectory, post.slug)
    },
  });

  return {
    props: {
        compiledSource,
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  console.log(posts)

  const paths = posts.map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    }
  });

  return {
    paths,
    fallback: false,
  }
}
