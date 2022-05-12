import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { promises as fsPromises, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { getSocialPosts, PreviewPost } from "./social-previews/get-posts";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { COLORS } from "constants/theme";

const __dirname = dirname(fileURLToPath(import.meta.url));

const twitterLargeCardPreviewCSS = readFileSync(
  resolve(__dirname, "./social-previews/twitter-large-card.css"),
  "utf8"
);

const colorsCSS = (Object.keys(COLORS) as Array<keyof typeof COLORS>).reduce(
  (stylesheetStr, colorKey, i, arr) => {
    let str = stylesheetStr + `\n--${colorKey}: ${COLORS[colorKey].light};`;
    if (i === arr.length - 1) str += "\n}";
    return str;
  },
  ":root {\n"
);

let browser: puppeteer.Browser;
let page: puppeteer.Page;

export const renderPostPreviewToString = async (post: PreviewPost) => {
  // This needs to happen here, since otherwise the `import` is stale at runtime,
  // thus breaking live refresh
  const TwitterLargeCard = // We need `?update=""` to cache bust for live reload
    (await import(`./social-previews/twitter-large-card?update=${Date.now()}`))
      .default;

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
    ${renderToStaticMarkup(createElement(TwitterLargeCard, { post }))}
    </body>
    </html>
    `;
};

const createPostSocialPreviewPng = async (post: PreviewPost) => {
  if (!browser) {
    browser = await chromium.puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1128, height: 600 });
  }

  await page.setContent(await renderPostPreviewToString(post));
  const screenShotBuffer = await page.screenshot();
  return screenShotBuffer;
};

const posts = getSocialPosts();

/**
 * This is done synchronously, in order to prevent more than a single instance
 * of the browser from running at the same time.
 */
let postPngs = [] as Array<{ png: Buffer; post: typeof posts[number] }>;
for (let post of posts) {
  postPngs.push({
    post,
    // @ts-ignore
    png: await createPostSocialPreviewPng(post),
  });
}

// @ts-ignore
await Promise.all(
  postPngs.map(async (postData) => {
    await fsPromises.writeFile(
      // Relative to root
      resolve(
        process.cwd(),
        `./public/${postData.post.slug}.twitter-preview.png`
      ),
      postData.png!
    );
  })
);

// @ts-ignore
await browser!.close();
