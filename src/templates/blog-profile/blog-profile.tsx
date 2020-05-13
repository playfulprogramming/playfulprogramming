import React, { useMemo } from "react";
import { graphql } from "gatsby";
import { Layout } from "components/layout";
import { SEO } from "components/seo";
import { ProfileHeader } from "./profile-header";
import {
	SiteInfo,
	UnicornInfo,
	PostInfoListDisplay,
	PageContext
} from "uu-types";
import { PostList } from "components/post-card-list";
import { Pagination } from "components/pagination";
import { PostListProvider } from "constants/post-list-context";
import { FilterSearchBar } from "components/filter-search-bar";
import { WordCount } from "./word-count";

interface BlogProfileProps {
	data: {
		site: {
			siteMetadata: Pick<SiteInfo["siteMetadata"], "title">;
		};
		unicornsJson: UnicornInfo;
		allMarkdownRemark: {
			totalCount: number;
			edges: [
				{
					node: PostInfoListDisplay;
				}
			];
		};
	};
	pageContext: PageContext;
	location: Location;
}

const BlogProfile = (props: BlogProfileProps) => {
	const { pageContext, data: slugData } = props;
	const unicornData = slugData.unicornsJson;
	const posts = slugData.allMarkdownRemark.edges;

	const wordCount = useMemo(() => {
		return posts.reduce(
			(prev, post) =>
				prev + post.node.wordCount.words + post.node.fields.inlineCount,
			0
		);
	}, [posts]);

	return (
		<Layout location={props.location}>
			<SEO
				title={unicornData.name}
				description={unicornData.description}
				unicornsData={[unicornData]}
				type="profile"
				canonicalPath={props.location.pathname}
			/>
			<PostListProvider pageContext={pageContext} posts={posts as any}>
				<ProfileHeader unicornData={unicornData} />
				<main>
					<FilterSearchBar>
						<WordCount
							wordCount={wordCount}
							numberOfArticles={slugData.allMarkdownRemark.totalCount}
						/>
					</FilterSearchBar>
					<PostList
						listAriaLabel={`List of posts written by ${unicornData.name}`}
					/>
				</main>
				<Pagination pageContext={pageContext} />
			</PostListProvider>
		</Layout>
	);
};

export default BlogProfile;

export const pageQuery = graphql`
	query UnicornBySlug($slug: String!) {
		site {
			siteMetadata {
				title
			}
		}
		unicornsJson(id: { eq: $slug }) {
			...UnicornInfo
		}
		allMarkdownRemark(
			filter: {
				frontmatter: { authors: { elemMatch: { id: { eq: $slug } } } }
				fileAbsolutePath: { regex: "/content/blog/" }
			}
			sort: { order: DESC, fields: frontmatter___published }
		) {
			totalCount
			edges {
				node {
					...PostInfoListDisplay
				}
			}
		}
	}
`;
