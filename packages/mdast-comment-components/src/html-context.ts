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
			if (!voidElements.has(name)) stack.push(name);
		}
	}
}
