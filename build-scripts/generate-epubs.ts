import {
	getCollectionsByLang,
	getPostsByCollection,
	getUnicornById,
} from "../src/utils/api";
import { resolve } from "path";
import { EPub } from "@lesjoursfr/html-to-epub";
import { unified } from "unified";
import { CollectionInfo, PostInfo } from "types/index";
import { createEpubPlugins } from "utils/markdown/createEpubPlugins";
import { getMarkdownVFile } from "utils/markdown/getMarkdownVFile";
import {
	rehypeReferencePage,
	collectionMetaRecord,
} from "utils/markdown/reference-page/rehype-reference-page";

interface GetReferencePageMarkdownOptions {
	collection: CollectionInfo;
	collectionPosts: PostInfo[];
}

function getReferencePageMarkdown({
	collection,
	collectionPosts,
}: GetReferencePageMarkdownOptions) {
	const collectionMeta = collectionMetaRecord.get(collection.slug);

	return `
${collectionPosts
	.map((chapter) => {
		const chapterMetaLinks = collectionMeta?.links?.filter(
			(link) => link.associatedChapterOrder === chapter.order,
		);

		if (!chapterMetaLinks?.length) {
			return `
## ${chapter.title} {#${collection.slug}-${chapter.order}}

No links for this chapter
`.trim();
		}

		return `
## ${chapter.title} {#${collection.slug}-${chapter.order}}

${chapterMetaLinks
	.map((link) => {
		return `
[${link.originalText}<sup>${link.countWithinCollection}</sup>](${link.originalHref})
`;
	})
	.join("\n")}
`;
	})
	.join("\n\n")}
`;
}

interface GenerateReferencePageHTMLOptions {
	markdown: string;
	unifiedChain: ReturnType<typeof createEpubPlugins>;
}

async function generateReferencePageHTML({
	markdown,
	unifiedChain,
}: GenerateReferencePageHTMLOptions) {
	const result = await unifiedChain.process(markdown);
	return result.toString();
}

interface GenerateEpubHTMLOptions {
	post: PostInfo;
	unifiedChain: ReturnType<typeof createEpubPlugins>;
}

async function generateEpubHTML({
	post,
	unifiedChain,
}: GenerateEpubHTMLOptions) {
	const vfile = await getMarkdownVFile(post);
	const result = await unifiedChain.process(vfile);
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

	const unifiedChain = createEpubPlugins(unified()).use(rehypeReferencePage, {
		collection,
	});

	const contents: Array<{ title: string; data: string }> = [];

	// We cannot use `Promise.all` here because we need to keep the order for the link transform to work
	for (const post of collectionPosts) {
		contents.push({
			title: post.title,
			data: await generateEpubHTML({ post, unifiedChain }),
		});
	}

	const referencePageMarkdown = getReferencePageMarkdown({
		collection,
		collectionPosts,
	});

	console.log(referencePageMarkdown);

	contents.push({
		title: "References",
		data: await generateReferencePageHTML({
			markdown: referencePageMarkdown,
			/**
			 * We need to create a new unified chain because we don't want to modify the original one
			 * and don't want to have the reference page in the final ePub
			 */
			unifiedChain: createEpubPlugins(unified()),
		}),
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
			content: contents,
		} as Partial<EpubOptions> as EpubOptions,
		fileLocation,
	);

	await epub.render();
}

for (const collection of getCollectionsByLang("en")) {
	// This should return a sorted list of posts in the correct order
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
