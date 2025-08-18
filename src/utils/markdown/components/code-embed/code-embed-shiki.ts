import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { BundledLanguage, bundledLanguages } from "shiki/langs";
import { transformerRemoveLineBreak } from "@shikijs/transformers";
import githubLight from "@shikijs/themes/github-light";
import githubDark from "@shikijs/themes/github-dark";

const highlighter = await createHighlighterCore({
	themes: [githubLight, githubDark],
	langs: [],
	engine: createJavaScriptRegexEngine(),
});

const transformers = [transformerRemoveLineBreak()];

export async function codeToHtml(code: string, lang: string): Promise<string> {
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
		tabindex: false,
		transformers,
		lang,
	});
}
