import type { Root, Element } from "hast";
import { Plugin } from "unified";
import { SKIP, visit } from "unist-util-visit";

/**
 * This rehype plugin is needed to grab the meta string from all codeblocks
 * to provide to shiki.
 *
 * This makes assumptions about the VFile passed through unified:
 * - That it provides a String value
 * - That it specifies source positions for codeblock <code> elements
 *
 * The obtained meta string is set on node.data.meta - per:
 * https://github.com/shikijs/shiki/blob/main/packages/rehype/src/core.ts#L109
 */
export const rehypeCodeblockMeta: Plugin<[], Root> = () => {
	return (tree, vfile) => {
		visit(
			tree,
			{ type: "element", tagName: "code" },
			(node: Element, _, parent) => {
				// Only match <pre><code>...</code></pre>
				if (parent?.type !== "element" || parent?.tagName !== "pre")
					return SKIP;

				// Codeblock metadata looks like: ```tsx {1,3-5}
				// - we want to grab the "{1,3-5}"

				const codeblock = String(vfile.value).slice(
					node.position!.start.offset,
					node.position!.end.offset,
				);

				// Don't try to use regex here, it breaks things.
				const metaStart = codeblock.indexOf(" ");
				const metaEnd = codeblock.indexOf("\n");
				if (metaStart === -1 || metaEnd === -1 || metaEnd < metaStart) return;

				const meta = codeblock.slice(metaStart + 1, metaEnd).trim();

				if (meta) {
					(node.data ??= {} as never).meta = meta;
				}
			},
		);
	};
};
