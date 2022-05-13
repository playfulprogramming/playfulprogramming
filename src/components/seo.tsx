import React, { PropsWithChildren, ReactElement, useMemo } from "react";
import Head from "next/head";
import { siteMetadata, siteUrl } from "constants/site-config";
import { Languages, UnicornInfo } from "../types";
import {
  fileToOpenGraphConverter,
  removePrefixLanguageFromPath,
} from "utils/translations";

interface SEOProps {
  description?: string;
  langData?: {
    currentLang: Languages;
    otherLangs: Languages[];
  };
  title: string;
  unicornsData?: Array<
    Pick<UnicornInfo, "socials" | "name" | "lastName" | "firstName" | "id">
  >;
  keywords?: string[];
  publishedTime?: string;
  editedTime?: string;
  type?: "article" | "profile" | "book";
  pathName?: string;
  canonical?: string;
  isbn?: string;
  shareImage?: string;
}

export const SEO: React.FC<PropsWithChildren<SEOProps>> = (props) => {
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
    isbn,
    langData,
    shareImage,
  } = props;

  const metaDescription = description || siteMetadata.description;
  const metaKeywords = keywords ? keywords.join(",") : siteMetadata.keywords;
  const metaImage = `${siteUrl}${shareImage ?? "/share-banner.png"}`;

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
      case "book": {
        tags = tags.concat([
          <meta
            key="release_date"
            property="book:release_date"
            content={publishedTime}
          />,
          <meta
            key="author"
            property="book:author"
            content={unicornsData!.map((uni) => uni.name).join(",")}
          />,
        ]);
        if (isbn) {
          tags.push(<meta key="isbn" property="book:isbn" content={isbn} />);
        }
        break;
      }
      case "article": {
        for (let keyword of keywords || []) {
          tags.push(
            <meta key={keyword} property="article:tag" content={keyword} />
          );
        }
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
  }, [editedTime, isbn, keywords, publishedTime, type, unicornsData]);

  const socialUnicorn = props.unicornsData?.find((uni) => uni.socials);
  const uniTwitter =
    socialUnicorn && socialUnicorn.socials && socialUnicorn.socials.twitter;

  const currentPath = siteMetadata.siteUrl + (pathName || "");

  /**
   * These cannot be broken into dedicated components because of a limitation in
   * NextJS's source code
   *
   * @see https://github.com/vercel/next.js/blob/canary/packages/next/shared/lib/head.tsx
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
      <meta property="og:url" content={currentPath} />
      <meta property="og:site_name" content={siteMetadata.title} />
      <meta property="og:title" content={title} />
      {langData?.currentLang && (
        <link
          rel="alternate"
          href={
            siteMetadata.siteUrl + removePrefixLanguageFromPath(pathName || "")
          }
          hrefLang="x-default"
        />
      )}
      {langData?.otherLangs &&
        langData.otherLangs.map((lang) => (
          <link
            key={lang}
            rel="alternate"
            href={
              siteMetadata.siteUrl +
              `${lang === "en" ? "" : "/"}${lang}` +
              removePrefixLanguageFromPath(pathName || "")
            }
            hrefLang={langData.currentLang}
          />
        ))}
      <meta
        property="og:locale"
        content={
          langData ? fileToOpenGraphConverter(langData.currentLang) : "en"
        }
      />
      {langData?.otherLangs &&
        langData.otherLangs.map((lang) => (
          <meta
            key={lang}
            property="og:locale:alternate"
            content={fileToOpenGraphConverter(lang)}
          />
        ))}
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:type" content={ogType} />
      {typeSpecificTags}
    </Head>
  );
};
