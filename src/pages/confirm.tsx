import React from "react";
import { graphql } from "gatsby";
import { Layout } from "../components/layout";
import Image from "gatsby-image";

const Confirm = (props: any) => {
	const { location, data } = props;
	return (
		<Layout location={location}>
			<Image
				fixed={data.file.childImageSharp.fixed}
				imgStyle={{ objectFit: "contain" }}
				style={{
					margin: "0 auto",
					display: "block",
					width: "500px",
					background: "var(--primary)",
					borderRadius: "50%"
				}}
				loading={"eager"}
			/>
			<h1 style={{ textAlign: "center" }}>Just one more thing...</h1>
			<p style={{ textAlign: "center" }}>
				Thank you for subscribing. You will need to check your inbox and confirm
				your subscription.
			</p>
		</Layout>
	);
};

export const pageQuery = graphql`
	query ConfirmSiteData {
		file(relativePath: { eq: "hello-2048.png" }) {
			childImageSharp {
				fixed(width: 500, quality: 100) {
					...GatsbyImageSharpFixed
				}
			}
		}
	}
`;

export default Confirm;
