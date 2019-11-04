import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
import { Layout } from "../components/layout/layout";
import { SEO } from "../components/seo";
import Image from "gatsby-image";
import style from "./about.module.scss";
import { navigate } from "@reach/router";

const getUnicornRoleListItems = unicornInfo => {
	const unicornRoles = unicornInfo.roles.slice(0);

	if (unicornInfo.fields.isAuthor) {
		unicornRoles.push({
			id: "author",
			prettyname: "Author"
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

const AboutUs = props => {
	const {
		data: { markdownRemark }
	} = props;

	const {
		file,
		markdownRemark: post,
		site,
		allUnicornsJson: unicorns
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
			file(relativePath: { eq: "unicorn-head-1024.png" }) {
				childImageSharp {
					fixed(width: 192, quality: 100) {
						...GatsbyImageSharpFixed
					}
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
		siteMetadata: { title: siteTitle }
	} = site;
	const { nodes: unicornArr } = unicorns;
	const {
		childImageSharp: { fixed: imageFixed }
	} = file;

	return (
		<Layout location={props.location} title={siteTitle}>
			<SEO
				title={post.frontmatter.title}
				description={post.frontmatter.description || post.excerpt}
			/>
			<div className={style.container}>
				<div className={style.headerTitle}>
					<Image fixed={imageFixed} loading={"eager"} />
					<h1>About Us</h1>
				</div>
				<main className={`${style.aboutBody} post-body`}>
					<div dangerouslySetInnerHTML={{ __html: markdownRemark.html }} />
					{unicornArr.map(unicornInfo => {
						const roleListItems = getUnicornRoleListItems(unicornInfo);

						const navigateToUni = () => navigate(`/unicorns/${unicornInfo.id}`);

						return (
							<div key={unicornInfo.id} className={style.contributorContainer}>
								<div className="pointer" onClick={navigateToUni}>
									<Image
										className="circleImg"
										fixed={unicornInfo.profileImg.childImageSharp.mediumPic}
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
