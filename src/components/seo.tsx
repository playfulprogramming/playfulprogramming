import React, { ReactElement, useMemo } from "react";
import Head from "next/head";
import { siteMetadata, siteUrl } from "constants/site-config";
import { UnicornInfo } from "../types";

interface SEOProps {
  description?: string;
  lang?: string;
  title: string;
  unicornsData?: Array<
    Pick<UnicornInfo, "socials" | "name" | "lastName" | "firstName" | "id">
  >;
  keywords?: string[];
  publishedTime?: string;
  editedTime?: string;
  type?: "article" | "profile";
  pathName?: string;
  canonical?: string;
}

export const SEO: React.FC<SEOProps> = (props) => {
  const {
    description = "",
    children,
    title,
    keywords,
    canonical,
    type,
    unicornsData,
    publishedTime,
    editedTime,
    pathName,
  } = props;

  const metaDescription = description || siteMetadata.description;
  const metaKeywords = keywords ? keywords.join(",") : siteMetadata.keywords;
  const metaImage = `${siteUrl}/share-banner.png`;

  const ogType = type ?? "blog";

  const typeSpecificTags = useMemo(() => {
    let tags: ReactElement[] = [];
    switch (type) {
      case "profile": {
        tags = [
          <meta
            key="firstName"
            property="profile:firstName"
            content={unicornsData![0].firstName}
          />,
          <meta
            key="lastName"
            property="profile:lastName"
            content={unicornsData![0].lastName}
          />,
          <meta
            key="username"
            property="profile:username"
            content={unicornsData![0].id}
          />,
        ];
        break;
      }
      case "article": {
        // for (let keyword of keywords || []) {
        //   tags.push(
        //     <meta key={keyword} property="article:tag" content={keyword} />
        //   );
        // }
        tags = tags.concat([
          <meta
            key="section"
            property="article:section"
            content="Technology"
          />,
          <meta
            key="author"
            property="article:author"
            content={unicornsData!.map((uni) => uni.name).join(",")}
          />,
        ]);

        if (editedTime) {
          tags.push(
            <meta
              key="modified_time"
              property="article:modified_time"
              content={editedTime}
            />
          );
        }
        if (publishedTime) {
          tags.push(
            <meta
              key="published_time"
              property="article:published_time"
              content={publishedTime}
            />
          );
        }
        break;
      }
      default:
        break;
    }
    return tags;
  }, [editedTime, publishedTime, type, unicornsData]);

  const socialUnicorn = props.unicornsData?.find((uni) => uni.socials);
  const uniTwitter =
    socialUnicorn && socialUnicorn.socials && socialUnicorn.socials.twitter;

  /**
   * These cannot be broken into dedicated components because of a limitation in
   * NextJS's source code
   *
   * To quote the docs:
   * > title, meta or any other elements (e.g. script) need to be contained as
   * > direct children of the Head element, or wrapped into maximum one level of
   * > <React.Fragment> or arrays—otherwise the tags won't be correctly picked up
   * > on client-side navigations.
   */
  return (
    <Head>
      <title>
        {title ? `${title} | ${siteMetadata.title}` : siteMetadata.title}
      </title>
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <meta property="name" content={siteMetadata.title} />
      <meta name="description" content={metaDescription} />
      <meta property="keywords" content={metaKeywords} />
      {/* Google Analytics */}
      <link rel="preconnect" href="https://www.google.com" />
      <link rel="preconnect" href="https://marketingplatform.google.com" />
      {/* Twitter SEO */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteMetadata.twitterHandle} />
      <meta name="twitter:image" content={metaImage} />
      {type === "article" && unicornsData!.length === 1 && uniTwitter ? (
        <meta property="twitter:creator" content={`@${uniTwitter}`} />
      ) : null}
      {children}
      {/* Open Graph SEO */}
      <meta
        property="og:url"
        content={siteMetadata.siteUrl + (pathName || "")}
      />
      <meta property="og:site_name" content={siteMetadata.title} />
      <meta property="og:title" content={title} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:type" content={ogType} />
      {typeSpecificTags}
    </Head>
  );
};
