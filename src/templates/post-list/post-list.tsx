import React from "react";
import { graphql, Link } from "gatsby";

import { Layout } from "components/layout";
import { SEO } from "components/seo";
import { PostListHeader } from "./post-list-header";
import { PostListLayout } from "components/post-list-layout";
import { PageContext } from "uu-types";

interface BlogPostListTemplateProps {
	data: any;
	pageContext: PageContext;
	location: Location;
}
const BlogPostListTemplate = (props: BlogPostListTemplateProps) => {
	const { data, pageContext } = props;
	const { pageIndex } = pageContext;
	const posts = data.allMarkdownRemark.edges;

	const SEOTitle = pageIndex === 1 ? "Homepage" : `Post page ${pageIndex}`;

	return (
		<Layout location={props.location}>
			<SEO title={SEOTitle} />
			<div>
				<PostListLayout posts={posts} pageContext={pageContext}>
					<PostListHeader
						image={data.file.childImageSharp.fixed}
						siteMetadata={data.site.siteMetadata}
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
			inlineCount
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
		file(relativePath: { eq: "unicorn_utterances_logo_512.png" }) {
			childImageSharp {
				fixed(width: 300, quality: 100) {
					...GatsbyImageSharpFixed
				}
			}
		}
	}
`;
