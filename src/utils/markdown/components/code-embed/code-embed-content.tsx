import { useEffect, useState } from "preact/hooks";
import { codeToHtml } from "./code-embed-shiki";

interface CodeEmbedContentProps {
	code: string;
	codeHtml?: string;
	lang: string;
}

export function CodeEmbedContent(props: CodeEmbedContentProps) {
	const [codeHtml, setCodeHtml] = useState<string | undefined>(undefined);

	useEffect(() => {
		// If codeHtml is provided from SSR, do nothing
		if (props.codeHtml) return;

		setCodeHtml(undefined);
		if (props.code.length < 10_000) {
			codeToHtml(props.code, props.lang).then((html) => setCodeHtml(html));
		}
	}, [props.code, props.lang]);

	const codeHtmlToDisplay = props.codeHtml ?? codeHtml;

	if (codeHtmlToDisplay) {
		return <div dangerouslySetInnerHTML={{ __html: codeHtmlToDisplay }}></div>;
	} else {
		return (
			<div>
				<pre class="shiki">
					<code>{props.code}</code>
				</pre>
			</div>
		);
	}
}
