import { unified } from "unified";
import { Node } from "unist";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";

export function createHTMLVisitor(visitor: (tree: Node) => void) {
	return unified()
		.use(rehypeParse, { fragment: true } as never)
		.use(() => (tree) => {
			visitor(tree);
		})
		.use(rehypeStringify);
}
