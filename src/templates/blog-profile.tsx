import React, { useMemo } from "react";
import { graphql } from "gatsby";
import { Layout } from "../components/layout";
import { SEO } from "../components/seo";
import { PicTitleHeader } from "../components/pic-title-header";
import { PostListLayout } from "../components/post-list-layout";
import {
	SiteInfo,
	UnicornInfo,
	PostInfoListDisplay,
	PageContext
} from "../types";

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
				unicornData={unicornData}
				type="profile"
			/>
			<PostListLayout
				pageContext={pageContext}
				numberOfArticles={slugData.allMarkdownRemark.totalCount}
				showWordCount={true}
				unicornData={unicornData}
				wordCount={wordCount}
				posts={posts as any}
			>
				<PicTitleHeader
					image={unicornData.profileImg.childImageSharp.bigPic as any}
					title={unicornData.name}
					description={unicornData.description}
					profile={true}
					socials={unicornData.socials}
				/>
			</PostListLayout>
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
