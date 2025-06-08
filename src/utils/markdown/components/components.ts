import type * as hast from "hast";
import Tabs from "./tabs/tabs.astro";

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
	tabs: Tabs,
} as const;

export function createComponent<
	Key extends keyof typeof components,
	Props = Parameters<(typeof components)[Key]>[0],
>(key: Key, props: Props): ComponentNode<Props> {
	return {
		type: "component",
		component: key,
		props: props,
	};
}
