import { HTMLAttributes } from "preact/compat";
import { useMemo } from "preact/hooks";
import type { Element } from "hast";

interface RawSvgProps extends HTMLAttributes<SVGElement> {
	icon: string;
}

// when running in SSR, use hast/fromHtml - otherwise, use the browser API
let extractSvg: (html: string) => {
	attributes: Record<string, unknown>,
	innerHTML: string,
};
if (import.meta.env.SSR) {
	const { fromHtml } = await import("hast-util-from-html");
	const { find } = await import("unist-util-find");

	extractSvg = (html) => {
		const root = fromHtml(html);
		const svgEl = find<Element>(root, { tagName: "svg" });
		if (!svgEl) {
			throw "Unable to find SVG Element";
		}
		const svgStartOffset = svgEl.children.at(0)?.position?.start?.offset ?? 0;
		const svgEndOffset = svgEl.children.at(-1)?.position?.end?.offset ?? 0;
		const attributes = Object.fromEntries(
			Object.entries(svgEl.properties)
			.map(([key, value]) => {
				return [key, value instanceof Array ? value.join(" ") : String(value)];
			})
		);
		const innerHTML = html.substring(svgStartOffset, svgEndOffset);
		return { attributes, innerHTML };
	};
} else {
	extractSvg = (html) => {
		const parser = new DOMParser();
		const svgDocument = parser.parseFromString(html, "text/html");
		const svgElement = svgDocument.querySelector("svg")!;
		const attributes = Object.fromEntries(
			svgElement
				.getAttributeNames()
				.map((name) => [name, svgElement.getAttribute(name)]),
		);
		return { attributes, innerHTML: svgElement.innerHTML };
	};
}

export function RawSvg({ icon, ref, ...props }: RawSvgProps) {
	const { attributes, innerHTML } = useMemo(() => {
		return extractSvg(icon);
	}, [icon]);

	return (
		<svg
			{...attributes}
			{...props}
			dangerouslySetInnerHTML={{ __html: innerHTML }}
		/>
	);
}
