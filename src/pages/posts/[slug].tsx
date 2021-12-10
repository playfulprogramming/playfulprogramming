// import { useRouter } from 'next/router'
// import ErrorPage from 'next/error'
import { getPostBySlug, getAllPosts, postsDirectory } from "../../api/api";
import * as React from "react";
import { DiscussionEmbed } from "disqus-react";

import markdownToHtml from "../../utils/markdownToHtml";
import { useMarkdownRenderer } from "../../hooks/useMarkdownRenderer";
import { RenderedPostInfo } from "types/PostInfo";
import {
  postBySlug,
  SeriesPostInfo,
  seriesPostsPick,
  SlugPostInfo,
} from "constants/queries";
import { useRouter } from "next/router";

import { SEO } from "components/seo";
import { PostMetadata } from "../../page-components/blog-post/post-metadata";
import { PostTitleHeader } from "../../page-components/blog-post/post-title-header";
import { TableOfContents } from "components/table-of-contents";
import { BlogPostLayout } from "components/blog-post-layout";
import { MailingList } from "components/mailing-list";

import GitHubIcon from "assets/icons/github.svg";
import CommentsIcon from "assets/icons/message.svg";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "constants/theme-context";
import { siteMetadata } from "../../api/get-site-config";
import "react-medium-image-zoom/dist/styles.css";
import path from "path";

type Props = {
  markdownHTML: string;
  slug: string;
  postsDirectory: string;
  seriesPosts: SeriesPostInfo[];
  post: SlugPostInfo & RenderedPostInfo;
};

const Post = ({
  post,
  markdownHTML,
  slug,
  postsDirectory,
  seriesPosts,
}: Props) => {
  const router = useRouter();

  const result = useMarkdownRenderer({
    markdownHTML,
    slug,
    postsDirectory,
  });

  const { colorMode } = useContext(ThemeContext);

  const [disqusConfig, setDisqusConfig] = useState({
    url: `${siteMetadata.siteUrl}/posts${slug}`,
    identifier: slug,
    title: post.title,
  });

  /**
   * Toggle the Disqus theme
   * Disqus will by default try to guess what theme to pick based on the
   * color of the background. As a result, we don't have to do much other than
   * reload it after the page theme change is finished
   */
  useEffect(() => {
    setTimeout(() => {
      if (!setDisqusConfig || !colorMode) return;
      setDisqusConfig({
        url: `${siteMetadata.siteUrl}/posts${slug}`,
        // TODO: Fix this, this is causing comments to not apply to the correct
        //   post. This identifier should NEVER change and should ALWAYS match
        //   `slug` only
        identifier: slug,
        title: post.title,
      });
      // Must use a `useTimeout` so that this reloads AFTER the background animation
    }, 600);
  }, [colorMode, post.title, siteMetadata.siteUrl, slug]);

  const GHLink = `https://github.com/${siteMetadata.repoPath}/tree/master${siteMetadata.relativeToPosts}${slug}index.md`;

  return (
    <>
      <SEO
        title={post.title}
        description={post.description || post.excerpt}
        unicornsData={post.authors}
        publishedTime={post.published}
        editedTime={post.edited}
        keywords={post.tags}
        type="article"
        pathName={router.pathname}
        canonical={post.originalLink}
      />
      <article>
        <BlogPostLayout
          left={<TableOfContents headingsWithId={post.headingsWithId} />}
          center={
            <>
              <header role="banner" className="marginZeroAutoChild">
                <PostTitleHeader post={post} />
                <PostMetadata post={post} />
              </header>
              <main className="post-body" data-testid={"post-body-div"}>
                {result}
              </main>
            </>
          }
        />
        <footer role="contentinfo" className="post-lower-area">
          <div>
            <a
              aria-label={`Post licensed with ${post.license.displayName}`}
              href={post.license.explainLink}
              style={{ display: "table", margin: "0 auto" }}
            >
              <img
                src={post.license.footerImg}
                alt={post.license.licenceType}
              />
            </a>
          </div>
          <MailingList />
          <div className="postBottom">
            <div className="btnLike prependIcon">
              <CommentsIcon />
              <p>Comments</p>
            </div>

            <a
              className="baseBtn prependIcon"
              href={GHLink}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              <GitHubIcon />
              View this Post on GitHub
            </a>

            {/*<button className="baseBtn appendIcon" type="button">*/}
            {/*  Share this Post*/}
            {/*  <ShareIcon/>*/}
            {/*</button>*/}
          </div>
          <DiscussionEmbed
            shortname={siteMetadata.disqusShortname}
            config={disqusConfig}
            key={colorMode}
          />
        </footer>
      </article>
    </>
  );
};

export default Post;

type Params = {
  params: {
    slug: string;
  };
};

const seriesPostCacheKey = {};

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, postBySlug);

  const isStr = (val: any): val is string => typeof val === "string";
  const slug = isStr(post.slug) ? post.slug : "";

  let seriesPosts: any[] = [];
  if (post.series && post.order) {
    const allPosts = getAllPosts(seriesPostsPick, seriesPostCacheKey);

    seriesPosts = allPosts
      .filter((filterPost) => filterPost.series === post.series)
      .sort((sortPost) => Number(sortPost.order) - Number(post.order));
  }

  const { html: markdownHTML, headingsWithId } = await markdownToHtml(
    post.content,
    path.resolve(postsDirectory, post.slug)
  );

  return {
    props: {
      post: {
        ...post,
        content: "",
        headingsWithId,
        markdownHTML,
      },
      markdownHTML,
      slug: slug,
      postsDirectory,
      seriesPosts,
    } as Props,
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts({ slug: true });

  const paths = posts.map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
