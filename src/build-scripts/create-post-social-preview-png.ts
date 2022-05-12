import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { readFileSync, promises as fsPromises } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { getAllPosts } from "utils/fs/posts-and-collections-api";

const __dirname = dirname(fileURLToPath(import.meta.url));

const twitterLargeCardPreviewHTML = readFileSync(
  resolve(__dirname, "./social-previews/twitter-large-card.html"),
  "utf8"
);

let browser: puppeteer.Browser;
let page: puppeteer.Page;

const createPostSocialPreviewPng = async () => {
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

  await page.setContent(twitterLargeCardPreviewHTML);
  const screenShotBuffer = await page.screenshot();
  return screenShotBuffer;
};

const posts = getAllPosts({
  title: true,
  published: true,
  slug: true,
  authors: {
    id: true,
    name: true,
    profileImg: true,
  },
} as const);

(async () => {
  await Promise.all(
    posts.map(async (post) => {
      const png = await createPostSocialPreviewPng();

      return fsPromises.writeFile(
        resolve(process.cwd(), `./public/${post.slug}.twitter-preview.png`),
        png!
      );
    })
  );
})();

// Relative to root
