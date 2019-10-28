import React, { useMemo, useState } from "react";
import { graphql, Link, navigate } from "gatsby";

import ReactPaginate from "react-paginate";

import { Layout } from "../components/layout";
import { SEO } from "../components/seo";
import { PicTitleHeader } from "../components/pic-title-header";
import { PostList } from "../components/post-card-list";
import { getSkippedPosts } from "../utils/handle-post-list";
import { usePostTagsFromNodes } from "../components/search-and-filter-context";
import { PostListLayout } from "../components/post-list-layout";

const BlogPostListTemplate = props => {
	const { data, pageContext } = props;
	const { pageIndex } = pageContext;
	const siteTitle = data.site.siteMetadata.title;
	const posts = data.allMarkdownRemark.edges;

	const Description = (
		<>
			{data.site.siteMetadata.description}
			<br />
			<Link to={"/about"} aria-label={"The about us page"}>
				<span aria-hidden={true}>Read More</span>
			</Link>
		</>
	);

	const SEOTitle = pageIndex === 1 ? "Homepage" : `Post page ${pageIndex}`;

	return (
		<Layout location={props.location} title={siteTitle}>
			<SEO title={SEOTitle} />
			<div>
				<PostListLayout posts={posts} pageContext={pageContext}>
					<PicTitleHeader
						image={data.file.childImageSharp.fixed}
						title="Unicorn Utterances"
						description={Description}
					/>
				</PostListLayout>
			</div>
		</Layout>
	);
};

export default BlogPostListTemplate;

export const postInfoListDisplayFragmentQuery = graphql`
	fragment PostInfoListDisplay on MarkdownRemark {
		id
		excerpt(pruneLength: 160)
		frontmatter {
			title
			published(formatString: "MMMM DD, YYYY")
			tags
			description
			authors {
				name
				id
				color
				profileImg {
					childImageSharp {
						smallPic: fixed(width: 60) {
							...GatsbyImageSharpFixed
						}
					}
				}
			}
		}
		fields {
			slug
		}
		wordCount {
			words
		}
	}
`;

export const pageQuery = graphql`
	query BlogListPageQuery {
		site {
			siteMetadata {
				title
				description
			}
		}
		allMarkdownRemark(
			sort: { fields: [frontmatter___published], order: DESC }
			filter: { fileAbsolutePath: { regex: "/content/blog/" } }
		) {
			edges {
				node {
					...PostInfoListDisplay
				}
			}
		}
		file(relativePath: { eq: "unicorn-utterances-logo-512.png" }) {
			childImageSharp {
				fixed(width: 300, quality: 100) {
					...GatsbyImageSharpFixed
				}
			}
		}
	}
`;
