import { readFileAsBase64 } from "./social-previews/read-file-as-base64";
import { dirname, resolve } from "path";
import { PreviewPost } from "./social-previews/get-posts";
import { readFileSync } from "fs";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { fileURLToPath } from "url";
import { COLORS } from "constants/theme";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkTwoslash from "remark-shiki-twoslash";
import remarkToRehype from "remark-rehype";
import { findAllAfter } from "unist-util-find-all-after";
import rehypeStringify from "rehype-stringify";

const unifiedChain = () => {
  let unifiedChain = unified()
    .use(remarkParse)
    .use(() => (tree) => {
      // extract code snippets from parsed markdown
      const nodes = findAllAfter(tree, 0, { type: "code" });

      // join code parts into one element
      const value =
        nodes
          .map((node) => (node as any).value)
          .join("\n")
          .trim() +
        "\n" +
        renderPostPreviewToString.toString();

      return {
        type: "root",
        children: [
          {
            type: "code",
            lang: (nodes[0] as any)?.lang || "javascript",
            value,
          },
        ],
      };
    })
    .use([[(remarkTwoslash as any).default, { themes: ["css-variables"] }]])
    .use(remarkToRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true });

  return unifiedChain;
};

async function markdownToHtml(content: string) {
  return await (await unifiedChain().process(content)).toString();
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const colorsCSS = (Object.keys(COLORS) as Array<keyof typeof COLORS>).reduce(
  (stylesheetStr, colorKey, i, arr) => {
    let str = stylesheetStr + `\n--${colorKey}: ${COLORS[colorKey].light};`;
    if (i === arr.length - 1) str += "\n}";
    return str;
  },
  ":root {\n"
);

export const heightWidth = { width: 1280, height: 640 };

const unicornUtterancesHead = readFileAsBase64(
  resolve(__dirname, "../assets/unicorn_head_1024.png")
);

export const renderPostPreviewToString = async (post: PreviewPost) => {
  const shikiSCSS = readFileSync(resolve(__dirname, "../shiki.scss"), "utf8");

  const twitterLargeCardPreviewCSS = readFileSync(
    resolve(__dirname, "./social-previews/twitter-large-card.css"),
    "utf8"
  );

  // This needs to happen here, since otherwise the `import` is stale at runtime,
  // thus breaking live refresh
  const TwitterLargeCard = // We need `?update=""` to cache bust for live reload
    (await import(`./social-previews/twitter-large-card?update=${Date.now()}`))
      .default;

  const authorImagesStrs = post.authors.map((author) =>
    readFileAsBase64(author.profileImg.absoluteFSPath)
  );

  const postHtml = await markdownToHtml(post.content);

  return `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    ${shikiSCSS}
    </style>
    <style>
    ${colorsCSS}
    </style>
    <style>
    ${twitterLargeCardPreviewCSS}
    </style>
    </head>
    <body>
    ${renderToStaticMarkup(
      createElement(TwitterLargeCard, {
        post,
        postHtml,
        ...heightWidth,
        authorImagesStrs,
        unicornUtterancesHead,
      })
    )}
    </body>
    </html>
    `;
};
