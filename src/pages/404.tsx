import React from "react";
import { graphql } from "gatsby";

import { GatsbyImage } from "gatsby-plugin-image";
import { SEO } from "components/seo";
import { Layout } from "components/layout";
import { OutboundLink } from "gatsby-plugin-google-analytics";

class NotFoundPage extends React.Component {
	render() {
		const { data } = this.props as any;
		const location = (this.props as any).location;
		const { repoPath } = data.site.siteMetadata;

		return (
			<Layout location={location}>
				<SEO title="404: Not Found" canonicalPath={location.pathname} />
				<GatsbyImage
					image={data.file.childImageSharp.gatsbyImageData}
					imgStyle={{ objectFit: "contain" }}
					style={{ margin: "0 auto", display: "block", width: "100%" }}
					loading={"eager"}
					alt={`Unicorn Utterances 404 image`}
				/>
				<h1 style={{ textAlign: "center" }}>
					We're Sorry, We Don't Understand
				</h1>
				<p style={{ textAlign: "center" }}>
					We don't quite understand where you're trying to go! We're really
					sorry about this!
					<br />
					Maybe the URL has a typo in it or we've configured something wrong!
					<br />
					<OutboundLink href={`https://github.com/${repoPath}/issues`}>
						If you really think it might be something we did, let us know!
					</OutboundLink>
				</p>
			</Layout>
		);
	}
}

export default NotFoundPage;

export const pageQuery = graphql`
	query {
		site {
			siteMetadata {
				title
				repoPath
			}
		}
		file(relativePath: { eq: "sad_unicorn_2048.png" }) {
			childImageSharp {
				gatsbyImageData(layout: FIXED, width: 500, quality: 100)
			}
		}
	}
`;
