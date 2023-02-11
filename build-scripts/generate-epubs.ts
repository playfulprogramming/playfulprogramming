import remarkParse from "remark-parse";
import remarkToRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from "remark-unwrap-images";
import { default as remarkTwoslashDefault } from "remark-shiki-twoslash";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug-custom-id";
import { UserConfigSettings } from "shiki-twoslash";
import { collections, unicorns } from "../src/utils/data";
import { getAllPosts } from "../src/utils/get-all-posts";
import { join, resolve } from "path";
import { visit } from "unist-util-visit";
import { Element, Root } from "hast";
import { isRelativePath } from "../src/utils/url-paths";
import { EPub } from "@lesjoursfr/html-to-epub";
import { unified } from "unified";
import { CollectionInfo, PostInfo, RawCollectionInfo } from "types/index";

function rehypeMakeImagePathsAbsolute(options: { path: string }) {
	return (tree: Root) => {
		function imgVisitor(node: Element) {
			if (node.tagName === "img") {
				let src = node.properties!.src as string;
				if (src.startsWith("http")) {
					return;
				}
				if (isRelativePath(src)) {
					src = join(options.path, src);
					src = src.replace(/\\/g, "/");
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
					href = options.path.replace(/\/$/g, "") + href;
					href = href.replace(/\\/g, "/");
				}
				node.properties!.href = href;
			}
		}
		visit(tree, "element", aVisitor);
		return tree;
	};
}

function rehypeMakeFixTwoSlashXHTML() {
	return (tree: Root) => {
		function preVisitor(node: Element) {
			if (node.tagName === "pre") {
				visit(node, "element", (childNode: Element) => {
					if (childNode.tagName === "div") {
						childNode.tagName = "span";
						if (childNode.properties!.style) {
							if ((childNode.properties!.style as string).endsWith(";")) {
								(childNode.properties!.style as string) += "display: block;";
							} else {
								(childNode.properties!.style as string) += "; display: block;";
							}
						} else {
							childNode.properties!.style = "display: block;";
						}
					}
				});
			}
		}
		visit(tree, "element", preVisitor);
		return tree;
	};
}

// https://github.com/shikijs/twoslash/issues/147
const remarkTwoslash = (remarkTwoslashDefault as never as {default: typeof remarkTwoslashDefault}).default ?? remarkTwoslashDefault;

async function generateEpubHTML(slug: string, content: string) {
	const unifiedChain = unified()
		.use(remarkParse, { fragment: true } as never)
		.use([
			remarkGfm,
			remarkUnwrapImages,
			[
				remarkTwoslash,
				{
					themes: ["github-light"],
				} as UserConfigSettings,
			],
		])
		.use(remarkToRehype, { allowDangerousHtml: true })
		.use([
			// This is required to handle unsafe HTML embedded into Markdown
			rehypeRaw,
			rehypeMakeFixTwoSlashXHTML,
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
		])
		// Voids: [] is required for epub generation, and causes little/no harm for non-epub usage
		.use(rehypeStringify, { allowDangerousHtml: true, voids: [] });

	const result = await unifiedChain.process(content);

	return result.toString();
}

type EpubOptions = ConstructorParameters<typeof EPub>[0];

async function generateCollectionEPub(
	collection: RawCollectionInfo & Pick<CollectionInfo, "coverImgMeta">,
	collectionPosts: PostInfo[],
	fileLocation: string
) {
	const authors = collection.authors.map((id) => {
		return unicorns.find((u) => u.id === id).name;
	});

	const epub = new EPub(
		{
			title: collection.title,
			author: authors,
			publisher: "Unicorn Utterances",
			cover: collection.coverImgMeta.absoluteFSPath,
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
						display: none !important;
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
						display: inline-block !important;
						text-align: right;
						color: currentcolor;
						opacity: 0.8;
					}

					pre.shiki span.line {
						white-space: normal;
					}
					`,
			// fonts: ['/path/to/Merriweather.ttf'],
			lang: "en",
			content: await Promise.all(
				collectionPosts.map(async (post) => ({
					title: post.title,
					data: await generateEpubHTML(post.slug, post.contentMeta),
				}))
			),
		} as Partial<EpubOptions> as EpubOptions,
		fileLocation
	);

	await epub.render();
}

const posts = getAllPosts("en");

for (const collection of collections) {
	const collectionPosts = posts.filter(
		(post) => post.collectionSlug === collection.slug
	);

	generateCollectionEPub(
		collection,
		collectionPosts,
		resolve(process.cwd(), `public/${collection.slug}.epub`)
	);
}
