import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import * as style from "./about.module.scss";
import { GatsbyImage } from "gatsby-plugin-image";
import { SEO } from "components/seo";
import { Layout } from "components/layout";
import { navigate } from "@reach/router";
import { UnicornInfo } from "uu-types";

const getUnicornRoleListItems = (unicornInfo: UnicornInfo) => {
	const unicornRoles = unicornInfo.roles.slice(0);

	if (unicornInfo.fields.isAuthor) {
		unicornRoles.push({
			id: "author",
			prettyname: "Author",
		});
	}

	return unicornRoles.map((role, i, arr) => {
		// If there is an item ahead
		const shouldShowComma = arr[i + 1];
		return (
			<li key={role.id} role="listitem">
				{role.prettyname}
				{shouldShowComma && <span aria-hidden={true}>,&nbsp;</span>}
			</li>
		);
	});
};

const AboutUs = (props: any) => {
	const {
		file,
		markdownRemark: post,
		site,
		allUnicornsJson: unicorns,
	} = useStaticQuery(graphql`
		query AboutUsQuery {
			site {
				siteMetadata {
					title
				}
			}
			markdownRemark(fields: { slug: { eq: "/about-us/" } }) {
				id
				excerpt(pruneLength: 160)
				html
				frontmatter {
					title
					description
				}
			}
			file(relativePath: { eq: "unicorn_head_1024.png" }) {
				childImageSharp {
					gatsbyImageData(layout: FIXED, width: 192, quality: 100)
				}
			}
			allUnicornsJson {
				nodes {
					...UnicornInfo
				}
			}
		}
	`);

	const {
		siteMetadata: { title: siteTitle },
	} = site;
	const { nodes: unicornArr } = unicorns as { nodes: UnicornInfo[] };
	const {
		childImageSharp: { gatsbyImageData: imageFixed },
	} = file;

	return (
		<Layout location={props.location}>
			<SEO
				title={post.frontmatter.title}
				description={post.frontmatter.description || post.excerpt}
				pathName={props.location.pathname}
			/>
			<div className={style.container}>
				<div className={style.headerTitle}>
					<GatsbyImage
						image={imageFixed}
						loading={"eager"}
						alt={"Unicorn Utterances logo"}
					/>
					<h1>About Us</h1>
				</div>
				<main className={`${style.aboutBody} post-body`}>
					<div dangerouslySetInnerHTML={{ __html: post.html }} />
					{unicornArr.map((unicornInfo) => {
						const roleListItems = getUnicornRoleListItems(unicornInfo);

						const navigateToUni = () => navigate(`/unicorns/${unicornInfo.id}`);

						return (
							<div key={unicornInfo.id} className={style.contributorContainer}>
								<div className="pointer" onClick={navigateToUni}>
									<GatsbyImage
										alt={unicornInfo.name + " profile picture"}
										className="circleImg"
										image={unicornInfo.profileImg.childImageSharp.mediumPic}
									/>
								</div>
								<div className={style.nameRoleDiv}>
									<Link to={`/unicorns/${unicornInfo.id}`}>
										{unicornInfo.name}
									</Link>
									<ul
										aria-label="Roles assigned to this user"
										className={style.rolesList}
										role="list"
									>
										{roleListItems}
									</ul>
								</div>
							</div>
						);
					})}
				</main>
			</div>
		</Layout>
	);
};

export default AboutUs;
