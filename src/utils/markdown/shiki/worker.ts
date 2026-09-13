import rehypeShikiFromHighlighter, {
	type RehypeShikiCoreOptions,
} from "@shikijs/rehype/core";
import type { Root, Element } from "hast";
import { VFile } from "vfile";
import {
	transformerMetaHighlight,
	transformerNotationHighlight,
	transformerRemoveLineBreak,
} from "@shikijs/transformers";
import {
	type DynamicImportLanguageRegistration,
	type LanguageRegistration,
	bundledLanguages,
	createHighlighter,
	isSpecialLang,
} from "shiki";
import { getCodeLanguage } from "./get-code-language.ts";

const themes = {
	light: "github-light",
	dark: "github-dark",
};

const options: RehypeShikiCoreOptions = {
	themes,
	// code blocks use wrapping and not scroll overview, so they don't need to be focusable
	tabindex: false,
	transformers: [
		// supports "[!code highlight]" transforms to add a .highlight class
		transformerNotationHighlight({
			classActiveLine: "highlight",
			matchAlgorithm: "v3",
		}),
		// supports "``` {1,3-4}" transforms to add a .highlight class
		transformerMetaHighlight({
			className: "highlight",
		}),
		transformerRemoveLineBreak(),
	],
};

const highlighter = await createHighlighter({
	themes: Object.values(themes),
	langs: [],
});

type Grammars = Map<string, LanguageRegistration[]>;

const languages: Partial<Record<string, DynamicImportLanguageRegistration>> =
	bundledLanguages;

// recursively gets embedded languages for the given grammar
async function collectGrammars(
	lang: string,
	seen = new Set<string>(),
): Promise<Grammars> {
	const collected: Grammars = new Map();
	const stack = [lang];
	// we do this serially since it's fast and there are unfun data races with concurrency
	for (let next = stack.pop(); next !== undefined; next = stack.pop()) {
		if (seen.has(next) || isSpecialLang(next)) continue;
		seen.add(next);
		const loadGrammars = languages[next];
		if (!loadGrammars) throw new Error(`Unknown language "${next}"`);
		// shiki dynamically imports each grammar it needs
		const grammars = (await loadGrammars()).default;
		collected.set(next, grammars);
		const embedded = grammars.flatMap((g) => g.embeddedLangsLazy ?? []);
		stack.push(...embedded.reverse());
	}
	return collected;
}

// memoizes promises per language to avoid duplication or missing highlights
const languageLoads = new Map<string, Promise<void>>();

function loadLanguage(lang: string): Promise<void> {
	let load = languageLoads.get(lang);
	if (!load) {
		load = (async () => {
			const loaded = new Set(highlighter.getLoadedLanguages());
			const grammars = [...(await collectGrammars(lang))]
				.filter(([name]) => !loaded.has(name))
				.flatMap(([, grammars]) => grammars);
			if (grammars.length) await highlighter.loadLanguage(...grammars);
		})();
		languageLoads.set(lang, load);
	}
	return load;
}

// scan for language in language implicit textmate grammar loaded within a codefence to load properly. Eg css in js
const injecting: LanguageRegistration[] = [];
const seen = new Set<string>();
for (const [lang, loadGrammars] of Object.entries(bundledLanguages)) {
	const grammars = (await loadGrammars()).default;
	if (grammars.some((grammar) => grammar.injectTo)) {
		for (const found of (await collectGrammars(lang, seen)).values()) {
			injecting.push(...found);
		}
	}
}
await highlighter.loadLanguage(...injecting);

const shiki = rehypeShikiFromHighlighter(highlighter, options);

export default async function transform(node: Element): Promise<Element> {
	const lang = getCodeLanguage(node);
	if (lang) await loadLanguage(lang);

	const tree: Root = {
		type: "root",
		children: [node],
	};
	await shiki(tree, new VFile(), () => undefined);
	return tree.children[0] as Element;
}
