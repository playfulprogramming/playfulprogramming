import remarkUnwrapImages from "remark-unwrap-images";
import remarkGfm from "remark-gfm";
import rehypeImageSize from "rehype-img-size";
import remarkEmbedder, { RemarkEmbedderOptions } from "@remark-embedder/core";
import oembedTransformer from "@remark-embedder/transformer-oembed";
import * as TwitchTransformer from "gatsby-remark-embedder/dist/transformers/Twitch";
import rehypeSlug from "rehype-slug-custom-id";
import { parent } from "constants/site-config";
import { rehypeHeaderText } from "./plugins/add-header-text";
import remarkTwoslash from "remark-shiki-twoslash";
import { UserConfigSettings } from "shiki-twoslash";
import { rehypeTabs, RehypeTabsProps } from "utils/markdown/plugins/tabs";
import rehypeSvimg from 'rehype-svimg';

// TODO: Create types
import behead from "remark-behead";
import rehypeRaw from "rehype-raw";
import { unifiedChain } from "utils/markdown/unified-chain";

import * as path from 'path';
import {postsDirectory } from "utils/fs/api";
import { visit } from "unist-util-visit";
import { EMBED_SIZE } from "./constants";
import { isRelativePath } from "../url-paths";

export default async function markdownToHtml(
  content: string,
  slug: string
) {
  const imgDirectory = path.resolve(postsDirectory, slug);

  // We mutate this object in plugins to add metadata from remark
  // rendering
  const renderData = {
    headingsWithId: [],
  };

  const result = await unifiedChain({
    remarkPlugins: [
      remarkGfm,
      // Remove complaining about "div cannot be in p element"
      remarkUnwrapImages,
      /* start remark plugins here */
      [behead, { depth: 1 }],
      [
        remarkEmbedder as any,
        {
          transformers: [oembedTransformer, [TwitchTransformer, { parent }]],
        } as RemarkEmbedderOptions,
      ],
      [
        remarkTwoslash,
        {
          themes: ["css-variables"],
        } as UserConfigSettings,
      ],
    ],
    rehypePlugins: [
      // This is required to handle unsafe HTML embedded into Markdown
      rehypeRaw,
      [
        rehypeImageSize as any,
        {
          dir: imgDirectory,
        },
      ],
      // Do not add the tabs before the slug. We rely on some of the heading
      // logic in order to do some of the subheading logic
      [
        rehypeSlug,
        {
          maintainCase: true,
          removeAccents: true,
          enableCustomId: true,
        },
      ],
      [
        rehypeTabs,
        {
          injectSubheaderProps: true,
          tabSlugifyProps: {
            enableCustomId: true,
          },
        } as RehypeTabsProps,
      ],
      [rehypeHeaderText(renderData)],
      /**
       * Insert custom HTML generation code here
       */
      [rehypeSvimg, {
        inputDir: imgDirectory,
        outputDir: `public/posts/${slug}`,
        webp: true,
        avif: true,
        generateImages: true,
      }],
      // TODO: Remove this when
      // https://github.com/xiphux/rehype-svimg/issues/10
      (() => tree => {
        visit(tree, node => {
          const prefix = 'public';
          function removePrefix(path: string) {
            if (path.startsWith(prefix)) {
              if (path.startsWith(prefix + "/")) {
                return path.slice(prefix.length + 1, path.length);
              }
              return path.slice(prefix.length, path.length);
            }
            return path;
          }
          if (node.tagName === 's-image') {
            node.properties.src = "/" + removePrefix(node.properties.src );
            node.properties.srcset = "/" + removePrefix(node.properties.srcset);
            node.properties.srcsetwebp = "/" + removePrefix(node.properties.srcsetwebp);
            node.properties.srcsetavif = "/" + removePrefix(node.properties.srcsetavif);
          }
        })
        return tree;
      }),
      (() => tree => {
        visit(tree, node => {
          if (node.tagName === 'iframe') {
            node.properties.width ??= EMBED_SIZE.w;
            node.properties.height ??= EMBED_SIZE.h;
            node.properties.loading ??= 'lazy';
          }
          
          if (node.tagName === 'video') {
            node.properties.muted ??= true;
            node.properties.autoPlay ??= true;
            node.properties.controls ??= true;
            node.properties.loop ??= true;
            node.properties.width ??= '100%';
            node.properties.height ??= 'auto';
          }

          if (node.tagName === 'a') {
            const href = node.properties.href;
            const isInternalLink = isRelativePath(href || "");
            if (!isInternalLink) {
              node.properties.target = "_blank";
              node.properties.rel = "nofollow noopener noreferrer";
            }
          }
        })
      })
    ],
  }).process(content);

  return {
    html: result.toString(),
    headingsWithId: renderData.headingsWithId,
  };
}
