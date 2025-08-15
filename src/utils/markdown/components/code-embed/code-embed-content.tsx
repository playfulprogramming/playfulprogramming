import { useEffect, useState } from "preact/hooks";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { BundledLanguage, bundledLanguages } from "shiki/langs";
import {
	transformerRemoveLineBreak,
} from "@shikijs/transformers";

const highlighter = await createHighlighterCore({
	themes: [
		import("@shikijs/themes/github-light"),
		import("@shikijs/themes/github-dark"),
	],
	langs: [],
	engine: createJavaScriptRegexEngine(),
});

const transformers = [transformerRemoveLineBreak()];

interface CodeEmbedContentProps {
	code: string;
	lang: string;
}

async function codeToHtml(code: string, lang: string): Promise<string> {
	if (!highlighter.getLoadedLanguages().includes(lang)) {
		const languagePromise = bundledLanguages[lang as BundledLanguage];
		if (languagePromise) {
			await highlighter.loadLanguage(await languagePromise());
		}
	}

	return highlighter.codeToHtml(code, {
		themes: {
			light: "github-light",
			dark: "github-dark",
		},
		transformers,
		lang,
	});
}

export function CodeEmbedContent(props: CodeEmbedContentProps) {
	const [codeHtml, setCodeHtml] = useState<string | undefined>(undefined);

	useEffect(() => {
		setCodeHtml(undefined);
		if (props.code.length < 10_000) {
			codeToHtml(props.code, props.lang).then(html => setCodeHtml(html));
		}
	}, [props.code, props.lang]);

	if (codeHtml) {
		return (
			<div dangerouslySetInnerHTML={{ __html: codeHtml }}></div>
		);
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
