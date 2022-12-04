import { readFileAsBase64 } from "./read-file-as-base64";
import { dirname, resolve } from "path";
import { PostInfo } from "types/index";
import { promises as fs } from "fs";
import { render } from "preact-render-to-string";
import { createElement } from "preact";
import { fileURLToPath } from "url";
import { COLORS } from "constants/theme";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkTwoslash from "remark-shiki-twoslash";
import remarkToRehype from "remark-rehype";
import { findAllAfter } from "unist-util-find-all-after";
import rehypeStringify from "rehype-stringify";

const unifiedChain = () => {
	const unifiedChain = unified()
		.use(remarkParse)
		.use(() => (tree) => {
			// extract code snippets from parsed markdown
			const nodes = findAllAfter(tree, 0, { type: "code" });

			// join code parts into one element
			const value =
				nodes
					.map((node) => (node as any).value)
					.join("\n")
					.trim() +
				"\n" +
				renderPostPreviewToString
					.toString()
					.replace(/([;,])/g, (s) => s + "\n");

			return {
				type: "root",
				children: [
					{
						type: "code",
						lang: (nodes[0] as any)?.lang || "javascript",
						value,
					},
				],
			};
		})
		.use([[remarkTwoslash, { themes: ["css-variables"] }]])
		.use(remarkToRehype, { allowDangerousHtml: true })
		.use(rehypeStringify, { allowDangerousHtml: true });

	return unifiedChain;
};

async function markdownToHtml(content: string) {
	return await (await unifiedChain().process(content)).toString();
}

//const __dirname = dirname(fileURLToPath(import.meta.url));

const colorsCSS = (Object.keys(COLORS) as Array<keyof typeof COLORS>).reduce(
	(stylesheetStr, colorKey, i, arr) => {
		let str = stylesheetStr + `\n--${colorKey}: ${COLORS[colorKey].light};`;
		if (i === arr.length - 1) str += "\n}";
		return str;
	},
	":root {\n"
);

export const heightWidth = { width: 1280, height: 640 };

const unicornUtterancesHead = readFileAsBase64(
	resolve(__dirname, "../../assets/unicorn_head_1024.png")
);

export const renderPostPreviewToString = async (post: PostInfo) => {
	const shikiSCSS = await fs.readFile(
		resolve(__dirname, "../../styles/shiki.scss"),
		"utf8"
	);

	const twitterLargeCardPreviewCSS = await fs.readFile(
		resolve(__dirname, "./twitter-large-card.css"),
		"utf8"
	);

	// This needs to happen here, since otherwise the `import` is stale at runtime,
	// thus breaking live refresh
	const TwitterLargeCard = // We need `?update=""` to cache bust for live reload
		(await import(`./twitter-large-card.tsx?update=${Date.now()}`)).default;

	const authorImagesStrs = post.authorsMeta.map((author) =>
		readFileAsBase64(author.profileImgMeta.absoluteFSPath)
	);

	const postHtml = await markdownToHtml(post.contentMeta);

	return `
	<!DOCTYPE html>
	<html>
	<head>
	<style>
	${shikiSCSS}
	</style>
	<style>
	${colorsCSS}
	</style>
	<style>
	${twitterLargeCardPreviewCSS}
	</style>
	</head>
	<body>
	${render(
		createElement(TwitterLargeCard, {
			post,
			postHtml,
			...heightWidth,
			authorImagesStrs,
			unicornUtterancesHead,
		})
	)}
	</body>
	</html>
	`;
};
