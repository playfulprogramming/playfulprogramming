import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkToRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkGfm from "remark-gfm";
import path from "path";
import { postsDirectory } from "utils/fs/api";
import rehypeImageSize from "rehype-img-size";
import remarkEmbedder, { RemarkEmbedderOptions } from "@remark-embedder/core";
import oembedTransformer from "@remark-embedder/transformer-oembed";
import * as TwitchTransformer from "gatsby-remark-embedder/dist/transformers/Twitch";
import rehypeSlug from "rehype-slug";
import { parent } from "constants/site-config";
import { rehypeHeaderText } from "./plugins/add-header-text";
import remarkTwoslash from "remark-shiki-twoslash";
import { UserConfigSettings } from "shiki-twoslash";
import replaceAllBetween from "unist-util-replace-all-between";

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

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    // Remove complaining about "div cannot be in p element"
    .use(remarkUnwrapImages)
    /* start remark plugins here */
    .use(behead, { after: 0, depth: 1 })
    .use(
      remarkEmbedder as any,
      {
        transformers: [oembedTransformer, [TwitchTransformer, { parent }]],
      } as RemarkEmbedderOptions
    )
    /* end remark plugins here */
    .use(remarkStringify)
    .use(
      remarkTwoslash as any,
      {
        themes: ["css-variables"],
      } as UserConfigSettings
    )
    .use(remarkToRehype, { allowDangerousHtml: true })
    /* start rehype plugins here */
    // TODO: https://github.com/ksoichiro/rehype-img-size/issues/4
    .use(rehypeImageSize, {
      dir: imgDirectory,
    })
    .use(() => (tree) => {
      replaceAllBetween(
        tree,
        { type: "raw", value: "<!-- tabs:start -->" } as never,
        { type: "raw", value: "<!-- tabs:end -->" } as never,
        (nodes) => {
          let sections = [];
          let sectionStarted = false;
          let isNodeHeading = (n: any) =>
            n.type === "element" && /h[1-6]/.exec(n.tagName);

          const tabsContainer = {
            type: "element",
            tagName: "tabs",
            children: [
              {
                type: "element",
                tagName: "tab-list",
                children: [] as any[],
              },
            ],
          };

          for (const localNode of nodes as any[]) {
            if (!sectionStarted && !isNodeHeading(localNode)) continue;
            sectionStarted = true;

            if (isNodeHeading(localNode)) {
              const header = {
                type: "element",
                tagName: "tab",
                children: localNode.children,
              };

              const contents = {
                type: "element",
                tagName: "tab-panel",
                children: [],
              };

              tabsContainer.children[0].children.push(header);

              tabsContainer.children.push(contents);
              continue;
            }

            // Push into last `tab-panel`
            tabsContainer.children[
              tabsContainer.children.length - 1
            ].children.push(localNode);
          }

          return [tabsContainer];
        }
      );
      return tree;
    })
    .use(rehypeSlug, {
      maintainCase: true,
      removeAccents: true,
      enableCustomId: true,
    })
    .use(rehypeHeaderText(renderData))
    /* end rehype plugins here */
    .use(rehypeStringify, { allowDangerousHtml: true })
    // .use(() => tree => {
    //     debugger;
    //     return tree;
    // })
    .process(content);

  return {
    html: result.toString(),
    headingsWithId: renderData.headingsWithId,
  };
}
