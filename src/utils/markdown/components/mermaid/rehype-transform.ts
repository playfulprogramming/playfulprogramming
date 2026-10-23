import { toString } from "hast-util-to-string";
import { isElement } from "#utils/markdown/unist-is-element.ts";
import type { MarkdownVFile } from "#utils/markdown/types.ts";
import { createComponent } from "../components.ts";
import type { RehypeFunctionComponent } from "../types.ts";

const isWhitespace = (node: { type: string; value?: string }) =>
	node.type === "text" && !node.value?.trim();

export const transformMermaid: RehypeFunctionComponent = ({
	vfile,
	node,
	children,
}) => {
	const content = children.filter((child) => !isWhitespace(child));
	const pre = content.length === 1 ? content[0] : undefined;

	if (!isElement(pre) || pre.tagName !== "pre") {
		vfile.message("Mermaid must contain exactly one fenced code block.", {
			place: node.position,
			source: "rehype-mermaid",
			ruleId: "invalid-content",
		});
		return [];
	}

	const codeChildren = pre.children.filter((child) => !isWhitespace(child));
	const code = codeChildren.length === 1 ? codeChildren[0] : undefined;
	const classNames =
		isElement(code) && Array.isArray(code.properties.className)
			? code.properties.className.map(String)
			: [];

	if (
		!isElement(code) ||
		code.tagName !== "code" ||
		!classNames.includes("language-mermaid")
	) {
		vfile.message("Mermaid must use a ```mermaid fenced code block.", {
			place: node.position,
			source: "rehype-mermaid",
			ruleId: "invalid-language",
		});
		return [];
	}

	const graph = toString(code).trim();
	if (!graph) {
		vfile.message("Mermaid diagram source cannot be empty.", {
			place: node.position,
			source: "rehype-mermaid",
			ruleId: "empty-diagram",
		});
		return [];
	}

	(vfile as MarkdownVFile).data.isMermaidUsed = true;

	return [createComponent("Mermaid", { graph })];
};
