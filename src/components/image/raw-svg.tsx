import { HTMLAttributes } from "preact/compat";
import { useMemo } from "preact/hooks";

interface RawSvgProps extends HTMLAttributes<SVGElement> {
	icon: string;
}

// when running in SSR, use jsdom - otherwise, use the browser API
let DOMParserConstructor: typeof DOMParser;
if (import.meta.env.SSR) {
	const { JSDOM } = await import("jsdom");
	DOMParserConstructor = new JSDOM().window.DOMParser;
} else {
	DOMParserConstructor = DOMParser;
}

export function RawSvg({ icon, ref, ...props }: RawSvgProps) {
	const [attributes, innerHtml] = useMemo(() => {
		const parser = new DOMParserConstructor();
		const svgDocument = parser.parseFromString(icon, "text/html");
		const svgElement = svgDocument.querySelector("svg")!;
		const attributes = Object.fromEntries(
			svgElement
				.getAttributeNames()
				.map((name) => [name, svgElement.getAttribute(name)]),
		);
		return [attributes, svgElement.innerHTML];
	}, [icon]);

	return (
		<svg {...attributes} {...props} dangerouslySetInnerHTML={{ __html: innerHtml }} />
	);
}
