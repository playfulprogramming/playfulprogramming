import type { NextApiRequest, NextApiResponse } from "next";
import { unifiedChain } from "utils/markdown/unified-chain";
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkTwoslash from "remark-shiki-twoslash";
import { UserConfigSettings } from "shiki-twoslash";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug-custom-id";
import * as uuid from "uuid";
import { getCollectionBySlug } from "utils/fs/posts-and-collections-api";
import { join, resolve } from "path";
import slash from "slash";
const { EPub } = require("@lesjoursfr/html-to-epub");

async function generateEpubHTML(content: string) {
  const result = await unifiedChain({
    remarkPlugins: [
      remarkGfm,
      remarkUnwrapImages,
      [
        remarkTwoslash,
        {
          themes: ["github-light"],
        } as UserConfigSettings,
      ],
    ],
    rehypePlugins: [
      // This is required to handle unsafe HTML embedded into Markdown
      rehypeRaw,
      [
        rehypeSlug,
        {
          maintainCase: true,
          removeAccents: true,
          enableCustomId: true,
        },
      ],
    ],
  }).process(content);

  return result.toString();
}

export async function generateCollectionEPub(
  collectionSlug: string,
  fileLocation: string
) {
  const collection = getCollectionBySlug(collectionSlug, {
    title: true,
    authors: true,
    posts: true,
    slug: true,
    coverImg: true,
    associatedSeries: true,
  });
  const epub = new EPub(
    {
      title: collection.title,
      author: collection.authors.map((author) => author.name),
      publisher: "Unicorn Utterances",
      cover:
        "http://localhost:9000" +
        slash(
          join(
            "/collections",
            collection.slug,
            collection.coverImg.relativePath
          )
        ),
      // css: `body{background: #000}`,
      // fonts: ['/path/to/Merriweather.ttf'],
      lang: "en",
      content: await Promise.all(
        collection.posts.map(async (post) => ({
          title: post.title,
          author: post.authors.map((author) => author.name),
          // data: await generateEpubHTML(post.content),
          data: "<div>Test</div>",
        }))
      ),
    },
    fileLocation
  );
  return await epub.render();
}

type ResponseData = {
  epubLocation: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (!req.query.collectionName) {
    res.status(200).json({ epubLocation: "" });
    return;
  }
  try {
    const fileName = `${uuid.v4()}.epub`;
    await generateCollectionEPub(
      req.query.collectionName as string,
      resolve(process.cwd(), "public", fileName)
    );
    res.status(200).json({ epubLocation: fileName });
  } catch (e) {
    console.error(e);
    res.status(500).json({ errorMessage: JSON.stringify(e) } as never);
  }
}
