import type { Root } from "hast";
import type { Plugin } from "unified";
import type { Root as MdastRoot } from "mdast";
import { type Features, markdownToHast, markdownToMdast } from "satteri";

export const satteriParse: Plugin<[Partial<Features>?], string, Root> =
	function (features = {}) {
		this.parser = (document) => {
			const tree = markdownToHast(document, {
				features: {
					gfm: true,
					frontmatter: true,
					math: true,
					// HTML is set to raw for rehype-raw to track node positions
					rawHtml: false,
					...features,
				},
				position: true,
			});
			if (tree.type !== "root") {
				throw new Error(`Expected a root node, got ${tree.type}`);
			}

			return tree;
		};
	};

/** Parses markdown to mdast; frontmatter is kept as a `yaml` node. */
export function parseMdast(source: string): MdastRoot {
	const tree = markdownToMdast(source, {
		features: { gfm: true, frontmatter: true, math: false, rawHtml: false },
		position: true,
	});
	if (tree.type !== "root") {
		throw new Error(`Expected a root node, got ${tree.type}`);
	}
	return tree;
}
