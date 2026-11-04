import { create_renderer } from "@twinkleplop/markdown-core";
import { shiki_notation } from "@twinkleplop/annotation/shiki";
import { language as bash } from "@twinkleplop/bash";
import { language as css } from "@twinkleplop/css";
import { language as diff } from "@twinkleplop/diff";
import { language as go } from "@twinkleplop/go";
import { language as html } from "@twinkleplop/html";
import { language as http } from "@twinkleplop/http";
import { language as javascript } from "@twinkleplop/javascript";
import { language as json } from "@twinkleplop/json";
import { language as jsonc } from "@twinkleplop/jsonc";
import { language as markdown } from "@twinkleplop/markdown";
import { language as python } from "@twinkleplop/python";
import { language as rust } from "@twinkleplop/rust";
import { language as shellsession } from "@twinkleplop/shellsession";
import { language as sql } from "@twinkleplop/sql";
import { language as svelte } from "@twinkleplop/svelte";
import { language as toml } from "@twinkleplop/toml";
import { language as tsx } from "@twinkleplop/tsx";
import { language as typescript } from "@twinkleplop/typescript";
import { language as yaml } from "@twinkleplop/yaml";

// supports "[!code highlight]" comments
const options = { annotation: { plugins: [shiki_notation()] } };

const languages = {
	bash: bash(options),
	sh: "bash",
	shell: "bash",
	zsh: "bash",
	console: shellsession(options),
	css: css(options),
	diff: diff(options),
	go: go(options),
	html: html(options),
	http: http(options),
	javascript: javascript(options),
	js: "javascript",
	json: json(options),
	jsonc: jsonc(options),
	markdown: markdown(options),
	md: "markdown",
	python: python(options),
	py: "python",
	rust: rust(options),
	rs: "rust",
	sql: sql(options),
	svelte: svelte(options),
	toml: toml(options),
	tsx: tsx(options),
	jsx: "tsx",
	typescript: typescript(options),
	ts: "typescript",
	yaml: yaml(options),
	yml: "yaml",
};

const renderer = create_renderer({ languages });

export function isTwinkleplopLanguage(lang: string): boolean {
	return Object.hasOwn(languages, lang);
}

export function highlightFence(
	lang: string,
	meta: string | undefined,
	code: string,
): string {
	const html = renderer.fence(lang, meta, code)!;
	return html.replace("<code>", '<code tabindex="0">');
}
