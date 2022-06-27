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
import { toXast } from "hast-util-to-xast";
import { toXml } from "xast-util-to-xml";
import { Element, Root } from "hast";
import { isRelativePath, trimTrailingSlash } from "utils/url-paths";
import { EPub } from "@lesjoursfr/html-to-epub";
import { PluggableList, unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkToRehype from "remark-rehype";

function rehypeMakeImagePathsAbsolute(options: { path: string }) {
  return (tree: Root) => {
    function imgVisitor(node: Element) {
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

    visit(tree, "element", imgVisitor);
    return tree;
  };
}

function rehypeMakeHrefPathsAbsolute(options: { path: string }) {
  return (tree: Root) => {
    function aVisitor(node: Element) {
      if (node.tagName === "a") {
        let href = node.properties!.href as string;
        if (href.startsWith("#")) {
          return;
        }
        if (isRelativePath(href)) {
          href = slash(trimTrailingSlash(options.path) + href);
        }
        node.properties!.href = href;
      }
    }
    visit(tree, "element", aVisitor);
    return tree;
  };
}

interface markdownChainProps {
  remarkPlugins: PluggableList;
  rehypePlugins: PluggableList;
}

async function generateEpubHTML(slug: string, content: string) {
  const unifiedChain = ({
    remarkPlugins,
    rehypePlugins,
  }: markdownChainProps) => {
    return unified()
      .use(remarkParse)
      .use(remarkPlugins)
      .use(remarkStringify)
      .use(remarkToRehype, { allowDangerousHtml: true })
      .use(rehypePlugins)
      .use(function xmlStringify() {
        Object.assign(this, { Compiler: compiler });

        function compiler(tree: Node) {
          return toXml(toXast(tree as never), { allowDangerousXml: true });
        }
      });
  };

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
        rehypeMakeHrefPathsAbsolute,
        {
          path: `https://unicorn-utterances.com`,
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
      css: `
        img {
          max-width: 100%;
        }
        
        /**
         * Shiki styling
         */
        pre {
          padding: 0.5rem;
          border: 1px solid currentcolor;
          border-radius: 8px;
        }
        
        /** Don't show the language identifiers */
        pre.shiki .language-id {
          display: none;
        }
        
        /*
         * This code handles line of code counting
         */
        code {
          counter-reset: step;
          counter-increment: step 0;
        }
        
        code .line::before {
          content: counter(step);
          counter-increment: step;
          width: 1rem;
          margin-right: 1.5rem;
          display: inline-block;
          text-align: right;
          color: currentcolor;
          opacity: 0.8;
        }
        
        pre.shiki div.line {
          white-space: normal;
        }
      `,
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
  await epub.render();
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
