import { useEffect, useState } from "preact/hooks";
import { codeToHtml } from "./code-embed-shiki.ts";

interface CodeEmbedContentProps {
	url: string;
	codeHtml?: string;
	lang: string;
}

export function CodeEmbedContent(props: CodeEmbedContentProps) {
	const [code, setCode] = useState<string>();
	const [codeHtml, setCodeHtml] = useState<string>();

	useEffect(() => {
		// If codeHtml is provided from SSR, do nothing
		if (props.codeHtml) return;

		let stale = false;
		setCode(undefined);
		setCodeHtml(undefined);
		fetch(props.url)
			.then((response) => response.text())
			.then(async (text) => {
				if (stale) return;
				setCode(text);
				if (text.length < 10_000)
					setCodeHtml(await codeToHtml(text, props.lang));
			});
		return () => {
			stale = true;
		};
	}, [props.url, props.lang, props.codeHtml]);

	const codeHtmlToDisplay = props.codeHtml ?? codeHtml;

	if (codeHtmlToDisplay) {
		return <div dangerouslySetInnerHTML={{ __html: codeHtmlToDisplay }} />;
	}
	return (
		<div>
			<pre class="shiki">
				<code>{code}</code>
			</pre>
		</div>
	);
}
