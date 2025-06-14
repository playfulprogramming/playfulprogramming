import type * as hast from "hast";
import FileList from "./filetree/file-list.astro";
import InContentAd from "./in-content-ad/in-content-ad.astro";
import LinkPreview from "./link-preview/link-preview.astro";
import Tabs from "./tabs/tabs.astro";
import IframePlaceholder from "../iframes/iframe-placeholder.astro";
import Hint from "./hint/hint.astro";

export interface PlayfulRoot {
	type: "root";
	children: (PlayfulNode | hast.RootContent)[];
}

export interface HtmlNode extends hast.Node {
	type: "html";
	innerHtml: string;
}

export interface ComponentNode<Props = object> extends hast.Node {
	type: "component";
	component: keyof typeof components;
	props: Omit<Props, "children">;
	children: (PlayfulNode | hast.ElementContent)[];
}

export type PlayfulNode = PlayfulRoot | HtmlNode | ComponentNode;

export function isComponentNode(node: unknown): node is ComponentNode {
	return !!(
		node &&
		typeof node === "object" &&
		"type" in node &&
		node.type === "component"
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
	FileList,
	InContentAd,
	LinkPreview,
	Tabs,
	IframePlaceholder,
	Hint,
} as const;

export function createComponent<Key extends keyof typeof components>(
	key: Key,
	props: Omit<Parameters<(typeof components)[Key]>[0], "children">,
	children?: ComponentNode["children"],
): ComponentNode<Parameters<(typeof components)[Key]>[0]> {
	return {
		type: "component",
		component: key,
		props: props,
		children: children ?? [],
	};
}
