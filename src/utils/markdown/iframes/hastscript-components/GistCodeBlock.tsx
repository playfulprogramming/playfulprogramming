/** @jsxRuntime automatic */
import type { Element } from "hast";

interface GistCodeBlockProps {
	language: string;
	contents: string;
	truncated: boolean;
}

/** @jsxImportSource hastscript */
export function GistCodeBlock(props: GistCodeBlockProps): Element {
	// https://github.com/leafac/rehype-shiki?tab=readme-ov-file#format
	return (
		<pre>
			<code class={`language-${props.language}`}>
				{props.contents}
				{props.truncated ? "\n..." : ""}
			</code>
		</pre>
	) as never;
}
