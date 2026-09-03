// @ts-check
import { globSync, readFileSync } from "node:fs";

const VARS_USED_AT_RUNTIME = [
	// banner-svg.astro mouse-tracking animation vars
	"--x",
	"--y",
	"--r",
	// file-picker.tsx getBoundingClientRect positioning
	"--file-picker-top",
	"--file-picker-left",
	"--file-picker-width",
	"--file-picker-height",
	// resizeable-panels.tsx panelHeight prop
	"--resizeable-panels-height",
	// repeat-background.tsx aspectRatio prop
	"--svgAspectRatio",
	// Shiki syntax highlighting set by Shiki at render time
	"--shiki-dark",
	"--shiki-dark-font-style",
	"--shiki-dark-font-weight",
	"--shiki-dark-text-decoration",
	// search-topbar.tsx sticky header offset measured via JS
	"--topbar-header-height",
	// infinite-loop-slider.astro style={{}} prop
	"--duration",
	"--direction",
];

// files can't know what files exist without global context
function collectCustomProperties() {
	const customProperties = Object.fromEntries(
		VARS_USED_AT_RUNTIME.map((name) => [name, ""]),
	);

	for (const file of globSync("src/**/*.{scss,astro,css}")) {
		const contents = readFileSync(file, "utf8");
		for (const [, name] of contents.matchAll(/(--[\w-]+)\s*:/g)) {
			customProperties[name] = "";
		}
	}

	return customProperties;
}

/** @type {import('stylelint').Config} */
export default {
	plugins: ["stylelint-value-no-unknown-custom-properties"],
	extends: ["stylelint-config-recommended-scss"],
	overrides: [
		{
			files: ["**/*.astro"],
			customSyntax: "postcss-html",
		},
		{
			files: ["**/*.scss"],
			customSyntax: "postcss-scss",
		},
	],
	rules: {
		// .astro files have lots of false positives with postcss-html
		"no-invalid-position-declaration": null,
		// :global(...) is CSS Modules syntax
		"selector-pseudo-class-no-unknown": [
			true,
			{ ignorePseudoClasses: ["global"] },
		],
		// stylistic
		"scss/operator-no-newline-after": null,
		"scss/at-extend-no-missing-placeholder": null,
		"scss/comment-no-empty": null, // used as spacers
		"scss/load-partial-extension": null,
		"scss/load-no-partial-leading-underscore": null,
		// many rules are left empty for mobile
		"block-no-empty": null,
		// allow vendor-prefix fallbacks
		"declaration-block-no-duplicate-properties": [
			true,
			{ ignore: ["consecutive-duplicates-with-different-values"] },
		],
		"csstools/value-no-unknown-custom-properties": [
			true,
			{
				importFrom: [
					{
						customProperties: collectCustomProperties(),
					},
				],
			},
		],
	},
};
