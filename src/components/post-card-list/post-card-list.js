import React, { useState } from "react"
import listStyle from "./post-card-list.module.scss"
import { PostCard } from "../post-card"
import { FilterSearchBar } from "../filter-search-bar"

export const PostList = ({ posts = [], showWordCount = false, numberOfArticles, wordCount, tags }) => {
  // FIXME: This will not suffice with pagination added
  const [filtered, setFiltered] = useState(null)
  const [searched, setSearched] = useState(null)

  return (
    <div>
      <FilterSearchBar tags={tags}
                       showWordCount={showWordCount}
                       wordCount={wordCount}
                       numberOfArticles={numberOfArticles}
                       onFilter={val => setFiltered(val && val.map(v => v.slug))}
      onSearch={val => setSearched(val && val.map(v => v.slug))}/>
      <div className={listStyle.postsListContainer}>
        {posts.map(({ node }) => {
          const slug = node.fields.slug;
          if (
            (filtered && !filtered.includes(slug)) ||
            (searched && !searched.includes(slug))
          ) {
            return null
          }

          const title = node.frontmatter.title || slug
          return (
            <PostCard
              slug={node.fields.slug}
              className={listStyle.postListItem}
              key={node.fields.slug}
              excerpt={node.excerpt}
              title={title}
              author={node.frontmatter.author}
              published={node.frontmatter.published}
              tags={node.frontmatter.tags}
              description={node.frontmatter.description}
            />
          )
        })}
      </div>
    </div>
  )
}

