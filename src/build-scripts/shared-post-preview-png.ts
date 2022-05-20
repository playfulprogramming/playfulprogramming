import { readFileAsBase64 } from "./social-previews/read-file-as-base64";
import { dirname, resolve } from "path";
import { PreviewPost } from "./social-previews/get-posts";
import { readFileSync } from "fs";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { fileURLToPath } from "url";
import { COLORS } from "constants/theme";

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

const backgroundStr = readFileAsBase64(
  resolve(__dirname, "./social-previews/assets/code_background.jpg")
);

const unicornUtterancesHead = readFileAsBase64(
  resolve(__dirname, "../assets/unicorn_head_1024.png")
);

export const renderPostPreviewToString = async (post: PreviewPost) => {
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

  return `
    <!DOCTYPE html>
    <html>
    <head>
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
        ...heightWidth,
        authorImagesStrs,
        backgroundStr,
        unicornUtterancesHead,
      })
    )}
    </body>
    </html>
    `;
};
