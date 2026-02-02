import { visit } from "unist-util-visit";
import { Element } from "hast";
import { createHTMLVisitor } from "utils/markdown/data-providers/common";

export async function getGenericOEmbedDataFromUrl<T>(
	url: string,
): Promise<T | null> {
	// HTML
	const pageData = await fetch(url)
		.then((res) => (res.ok ? res : Promise.reject(res)))
		.then((res) => res.text());

	if (!pageData) return null;

	let linkToJSON: string | null = null;

	const visitor = createHTMLVisitor((tree) => {
		visit(tree, { tagName: "link" }, (_node) => {
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

export async function getIFrameAttributes(html: string) {
	let properties = {} as Record<string, unknown>;
	const visitor = createHTMLVisitor((tree) => {
		visit(tree, { tagName: "iframe" }, (_node) => {
			if (!_node) return;
			const node: Element = _node;
			properties = node.properties;
		});
	});

	visitor.processSync(html);
	return properties;
}
