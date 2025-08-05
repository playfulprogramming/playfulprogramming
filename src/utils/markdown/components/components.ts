import type * as hast from "hast";
import CodeEmbed from "./code-embed/code-embed.astro";
import FileList from "./filetree/file-list.astro";
import InContentAd from "./in-content-ad/in-content-ad.astro";
import LinkPreview from "./link-preview/link-preview.astro";
import Tabs from "./tabs/tabs.astro";
import IframePlaceholder from "../iframes/iframe-placeholder.astro";
import Hint from "./hint/hint.astro";
import Tooltip from "./tooltip/tooltip.astro";

export interface PlayfulRoot {
	type: "root";
	children: (PlayfulNode | hast.ElementContent)[];
}

export interface HtmlNode extends hast.Node {
	type: "html";
	innerHtml: string;
}

export interface ComponentMarkupNode extends hast.Node {
	type: "playful-component-markup";
	component: string;
	attributes: Record<string, string>;
	children: (PlayfulNode | hast.ElementContent)[];
}

export interface ComponentNode<Props = object> extends hast.Node {
	type: "playful-component";
	component: keyof typeof components;
	props: Omit<Props, "children">;
	children: (PlayfulNode | hast.ElementContent)[];
}

export type PlayfulNode =
	| PlayfulRoot
	| HtmlNode
	| ComponentNode
	| ComponentMarkupNode;

export function isComponentNode(node: unknown): node is ComponentNode {
	return !!(
		node &&
		typeof node === "object" &&
		"type" in node &&
		node.type === "playful-component"
	);
}

export function isComponentMarkup(node: unknown): node is ComponentMarkupNode {
	return !!(
		typeof node === "object" &&
		node &&
		"type" in node &&
		node.type === "playful-component-markup"
	);
}

export function isHtmlNode(node: unknown): node is HtmlNode {
	return !!(
		node &&
		typeof node === "object" &&
		"type" in node &&
		node.type === "html"
	);
}

export const components = {
	CodeEmbed,
	FileList,
	InContentAd,
	LinkPreview,
	Tabs,
	Tooltip,
	IframePlaceholder,
	Hint,
} as const;

export function createComponent<Key extends keyof typeof components>(
	key: Key,
	props: Omit<Parameters<(typeof components)[Key]>[0], "children">,
	children: ComponentNode["children"] = [],
): ComponentNode<Parameters<(typeof components)[Key]>[0]> {
	return {
		type: "playful-component",
		component: key,
		props,
		children,
	};
}
