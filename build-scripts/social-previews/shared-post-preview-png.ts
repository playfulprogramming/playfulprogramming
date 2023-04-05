import { readFileAsBase64 } from "./utils";
import { ExtendedPostInfo } from "types/index";
import * as fs from "fs";
import { render } from "preact-render-to-string";
import { createElement } from "preact";

import { unified } from "unified";
import remarkParse from "remark-parse";
import { default as remarkTwoslashDefault } from "remark-shiki-twoslash";
import remarkToRehype from "remark-rehype";
import { findAllAfter } from "unist-util-find-all-after";
import rehypeStringify from "rehype-stringify";
import { Layout, PAGE_HEIGHT, PAGE_WIDTH } from "./base";

// https://github.com/shikijs/twoslash/issues/147
const remarkTwoslash =
	(remarkTwoslashDefault as never as { default: typeof remarkTwoslashDefault })
		.default ?? remarkTwoslashDefault;

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

const shikiSCSS = fs.readFileSync("src/styles/shiki.scss", "utf8");

export const renderPostPreviewToString = async (
	layout: Layout,
	post: ExtendedPostInfo
) => {
	const authorImageMap = Object.fromEntries(
		post.authorsMeta.map((author) => [
			author.id,
			readFileAsBase64(author.profileImgMeta.absoluteFSPath),
		])
	);

	const postHtml = await markdownToHtml(post.contentMeta);

	return `
	<!DOCTYPE html>
	<html>
	<head>
	<style>
	${shikiSCSS}

	${layout.css}

	html, body {
		margin: 0;
  		padding: 0;
		width: ${PAGE_WIDTH}px;
		height: ${PAGE_HEIGHT}px;
		position: relative;
		overflow: hidden;
	}
	</style>
	</head>
	<body>
	${render(
		createElement(layout.Component, {
			post,
			postHtml,
			width: PAGE_WIDTH,
			height: PAGE_HEIGHT,
			authorImageMap,
		})
	)}
	</body>
	</html>
	`;
};
