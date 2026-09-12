const voidElements = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr",
]);
const paragraphClosers = new Set([
	"address",
	"article",
	"aside",
	"blockquote",
	"details",
	"dialog",
	"div",
	"dl",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"header",
	"hgroup",
	"hr",
	"main",
	"menu",
	"nav",
	"ol",
	"p",
	"pre",
	"section",
	"table",
	"ul",
]);

/** These Markdown blocks produce an HTML element that implicitly closes <p>. */
export const markdownParagraphClosers = new Set([
	"atxHeading",
	"setextHeading",
	"paragraph",
	"blockQuote",
	"listOrdered",
	"listUnordered",
	"codeFenced",
	"codeIndented",
	"thematicBreak",
	"table",
	"mathFlow",
]);

export function updateMarkdownContext(stack: string[], tokenType: string) {
	if (!markdownParagraphClosers.has(tokenType)) return;
	const paragraph = stack.lastIndexOf("p");
	if (paragraph !== -1) stack.length = paragraph;
}

/** Track HTML element context across separate Markdown HTML blocks. */
export function updateHtmlStack(stack: string[], html: string) {
	const tags =
		/<!--[\s\S]*?-->|<![^>]*>|<\/?([a-zA-Z][\w:-]*)(?:[^<>"']|"[^"]*"|'[^']*')*>/g;
	for (const match of html.matchAll(tags)) {
		if (!match[1]) continue;
		const name = match[1].toLowerCase();
		const closing = match[0].startsWith("</");
		const raw = stack.at(-1);
		if (
			(raw === "script" ||
				raw === "style" ||
				raw === "textarea" ||
				raw === "title") &&
			!(closing && raw === name)
		)
			continue;
		if (closing) {
			const index = stack.lastIndexOf(name);
			if (index !== -1) stack.length = index;
		} else {
			if (paragraphClosers.has(name)) {
				const paragraph = stack.lastIndexOf("p");
				if (paragraph !== -1) stack.length = paragraph;
			}
			// Unlike ordinary HTML elements, foreign SVG/MathML roots honor
			// the self-closing flag. A slash in an unquoted value is not that flag.
			const foreignSelfClosing =
				(name === "svg" || name === "math") &&
				/\/>$/.test(match[0]) &&
				!/[\w:-]+\s*=\s*[^\s"'=<>`]+\/>$/.test(match[0]);
			if (!voidElements.has(name) && !foreignSelfClosing) stack.push(name);
		}
	}
}
