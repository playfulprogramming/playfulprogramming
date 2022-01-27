import remarkUnwrapImages from "remark-unwrap-images";
import remarkGfm from "remark-gfm";
import rehypeImageSize from "rehype-img-size";
import remarkEmbedder, { RemarkEmbedderOptions } from "@remark-embedder/core";
import oembedTransformer from "@remark-embedder/transformer-oembed";
import * as TwitchTransformer from "gatsby-remark-embedder/dist/transformers/Twitch";
import rehypeSlug from "rehype-slug";
import { parent } from "constants/site-config";
import { rehypeHeaderText } from "./plugins/add-header-text";
import remarkTwoslash from "remark-shiki-twoslash";
import { UserConfigSettings } from "shiki-twoslash";
import { serialize } from "next-mdx-remote/serialize";

// Optional now. Probably should move to an array that's passed or something
// TODO: Create types
const behead = require("remark-behead");

export default async function markdownToHtml(
  content: string,
  imgDirectory: string
) {
  // We mutate this object in plugins to add metadata from remark
  // rendering
  const renderData = {
    headingsWithId: [],
  };

  const source = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
        remarkUnwrapImages,
        [behead, { after: 0, depth: 1 }],
        [
          remarkEmbedder as any,
          {
            transformers: [oembedTransformer, [TwitchTransformer, { parent }]],
          } as RemarkEmbedderOptions,
        ],
        remarkTwoslash as any,
        {
          themes: ["css-variables"],
        } as UserConfigSettings,
      ],
      rehypePlugins: [
        [
          rehypeImageSize as any,
          {
            dir: imgDirectory,
          },
        ],
        [
          rehypeSlug,
          {
            maintainCase: true,
            removeAccents: true,
            enableCustomId: true,
          },
        ],
        rehypeHeaderText(renderData),
      ],
    },
  });

  return {
    source,
    headingsWithId: renderData.headingsWithId,
  };
}
