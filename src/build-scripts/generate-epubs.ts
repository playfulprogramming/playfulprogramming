import { unifiedChain } from "utils/markdown/unified-chain";
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkTwoslash from "remark-shiki-twoslash";
import { UserConfigSettings } from "shiki-twoslash";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug-custom-id";
import {
  getCollectionBySlug,
  getCollectionSlugs,
} from "utils/fs/posts-and-collections-api";
import { join, resolve } from "path";
import slash from "slash";
import visit from "unist-util-visit";
import { Element, Root } from "hast";
import { isRelativePath } from "utils/url-paths";
import { EPub } from "@lesjoursfr/html-to-epub";

function rehypeMakeImagePathsAbsolute(options: { path: string }) {
  return (tree: Root) => {
    visit(tree, "element", visitor);

    function visitor(node: Element) {
      if (node.tagName === "img") {
        let src = node.properties!.src as string;
        if (src.startsWith("http")) {
          return;
        }
        if (isRelativePath(src)) {
          src = slash(join(options.path, src));
        }
        node.properties!.src = src;
      }
    }
  };
}

async function generateEpubHTML(slug: string, content: string) {
  const result = await unifiedChain({
    remarkPlugins: [
      remarkGfm,
      remarkUnwrapImages,
      [
        (remarkTwoslash as any).default,
        {
          themes: ["github-light"],
        } as UserConfigSettings,
      ],
    ],
    rehypePlugins: [
      // This is required to handle unsafe HTML embedded into Markdown
      rehypeRaw,
      [
        rehypeMakeImagePathsAbsolute,
        {
          path: resolve(process.cwd(), `content/blog/${slug}/`),
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
    ],
  }).process(content);

  return result.toString();
}

type EpubOptions = ConstructorParameters<typeof EPub>[0];

async function generateCollectionEPub(
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
      cover: resolve(
        process.cwd(),
        `content/collections/${collection.slug}/${collection.coverImg.relativePath}`
      ),
      css: `img{max-width: 100%}`,
      // fonts: ['/path/to/Merriweather.ttf'],
      lang: "en",
      content: await Promise.all(
        collection.posts.map(async (post) => ({
          title: post.title,
          author: post.authors.map((author) => author.name),
          data: await generateEpubHTML(post.slug, post.content),
        }))
      ),
    } as Partial<EpubOptions> as EpubOptions,
    fileLocation
  );
  return await epub.render();
}

const collectionSlugs = getCollectionSlugs();
// @ts-ignore
await Promise.all(
  collectionSlugs.map(async (collectionSlug) => {
    await generateCollectionEPub(
      collectionSlug,
      resolve(process.cwd(), `public/${collectionSlug}.epub`)
    );
  })
);
