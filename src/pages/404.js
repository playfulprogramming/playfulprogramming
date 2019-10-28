import React from "react";
import { graphql } from "gatsby";

import { Layout } from "../components/layout";
import { SEO } from "../components/seo";
import Image from "gatsby-image";
import { OutboundLink } from "gatsby-plugin-google-analytics";

class NotFoundPage extends React.Component {
	render() {
		const { data } = this.props;
		const { title: siteTitle, repoPath } = data.site.siteMetadata;

		return (
			<Layout location={this.props.location} title={siteTitle}>
				<SEO title="404: Not Found" />
				<Image
					fixed={data.file.childImageSharp.fixed}
					imgStyle={{ objectFit: "contain" }}
					style={{ margin: "0 auto", display: "block", width: "100%" }}
					loading={"eager"}
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
		file(relativePath: { eq: "sad_unicorn-2048.png" }) {
			childImageSharp {
				fixed(width: 500, quality: 100) {
					...GatsbyImageSharpFixed
				}
			}
		}
	}
`;
