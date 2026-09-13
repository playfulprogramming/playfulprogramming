import type { Element } from "hast";

/** Returns the `language-*` suffix of a `<pre><code>` block, if any. */
export function getCodeLanguage(node: Element): string | undefined {
	const code = node.children.find(
		(child): child is Element =>
			child.type === "element" && child.tagName === "code",
	);
	const classNames = Array.isArray(code?.properties.className)
		? code.properties.className.map(String)
		: [];
	return classNames
		.find((className) => className.startsWith("language-"))
		?.slice("language-".length);
}
