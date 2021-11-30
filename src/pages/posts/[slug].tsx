// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import {getPostBySlug, getAllPosts, postsDirectory} from '../../api/api'
import * as React from 'react';

import markdownToHtml from "../../utils/markdownToHtml";
import {useMarkdownRenderer} from "../../hooks/useMarkdownRenderer";
import 'react-medium-image-zoom/dist/styles.css'

type Props = {
    markdownHTML: string
    slug: string
    postsDirectory: string
    wordCount: number
    seriesPosts: any[]
}

const Post = ({markdownHTML, slug, postsDirectory, wordCount, seriesPosts}: Props) => {
    const result = useMarkdownRenderer({
        markdownHTML,
        slug,
        postsDirectory
    });

    return (
        <>
            <h1>Word count: {wordCount}</h1>
            {JSON.stringify(seriesPosts)}
            <>{result}</>
        </>
    )
}

export default Post

type Params = {
    params: {
        slug: string
    }
}

const seriesPostCacheKey = {};

export async function getStaticProps({params}: Params) {
    const post = getPostBySlug(params.slug, {
        title: true,
        slug: true,
        content: true,
        wordCount: true,
        series: true,
        order: true
    } as const)

    const isStr = (val: any): val is string => typeof val === 'string';
    const markdown = isStr(post.content) ? post.content : '';
    const slug = isStr(post.slug) ? post.slug : '';

    let seriesPosts: any[] = [];
    if (post.series && post.order) {
        const allPosts = getAllPosts({
            title: true,
            slug: true,
            series: true,
            order: true,
        } as const, seriesPostCacheKey)

        seriesPosts = allPosts.filter(filterPost => filterPost.series === post.series).sort(sortPost => Number(sortPost.order) - Number(post.order));
    }

    const markdownHTML = await markdownToHtml(slug, markdown);

    return {
        props: {
            markdownHTML,
            slug: slug,
            postsDirectory,
            wordCount: post.wordCount,
            seriesPosts
        }
    }
}

export async function getStaticPaths() {
    const posts = getAllPosts({'slug': true})

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
