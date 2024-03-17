import remarkParse from "remark-parse";
import remarkToRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkUnwrapImages from "remark-unwrap-images";
import { default as remarkTwoslashDefault } from "remark-shiki-twoslash";
import { UserConfigSettings } from "shiki-twoslash";
import {
	getCollectionsByLang,
	getPostsByCollection,
	getUnicornById,
} from "../src/utils/api";
import { resolve } from "path";
import { EPub } from "@lesjoursfr/html-to-epub";
import { unified } from "unified";
import { CollectionInfo, PostInfo } from "types/index";
import { createRehypePlugins } from "utils/markdown/createRehypePlugins";
import { getPostContentMarkdown } from "utils/get-post-content";
import { contentDirectory } from "utils/data";

// https://github.com/shikijs/twoslash/issues/147
const remarkTwoslash =
	(remarkTwoslashDefault as never as { default: typeof remarkTwoslashDefault })
		.default ?? remarkTwoslashDefault;

async function generateEpubHTML(post: PostInfo, content: string) {
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
		.use(
			createRehypePlugins({
				format: "epub",
				path: resolve(contentDirectory, post.path),
			}),
		)
		// Voids: [] is required for epub generation, and causes little/no harm for non-epub usage
		.use(rehypeStringify, { allowDangerousHtml: true, voids: [] });

	const result = await unifiedChain.process(content);

	return result.toString();
}

type EpubOptions = ConstructorParameters<typeof EPub>[0];

async function generateCollectionEPub(
	collection: CollectionInfo,
	collectionPosts: PostInfo[],
	fileLocation: string,
) {
	const authors = collection.authors
		.map((id) => getUnicornById(id, collection.locale)?.name)
		.filter((name): name is string => !!name);

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
					data: await generateEpubHTML(
						post,
						await getPostContentMarkdown(post),
					),
				})),
			),
		} as Partial<EpubOptions> as EpubOptions,
		fileLocation,
	);

	await epub.render();
}

for (const collection of getCollectionsByLang("en")) {
	const collectionPosts = getPostsByCollection(
		collection.slug,
		collection.locale,
	);

	generateCollectionEPub(
		collection,
		collectionPosts,
		resolve(process.cwd(), `public/${collection.slug}.epub`),
	);
}
