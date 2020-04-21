/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import Helmet, { HelmetProps } from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";
import { UnicornInfo } from "uu-types";

type MapToMetaMap = Map<
	JSX.IntrinsicElements["meta"]["property"],
	JSX.IntrinsicElements["meta"]["content"]
>;

type MapToMeta = {
	property: JSX.IntrinsicElements["meta"]["property"];
	content: JSX.IntrinsicElements["meta"]["content"];
};
const mapToMetaArr = (map: MapToMetaMap) =>
	Array.from(map.entries()).reduce((metaArr, [key, value]) => {
		if (Array.isArray(value)) {
			for (const item of value) {
				metaArr.push({
					property: (key as unknown) as string,
					content: item
				});
			}
		} else {
			metaArr.push({
				property: key,
				content: value
			});
		}
		return metaArr;
	}, [] as MapToMeta[]);

const getBlogPostMetas = (
	unicornsData?: UnicornInfo[],
	keywords: string[] = [],
	publishedTime?: string,
	editedTime?: string
) => {
	if (!unicornsData || !unicornsData.length) return [];
	const metas = new Map();

	metas.set("og:type", "article");

	metas.set("article:section", "Technology");
	metas.set(
		"article:author",
		unicornsData.map(uni => uni.name)
	);

	// There has to be one author to add their Twitter. It's only fair
	// as there are not multiple authors supported
	if (unicornsData.length === 1) {
		const socialUnicorn = unicornsData.find(uni => uni.socials);
		const uniTwitter =
			socialUnicorn && socialUnicorn.socials && socialUnicorn.socials.twitter;
		if (uniTwitter) {
			metas.set("twitter:creator", `@${uniTwitter}`);
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

const getProfileMetas = (unicornData?: UnicornInfo) => {
	if (!unicornData) return [];
	const metas = new Map();

	metas.set("og:type", "profile");
	metas.set("profile:firstName", unicornData.firstName);
	metas.set("profile:lastName", unicornData.lastName);
	metas.set("profile:username", unicornData.id);

	return mapToMetaArr(metas);
};

interface SEOProps {
	description?: string;
	lang?: string;
	meta?: HelmetProps["meta"];
	title: string;
	unicornsData?: UnicornInfo[];
	keywords?: string[];
	publishedTime?: string;
	editedTime?: string;
	type?: "article" | "profile";
	canonicalPath?: string;
}

export const SEO = ({
	description = "",
	lang = "en",
	meta = [],
	title,
	unicornsData,
	keywords,
	publishedTime,
	editedTime,
	type,
	canonicalPath
}: SEOProps) => {
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
			? getBlogPostMetas(unicornsData, keywords, publishedTime, editedTime)
			: type === "profile"
			? getProfileMetas(unicornsData![0])
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
					content: siteData.siteUrl + (canonicalPath || "")
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
					name: `twitter:site`,
					content: `@unicornuttrncs`
				},
				{
					property: "og:image",
					content: "https://unicorn-utterances.com/share-banner.png"
				},
				{
					name: "twitter:image",
					content: "https://unicorn-utterances.com/share-banner.png"
				}
			]
				.concat(meta as any)
				.concat(typeMetas as any)}
		/>
	);
};
