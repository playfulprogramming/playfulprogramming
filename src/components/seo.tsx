/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";

const mapToMetaArr = map =>
	Array.from(map.entries()).map(([k, v]) => ({
		property: k,
		content: v
	}));

const getBlogPostMetas = (
	unicornData,
	keywords = [],
	publishedTime,
	editedTime
) => {
	if (!unicornData) return [];
	const metas = new Map();

	metas.set("og:type", "article");

	metas.set("article:section", "Technology");
	metas.set("article:author", unicornData.name);

	if (unicornData.socials) {
		const s = unicornData.socials;
		if (s.twitter) {
			metas.set("twitter:creator", `@${s.twitter}`);
		}
	}

	if (publishedTime) metas.set("article:published_time", publishedTime);
	if (editedTime) metas.set("article:modified_time", editedTime);

	return [
		...mapToMetaArr(metas),
		...keywords.map(keyword => ({
			property: "article:tag",
			content: keyword
		}))
	];
};

const getProfileMetas = unicornData => {
	if (!unicornData) return [];
	const metas = new Map();

	metas.set("og:type", "profile");
	metas.set("profile:firstName", unicornData.firstName);
	metas.set("profile:lastName", unicornData.lastName);
	metas.set("profile:username", unicornData.id);

	return mapToMetaArr(metas);
};

function SEO({
	description,
	lang,
	meta,
	title,
	unicornData,
	keywords,
	publishedTime,
	editedTime,
	type
}) {
	const { site } = useStaticQuery(
		graphql`
			query {
				site {
					siteMetadata {
						title
						description
						keywords
						siteUrl
					}
				}
			}
		`
	);

	const siteData = site.siteMetadata;

	const metaDescription = description || siteData.description;
	const metaKeywords = keywords || siteData.keywords;

	const typeMetas =
		type === "article"
			? getBlogPostMetas(unicornData, keywords, publishedTime, editedTime)
			: type === "profile"
			? getProfileMetas(unicornData)
			: [
					{
						property: `og:type`,
						content: "blog"
					}
			  ];

	return (
		<Helmet
			htmlAttributes={{
				lang
			}}
			title={title}
			titleTemplate={`%s | ${siteData.title}`}
			link={[
				{ rel: "icon", href: "/favicon.ico" },
				{ rel: "preconnect", href: "https://www.google.com" },
				{ rel: "preconnect", href: "https://marketingplatform.google.com" }
			]}
			meta={[
				{
					property: `og:url`,
					content: siteData.siteUrl
				},
				{
					property: `og:site_name`,
					content: siteData.title
				},
				{
					property: `name`,
					content: siteData.title
				},
				{
					property: `og:title`,
					content: title
				},
				{
					property: "og:locale",
					content: "en_US"
				},
				{
					name: `twitter:title`,
					content: title
				},
				{
					name: `description`,
					content: metaDescription
				},
				{
					property: `og:description`,
					content: metaDescription
				},
				{
					name: `twitter:description`,
					content: metaDescription
				},
				{
					property: `keywords`,
					content: metaKeywords
				},
				{
					name: `twitter:card`,
					content: `summary_large_image`
				},
				{
					name: "og:image",
					content: "https://unicorn-utterances.com/share-banner.png"
				},
				{
					name: "twitter:image",
					content: "https://unicorn-utterances.com/share-banner.png"
				}
			]
				.concat(meta)
				.concat(typeMetas)}
		/>
	);
}

SEO.defaultProps = {
	lang: `en`,
	meta: [],
	description: ``
};

SEO.propTypes = {
	description: PropTypes.string,
	lang: PropTypes.string,
	meta: PropTypes.arrayOf(PropTypes.object),
	title: PropTypes.string.isRequired
};

export { SEO };
