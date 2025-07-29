import { RehypeFunctionComponent } from "../types";
import path from "path";
import fs from "fs/promises";
import { getStackblitzUrl } from "./getStackblitzUrl";
import { logError } from "utils/markdown/logger";
import { Plugin } from "unified";
import {
	ComponentMarkupNode,
	createComponent,
	PlayfulRoot,
} from "../components";
import { visit } from "unist-util-visit";
import { Element } from "hast";
import { runShiki } from "utils/markdown/shiki/shiki-pool";
import { toHtml } from "hast-util-to-html";

/**
 * Transforms pfp-code iframes into a "code-embed" component
 * Expects: <iframe data-frame-title="Title" src="pfp-code:./project-slug?file=src%2Findex.ts"></iframe>
 */
export const rehypeCodeEmbed: Plugin<[], PlayfulRoot> = () => {
	return (tree, vfile) => {
		visit(
			tree,
			{ type: "element", tagName: "iframe" },
			(node, index, parent) => {
				if (index === undefined) return;

				const src = String(node.properties.src);

				if (!URL.canParse(src)) {
					logError(vfile, node, `Cannot parse URL '${src}'`);
					return;
				}

				const srcUrl = new URL(src);
				if (srcUrl.protocol !== "pfp-code:") return;

				const title = node.properties.dataFrameTitle?.toString();
				const project = srcUrl.pathname.replace(/[\/.]/g, "");
				const file = srcUrl.searchParams.get("file") ?? undefined;

				const replacement: ComponentMarkupNode = {
					type: "playful-component-markup",
					position: node.position,
					component: "code-embed",
					attributes: {
						project,
						title,
						file,
					},
					children: [],
				};

				parent?.children.splice(index, 1, replacement);
			},
		);
	};
};

export const transformCodeEmbed: RehypeFunctionComponent = async (props) => {
	const file = props.attributes.file;
	const project = props.attributes.project;
	const projectDir = path.join(
		path.relative(process.cwd(), props.vfile.path),
		"..",
		project,
	);
	const editUrl = getStackblitzUrl(projectDir, { file });

	const fileContent = await fs.readFile(path.join(projectDir, file), "utf-8");
	const element: Element = {
		type: "element",
		tagName: "pre",
		properties: {},
		children: [
			{
				type: "element",
				tagName: "code",
				properties: {
					className: [`language-${path.extname(file).substring(1)}`],
				},
				children: [
					{
						type: "text",
						value: fileContent,
					},
				],
			},
		],
	};

	const shikiElement = await runShiki(element);
	const shikiHtml = toHtml(shikiElement);

	return [
		createComponent("CodeEmbed", {
			project,
			title: props.attributes.title,
			file,
			codeHtml: shikiHtml,
			editUrl,
		}),
	];
};
