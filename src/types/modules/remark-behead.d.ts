declare module "remark-behead" {
	import type { Node } from "unist";
	import type { Root } from "mdast";
	import type { Plugin } from "unified";

	export interface BeheadOptions {
		depth: number;
		after: number | string | Node;
		before: number | string | Node;
		between: [number | string | Node, number | string | Node];
	}
	const plugin: Plugin<[BeheadOptions?] | void[], Root, string>;
	export default plugin;
}
