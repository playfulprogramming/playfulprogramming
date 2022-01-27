import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkToRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
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
import { rehypeTabs } from "utils/markdown/plugins/tabs";

// Optional now. Probably should move to an array that's passed or something
// TODO: Create types
const behead = require("remark-behead");

const markdownToHtmlNoReally = ({
  remarkPlugins,
  rehypePlugins,
}: Record<string, any>) => {
  let unifiedChain = unified().use(remarkParse);

  for (let remarkPlugin of remarkPlugins) {
    unifiedChain.use(
      ...(Array.isArray(remarkPlugin)
        ? (remarkPlugin as [any])
        : ([remarkPlugin] as [any]))
    );
  }

  unifiedChain
    .use(remarkStringify)
    .use(remarkToRehype, { allowDangerousHtml: true });

  for (let rhypePlugin of rehypePlugins) {
    unifiedChain.use(
      ...(Array.isArray(rhypePlugin)
        ? (rhypePlugin as [any])
        : ([rhypePlugin] as [any]))
    );
  }

  unifiedChain.use(rehypeStringify, { allowDangerousHtml: true });

  return unifiedChain;
};

export default async function markdownToHtml(
  content: string,
  imgDirectory: string
) {
  // We mutate this object in plugins to add metadata from remark
  // rendering
  const renderData = {
    headingsWithId: [],
  };

  const result = await markdownToHtmlNoReally({
    remarkPlugins: [
      remarkGfm,
      // Remove complaining about "div cannot be in p element"
      remarkUnwrapImages,
      /* start remark plugins here */
      [behead, { after: 0, depth: 1 }],

      [
        remarkEmbedder as any,
        {
          transformers: [oembedTransformer, [TwitchTransformer, { parent }]],
        } as RemarkEmbedderOptions,
      ],
      [
        remarkTwoslash as any,
        {
          themes: ["css-variables"],
        } as UserConfigSettings,
      ],
    ],
    rehypePlugins: [
      [
        rehypeImageSize,
        {
          dir: imgDirectory,
        },
      ],
      rehypeTabs,
      [
        rehypeSlug,
        {
          maintainCase: true,
          removeAccents: true,
          enableCustomId: true,
        },
      ],
      [rehypeHeaderText(renderData)],
    ],
  }).process(content);

  return {
    html: result.toString(),
    headingsWithId: renderData.headingsWithId,
  };
}
