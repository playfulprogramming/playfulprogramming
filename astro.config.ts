import { defineConfig, AstroUserConfig } from "astro/config";

import remarkUnwrapImages from "remark-unwrap-images";
import remarkGfm from "remark-gfm";
import remarkEmbedder, { RemarkEmbedderOptions } from "@remark-embedder/core";
import oembedTransformer from "@remark-embedder/transformer-oembed";
import * as TwitchTransformer from "gatsby-remark-embedder/dist/transformers/Twitch.js";
import rehypeSlug from "rehype-slug-custom-id";
import { parent } from "./src/constants/site-config";
import { rehypeHeaderText } from "./src/utils/markdown/plugins/add-header-text";
import { rehypeTabs } from "./src/utils/markdown/plugins/tabs";
import { rehypeAstroImageMd } from "./src/utils/markdown/plugins/rehype-astro-image-md";
import { rehypeUnicornElementMap } from "./src/utils/markdown/plugins/rehype-unicorn-element-map";

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
      ],
    ],
    rehypePlugins: [
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
      rehypeUnicornElementMap
    ],
  } as AstroUserConfig["markdown"] as never,
});
