import {getAllPosts} from '../api/api'
import Post from '../types/post'
import React from 'react'
import Link from 'next/link';

type Props = {
    allPosts: Post[]
}

const Index = ({allPosts}: Props) => {
    return (
        <>
            <ul>
                {allPosts.map(
                    post =>
                        <li key={post.slug}>
                            <h2>
                                <Link href={`/posts/[slug]`} as={`/posts/${post.slug}`}>
                                    <a>{post.title}</a>
                                </Link>
                            </h2>
                            <p>{post.published}</p>
                        </li>
                )}
            </ul>
        </>
    )
}

export default Index

export const getStaticProps = async () => {
    let allPosts = getAllPosts([
        'title',
        'published',
        'slug',
        'author',
        'excerpt',
    ])

    // sort posts by date in descending order
    allPosts = allPosts.sort((post1, post2) => {
            const date1 = new Date(post1.published);
            const date2 = new Date(post2.published);
            return (date1 > date2 ? -1 : 1);
        })

    return {
        props: {allPosts},
    }
}
