import React from "react";
import { Layout } from "../components/layout";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

const Thanks = (props: any) => {
	const { location, data } = props;
	return (
		<Layout location={location}>
			<GatsbyImage
				alt={""}
				image={data.file.childImageSharp.gatsbyImageData}
				imgStyle={{ objectFit: "contain" }}
				style={{
					margin: "0 auto",
					display: "block",
					width: "calc(100vw - 40px)",
					height: "calc(100vw - 40px)",
					maxWidth: "450px",
					maxHeight: "450px",
					background: "var(--primary)",
					borderRadius: "100%",
				}}
				loading={"eager"}
			/>
			<h1 style={{ textAlign: "center" }}>Thank you for subscribing.</h1>
			<p style={{ textAlign: "center" }}>
				Your subscription is now confirmed. You can expect to receive emails as
				we create new content.
			</p>
		</Layout>
	);
};

export const pageQuery = graphql`
	query ThanksSiteData {
		file(relativePath: { eq: "proud_2048.png" }) {
			childImageSharp {
				gatsbyImageData(layout: FIXED, width: 500, quality: 100)
			}
		}
	}
`;

export default Thanks;
