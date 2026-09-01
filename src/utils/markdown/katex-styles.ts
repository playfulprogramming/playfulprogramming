import katexCssRaw from "katex/dist/katex.min.css?raw";
import katexFonts from "#src/styles/katex-fonts.css?inline";

// katex.min.css ships ttf+woff+woff2 for every font (~76% dead weight);
// strip its @font-face rules and use woff2-only ones instead.
export const katexStyles =
	katexCssRaw.replaceAll(/@font-face\{[^}]*\}/gu, "") + katexFonts;
