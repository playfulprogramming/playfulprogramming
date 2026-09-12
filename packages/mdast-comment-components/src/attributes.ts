import { fromHtml } from "hast-util-from-html";

/** Match the HTML parsing and property normalization used by the publisher. */
export function parseComponentAttributes(value: string) {
	const element = fromHtml(`<${value}/>`, { fragment: true }).children[0];
	if (!element || element.type !== "element") return undefined;
	return {
		component: element.tagName,
		attributes: Object.fromEntries(
			Object.entries(element.properties).map(([name, value]) => [
				name,
				Array.isArray(value) ? value.join(" ") : String(value),
			]),
		),
	};
}
