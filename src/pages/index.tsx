import {getAllPosts} from '../api/api'
import Post from '../types/post'
import React from 'react'
import Link from 'next/link';
import consts from '../utils/constants';

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
                            <p>{post.date}</p>
                        </li>
                )}
            </ul>
        </>
    )
}

export default Index

export const getStaticProps = async () => {
    const allPosts = getAllPosts([
        'title',
        'date',
        'slug',
        'author',
        'excerpt',
    ])

    return {
        props: {allPosts},
    }
}
