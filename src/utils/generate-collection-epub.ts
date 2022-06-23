import { unifiedChain } from "utils/markdown/unified-chain";
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from "remark-unwrap-images";
import behead from "remark-behead";
import remarkTwoslash from "remark-shiki-twoslash";
import { UserConfigSettings } from "shiki-twoslash";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug-custom-id";
import { CollectionQueryType } from "utils/fs/posts-and-collections-api";

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

export async function generateCollectionEPub(collection: CollectionQueryType) {
  const epub = new EPub({
    title: collection.title,
    author: collection.authors.map((author) => author.name),
    publisher: "Unicorn Utterances",
    cover: "",
    // css: `body{background: #000}`,
    // fonts: ['/path/to/Merriweather.ttf'],
    lang: "en",
    content: collection.posts.map((post) => ({
      title: post.title,
      author: post.authors.map((author) => author.name),
      data: `<div>Test</div>`,
    })),
    output: "ffg.epub",
  });
  return await epub.render();
}
