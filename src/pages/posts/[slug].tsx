// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import {getPostBySlug, getAllPosts, postsDirectory} from '../../api/api'
import * as React from 'react';

import markdownToHtml from "../../utils/markdownToHtml";
import {useMarkdownRenderer} from "../../hooks/useMarkdownRenderer";

type Props = {
    markdownHTML: string
    slug: string
    postsDirectory: string
}

const Post = ({markdownHTML, slug, postsDirectory}: Props) => {
    const result = useMarkdownRenderer({
        markdownHTML,
        slug,
        postsDirectory
    });

    return (
        <>{result}</>
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

    const markdownHTML = await markdownToHtml(post.slug, markdown);

    return {
        props: {
            markdownHTML,
            slug: post.slug,
            postsDirectory
        }
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
