// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import {getPostBySlug, getAllPosts, postsDirectory} from '../../lib/api'
import * as React from 'react';

import markdownToHtml from "../../lib/markdownToHtml";
import reactRehyped from "rehype-react";
import Image, {ImageProps} from "next/image";
import {join} from "path";
import {unified} from "unified";
import rehypeParse from "rehype-parse";

type Props = {
    compiledSource: string
    slug: string
    postsDirectory: string
}

const Post = ({compiledSource, slug, postsDirectory}: Props) => {
    // const router = useRouter()
    // if (!router.isFallback) {
    //   return <ErrorPage statusCode={404} />
    // }
    const result = React.useMemo(() => unified()
        .use(rehypeParse)

        .use(reactRehyped, {
        createElement: React.createElement,
        components: {
            img: (imgProps: unknown) => {
                const {src, ...props2} = imgProps as ImageProps;
                const imagePath = join(postsDirectory, slug, src as string);
                const beResponsive = props2.height && props2.width;
                return (
                    <Image
                        src={imagePath}
                        {...props2}
                        layout={beResponsive ? "responsive" : "fill"}
                        loading="lazy"
                    />
                )
            }
        }
    }).processSync(compiledSource).result, [compiledSource, slug, postsDirectory]);

    return (
        <>{result}</>
        // <div dangerouslySetInnerHTML={{__html: compiledSource}} />
        // <p>test</p>
        // <PostRenderer post={{slug}} compiledSource={compiledSource} postsDirectory={postsDirectory}/>
    )
}

export default Post

type Params = {
    params: {
        slug: string
    }
}

export async function getStaticProps({params}: Params) {
    const post = getPostBySlug(params.slug, [
        'title',
        'slug',
        'content'
    ])
    const markdown = post.content || '';

    const compiledSource = await markdownToHtml(post.slug, markdown);

    return {
        props: {
            compiledSource,
            slug: post.slug,
            postsDirectory
        },
    }
}

export async function getStaticPaths() {
    const posts = getAllPosts(['slug'])

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
