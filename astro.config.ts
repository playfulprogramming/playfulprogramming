import { defineConfig, AstroUserConfig } from "astro/config";

import remarkUnwrapImages from "remark-unwrap-images";
import remarkGfm from "remark-gfm";
import remarkEmbedder, { RemarkEmbedderOptions } from "@remark-embedder/core";
import oembedTransformer from "@remark-embedder/transformer-oembed";
import * as TwitchTransformer from "gatsby-remark-embedder/dist/transformers/Twitch.js";
import rehypeSlug from "rehype-slug-custom-id";
import { parent } from "./src/constants/site-config";
import { rehypeHeaderText } from "./src/utils/markdown/rehype-header-text";
import { rehypeTabs } from "./src/utils/markdown/tabs";
import { rehypeAstroImageMd } from "./src/utils/markdown/rehype-astro-image-md";
import { rehypeUnicornElementMap } from "./src/utils/markdown/rehype-unicorn-element-map";
import { rehypeExcerpt } from "./src/utils/markdown/rehype-excerpt";
import { rehypeUnicornPopulatePost } from "./src/utils/markdown/rehype-unicorn-populate-post";
import { rehypeWordCount } from "./src/utils/markdown/rehype-word-count";

// TODO: Create types
import behead from "remark-behead";
import rehypeRaw from "rehype-raw";

import image from "@astrojs/image";

export default defineConfig({
  integrations: [image()],
  vite: {
    ssr: {
      external: ["svgo"],
    },
  },
  markdown: {
    mode: "md",
    shikiConfig: {
      theme: "css-variables",
    },
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
      ]
    ],
    rehypePlugins: [
      rehypeUnicornPopulatePost,
      // This is required to handle unsafe HTML embedded into Markdown
      rehypeRaw,
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
        },
      ],
      rehypeHeaderText,
      /**
       * Insert custom HTML generation code here
       */
      [
        rehypeAstroImageMd,
        {
          maxHeight: 768,
          maxWidth: 768,
        }
      ],
      rehypeUnicornElementMap,
      [rehypeExcerpt, {
        maxLength: 150
      }],
      rehypeWordCount
    ],
  } as AstroUserConfig["markdown"] as never,
});
