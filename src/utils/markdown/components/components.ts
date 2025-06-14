import type * as hast from "hast";
import FileList from "./filetree/file-list.astro";
import InContentAd from "./in-content-ad/in-content-ad.astro";
import LinkPreview from "./link-preview/link-preview.astro";
import Tabs from "./tabs/tabs.astro";
import IframePlaceholder from "../iframes/iframe-placeholder.astro";

export interface HtmlNode extends hast.Node {
	type: "html";
	innerHtml: string;
}

export interface ComponentNode<Props = object> extends hast.Node {
	type: "component";
	component: keyof typeof components;
	props: Props;
}

export type Node = HtmlNode | ComponentNode;

export const components = {
	FileList,
	InContentAd,
	LinkPreview,
	Tabs,
	IframePlaceholder,
} as const;

export function createComponent<Key extends keyof typeof components>(
	key: Key,
	props: Parameters<(typeof components)[Key]>[0],
): ComponentNode<Parameters<(typeof components)[Key]>[0]> {
	return {
		type: "component",
		component: key,
		props: props,
	};
}
