import React, { useContext, useState, useEffect } from "react";
import { graphql } from "gatsby";
import GitHubIcon from "assets/icons/github.svg";
import CommentsIcon from "assets/icons/message.svg";
import { DiscussionEmbed } from "disqus-react";

import { Layout } from "components/layout";
import { SEO } from "components/seo";
import { PostMetadata } from "./post-metadata";
import { PostTitleHeader } from "./post-title-header";
import { OutboundLink } from "gatsby-plugin-google-analytics";
import { ThemeContext } from "constants/theme-context";
import { SiteInfo, PostInfo } from "uu-types";
import { TableOfContents } from "components/table-of-contents";
import { BlogPostLayout } from "components/blog-post-layout";
import { MailingList } from "components/mailing-list";

const BlogPostTemplateChild = (props: BlogPostTemplateProps) => {
	const post = props.data.markdownRemark;
	const siteData = props.data.site.siteMetadata;
	const slug = post.fields.slug;

	const { colorMode } = useContext(ThemeContext);

	const [disqusConfig, setDisqusConfig] = useState({
		url: `${siteData.siteUrl}/posts${slug}`,
		identifier: slug,
		title: post.frontmatter.title,
	});

	/**
	 * Toggle the Disqus theme
	 * Disqus will by default try to guess what theme to pick based on the
	 * color of the background. As a result, we don't have to do much other than
	 * reload it after the page theme change is finished
	 */
	useEffect(() => {
		setTimeout(() => {
			if (!setDisqusConfig || !colorMode) return;
			setDisqusConfig({
				url: `${siteData.siteUrl}/posts${slug}`,
				// TODO: Fix this, this is causing comments to not apply to the correct
				//   post. This identifier should NEVER change and should ALWAYS match
				//   `slug` only
				identifier: slug,
				title: post.frontmatter.title,
			});
			// Must use a `useTimeout` so that this reloads AFTER the background animation
		}, 600);
	}, [colorMode, post.frontmatter.title, siteData.siteUrl, slug]);

	const GHLink = `https://github.com/${siteData.repoPath}/tree/master${siteData.relativeToPosts}${slug}index.md`;

	return (
		<>
			<SEO
				title={post.frontmatter.title}
				description={post.frontmatter.description || post.excerpt}
				unicornsData={post.frontmatter.authors}
				publishedTime={post.frontmatter.published}
				editedTime={post.frontmatter.edited}
				keywords={post.frontmatter.tags}
				type="article"
				canonicalPath={props.location.pathname}
			/>
			<article>
				<BlogPostLayout
					left={<TableOfContents headingsWithId={post.fields.headingsWithId} />}
					center={
						<>
							<header role="banner" className="marginZeroAutoChild">
								<PostTitleHeader post={post} />
								<PostMetadata post={post} />
							</header>
							<main
								className="post-body"
								data-testid={"post-body-div"}
								dangerouslySetInnerHTML={{ __html: post.html }}
							/>
						</>
					}
				/>
				<footer role="contentinfo" className="post-lower-area">
					<div>
						<a
							aria-label={`Post licensed with ${post.frontmatter.license.displayName}`}
							href={post.frontmatter.license.explainLink}
							style={{ display: "table", margin: "0 auto" }}
						>
							<img
								src={post.frontmatter.license.footerImg}
								alt={post.frontmatter.license.licenceType}
							/>
						</a>
					</div>
					<MailingList />
					<div className="postBottom">
						<div className="btnLike prependIcon">
							<CommentsIcon />
							<p>Comments</p>
						</div>

						<OutboundLink className="baseBtn prependIcon" href={GHLink}>
							<GitHubIcon />
							View this Post on GitHub
						</OutboundLink>

						{/*<button className="baseBtn appendIcon" type="button">*/}
						{/*  Share this Post*/}
						{/*  <ShareIcon/>*/}
						{/*</button>*/}
					</div>
					<DiscussionEmbed
						shortname={siteData.disqusShortname}
						config={disqusConfig}
						key={colorMode}
					/>
				</footer>
			</article>
		</>
	);
};

interface BlogPostTemplateProps {
	data: {
		site: SiteInfo;
		markdownRemark: PostInfo;
	};
	location: Location;
}
const BlogPostTemplate = (props: BlogPostTemplateProps) => {
	return (
		<Layout location={props.location}>
			<BlogPostTemplateChild {...props} />
		</Layout>
	);
};

export default BlogPostTemplate;

export const pageQuery = graphql`
	query BlogPostBySlug($slug: String!) {
		site {
			siteMetadata {
				title
				siteUrl
				disqusShortname
				repoPath
				relativeToPosts
			}
		}
		markdownRemark(fields: { slug: { eq: $slug } }) {
			...PostInfo
		}
	}
`;
