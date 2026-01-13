import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { Node, Element } from "hast";
import { visit } from "unist-util-visit";
import rehypeStringify from "rehype-stringify";

function createHTMLVisitor(visitor: (tree: Node) => void) {
	return unified()
		.use(rehypeParse, { fragment: true } as never)
		.use(() => (tree) => {
			visitor(tree);
		})
		.use(rehypeStringify);
}

export async function getOEmbedDataFromUrl<T>(url: string): Promise<T | null> {
	// HTML
	const pageData = await fetch(url)
		.then((res) => (res.ok ? res : Promise.reject(res)))
		.then((res) => res.text());

	if (!pageData) return null;

	let linkToJSON: string | null = null;

	const visitor = createHTMLVisitor((tree) => {
		visit(tree, {tagName: "link"}, (_node) => {
			const node: Element = _node;
			if (
				node.properties &&
				node.properties.type &&
				// TODO: Handle "text/xml+oembed"
				// TODO: Handle Link headers
				node.properties.type === "application/json+oembed"
			) {
				linkToJSON = node.properties.href as string;
			}
		});
	});

	visitor.processSync(pageData);

	if (!linkToJSON) return null;

	return await fetch(linkToJSON)
		.then((res) => (res.ok ? res : Promise.reject(res)))
		.then((res) => res.json());
}
