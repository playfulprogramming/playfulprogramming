import path from "path";
import { promises as fs } from "fs";
import emojiRegexFn from "emoji-regex";
import { EPub, defaultAllowedAttributes } from "@lesjoursfr/html-to-epub";
import { unified } from "unified";
import { CollectionInfo, PostInfo } from "types/index";
import { getPersonById } from "utils/api";
import { createEpubPlugins } from "utils/markdown/createEpubPlugins";
import { getMarkdownVFile } from "utils/markdown/getMarkdownVFile";
import { getUrlMetadata } from "utils/hoof/get-url-metadata";
import { CollectionLinks } from "utils/markdown/reference-page/rehype-reference-page";
import epubCss from "./epub.css?raw";
import { tmpdir } from "os";

const emojiRegex = emojiRegexFn();

interface GetReferencePageMarkdownOptions {
	collection: CollectionInfo;
	collectionPosts: PostInfo[];
	collectionLinks: CollectionLinks[];
}

function escapeHtml(unsafe: string) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

async function getReferencePageHtml({
	collection,
	collectionPosts,
	collectionLinks,
}: GetReferencePageMarkdownOptions) {
	const links = await Promise.all(
		collectionLinks.map(async (link) => {
			const metadata = await getUrlMetadata(link.originalHref).catch(
				() => undefined,
			);
			if (!metadata || metadata.error) {
				console.error(
					"Failed to fetch metadata for collection link",
					link.originalHref,
				);
			}

			return {
				...link,
				title: metadata?.title ?? link.originalText,
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

interface GenerateEpubHTMLOptions {
	post: PostInfo;
	collectionLinks: CollectionLinks[];
	unifiedChain: ReturnType<typeof createEpubPlugins>;
}

async function generateEpubHTML({
	post,
	collectionLinks,
	unifiedChain,
}: GenerateEpubHTMLOptions) {
	const vfile = await getMarkdownVFile(post);
	vfile.data.collectionLinks = collectionLinks;

	// Replace our Prettier useTabs with two spaces for ebook consistency
	let contents = vfile.value.toString();
	let didReplace = true;
	while (didReplace) {
		didReplace = false;
		// Only replace tabs at the start of the line
		const newContents = contents.replace
			? contents.replace(/^\t+/gm, (tabs) => "  ".repeat(tabs.length))
			: contents;
		if (newContents !== contents) {
			didReplace = true;
			contents = newContents;
		}
	}
	vfile.value = contents;

	const result = await unifiedChain.process(vfile);
	const html = result.toString();
	return html.replace(emojiRegex, "");
}

type EpubOptions = ConstructorParameters<typeof EPub>[0];

const unifiedChain = createEpubPlugins(unified());

export async function generateCollectionEPub(
	collection: CollectionInfo,
	collectionPosts: PostInfo[],
): Promise<ArrayBuffer> {
	const fileTmpDir = await fs.mkdtemp(tmpdir() + path.sep + "pfp-collection-");
	const fileLocation = path.join(fileTmpDir, `${collection.slug}.epub`);

	const authors = collection.authors
		.map((id) => getPersonById(id, collection.locale)?.name)
		.filter((name): name is string => !!name);

	const referenceTitle = "References";

	const contents: Array<{ title: string; data: string }> = [];
	const collectionLinks: CollectionLinks[] = [];

	// We cannot use `Promise.all` here because we need to keep the order for the link transform to work
	for (const post of collectionPosts) {
		contents.push({
			title: post.title,
			data: await generateEpubHTML({ post, collectionLinks, unifiedChain }),
		});
	}

	const referencePageHTML = await getReferencePageHtml({
		collection,
		collectionPosts,
		collectionLinks,
	});

	contents.push({
		title: referenceTitle,
		data: referencePageHTML.replace(emojiRegex, ""),
	});

	const epub = new EPub(
		{
			title: collection.title,
			author: authors,
			publisher: "Playful Programming",
			cover: collection.coverImgMeta.absoluteFSPath,
			allowedAttributes: [...defaultAllowedAttributes, "start", "colSpan"],
			css: epubCss,
			// fonts: ['/path/to/Merriweather.ttf'],
			lang: collection.locale,
			content: contents,
		} as Partial<EpubOptions> as EpubOptions,
		fileLocation,
	);

	await epub.render();
	const buffer = await fs.readFile(fileLocation);
	await fs.rm(fileTmpDir, { recursive: true, force: true });
	return buffer;
}
