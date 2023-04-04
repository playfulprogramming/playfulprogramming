import { readFileAsBase64 } from "./utils";
import { PostInfo } from "types/index";
import * as fs from "fs";
import { render } from "preact-render-to-string";
import { createElement } from "preact";
import { COLORS } from "constants/theme";

import { unified } from "unified";
import remarkParse from "remark-parse";
import { default as remarkTwoslashDefault } from "remark-shiki-twoslash";
import remarkToRehype from "remark-rehype";
import { findAllAfter } from "unist-util-find-all-after";
import rehypeStringify from "rehype-stringify";

import banner from "./layouts/banner";
import twitterPreview from "./layouts/twitter-preview";
import { Layout } from "./base";

export const layouts: Layout[] = [banner, twitterPreview];

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

const colorsCSS = (Object.keys(COLORS) as Array<keyof typeof COLORS>).reduce(
	(stylesheetStr, colorKey, i, arr) => {
		let str = stylesheetStr + `\n--${colorKey}: ${COLORS[colorKey].light};`;
		if (i === arr.length - 1) str += "\n}";
		return str;
	},
	":root {\n"
);

export const heightWidth = { width: 1280, height: 640 };

const shikiSCSS = fs.readFileSync("src/styles/shiki.scss", "utf8");

export const renderPostPreviewToString = async (
	layout: Layout,
	post: PostInfo
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
	</style>
	<style>
	${colorsCSS}
	</style>
	<style>
	${layout.css}
	</style>
	<style>
	html, body {
		margin: 0;
  		padding: 0;
		width: ${heightWidth.width}px;
		height: ${heightWidth.height}px;
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
			...heightWidth,
			authorImageMap,
		})
	)}
	</body>
	</html>
	`;
};
