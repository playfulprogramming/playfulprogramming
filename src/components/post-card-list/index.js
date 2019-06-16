import React from "react"
import listStyle from "./style.module.css"
import PostCard from "../post-card"
import FilterSearchBar from "../filter-search-bar"

class PostList extends React.Component {
  render() {
    /**
     * overwriteAuthorInfo is a needed evil for now:
     * @see https://github.com/gatsbyjs/gatsby/issues/14827
     */
    const { posts = [], showWordCount = false, overwriteAuthorInfo} = this.props

    return (
      <div>

        <FilterSearchBar showWordCount={showWordCount}/>

        <div className={listStyle.postsListContainer}>
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <PostCard
                slug={node.fields.slug}
                className={listStyle.postListItem}
                key={node.fields.slug}
                excerpt={node.excerpt}
                title={title}
                author={overwriteAuthorInfo || node.frontmatter.author}
                date={node.frontmatter.date}
                tags={node.frontmatter.tags}
                description={node.frontmatter.description}
              />
            )
          })}
        </div>
      </div>
    )
  }
}

export default PostList
