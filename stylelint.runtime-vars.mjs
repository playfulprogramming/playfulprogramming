// @ts-check
export const VARS_USED_AT_RUNTIME = [
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
