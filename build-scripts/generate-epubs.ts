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
import { escapeHtml, fetchPageHtml, getPageTitle } from "utils/fetch-page-html";
import { rehypeRemoveCollectionLinks } from "utils/markdown/rehype-remove-collection-links";

interface GetReferencePageMarkdownOptions {
	collection: CollectionInfo;
	collectionPosts: PostInfo[];
}

async function getReferencePageHtml({
	collection,
	collectionPosts,
}: GetReferencePageMarkdownOptions) {
	const collectionMeta = collectionMetaRecord.get(collection.slug);

	const links = await Promise.all(
		collectionMeta?.links?.map(async (link) => {
			const srcHast = await fetchPageHtml(link.originalHref);
			if (!srcHast)
				return {
					...link,
					title: link.originalText,
				};

			const title = getPageTitle(srcHast);
			return {
				...link,
				title: title ?? link.originalText,
			};
		}) ?? [],
	);

	return `
${collectionPosts
	.map((chapter) => {
		const chapterMetaLinks = links.filter(
			(link) => link.associatedChapterOrder === chapter.order,
		);

		if (!chapterMetaLinks?.length) {
			return `
<h2 id="${collection.slug}-${chapter.order}">${chapter.title.trim()}</h2>

<p>No links for this chapter</p>
`.trim();
		}

		// TODO: `<ol start="">` Blocked by: https://github.com/lesjoursfr/html-to-epub/issues/140
		return `
<h2 id="${collection.slug}-${chapter.order}">${chapter.title.trim()}</h2>

<ol start="${chapterMetaLinks[0].countWithinCollection}">
${chapterMetaLinks
	.map((link) => {
		return `
<li style="white-space: pre-line; margin-top: 2rem; margin-bottom: 2rem;">${escapeHtml(link.title.trim())}:

<a href="${link.originalHref.trim()}">${link.originalHref.trim()}</a></li>
`.trim();
	})
	.join("\n")}
</ol>
`.trim();
	})
	.join("\n\n")}
`.trim();
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

	const referenceTitle = "References";

	const unifiedChain = createEpubPlugins(unified())
		.use(rehypeRemoveCollectionLinks, {
			collection,
		})
		.use(rehypeReferencePage, {
			collection,
			collectionPosts,
			referenceTitle,
		});

	const contents: Array<{ title: string; data: string }> = [];

	// We cannot use `Promise.all` here because we need to keep the order for the link transform to work
	for (const post of collectionPosts) {
		contents.push({
			title: post.title,
			data: await generateEpubHTML({ post, unifiedChain }),
		});
	}

	contents.push({
		title: referenceTitle,
		data: await getReferencePageHtml({
			collection,
			collectionPosts,
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

					pre.shiki code {
						white-space: normal;
					}

					pre.shiki span.line {
						display: block;
						white-space: pre-wrap;
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
