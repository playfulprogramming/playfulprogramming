/**
 * Check for undeclared CSS custom properties in the built output
 *
 * Checks built css and html and validates it. Cannot detect JavaScript set vars
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const VARS_USED_AT_RUNTIME = new Set([
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
]);

const DIST_DIR = new URL("../dist", import.meta.url).pathname;
const CSS_DIR = join(DIST_DIR, "_astro");

if (!existsSync(DIST_DIR)) {
	console.error("dist/ not found. run pnpm build first");
	process.exit(1);
}

if (!existsSync(CSS_DIR)) {
	console.error("dist/_astro/ not found. build may have failed");
	process.exit(1);
}

const files = readdirSync(CSS_DIR)
	.filter((f) => f.endsWith(".css"))
	.map((f) => join(CSS_DIR, f));

const definedVariables = new Set<string>();
const usagesByFiles = new Map<string, string[]>();

for (const file of files) {
	const css = readFileSync(file, "utf8");
	const shortName = file.split("/").at(-1)!;

	for (const [, name] of css.matchAll(/(--[\w-]+)\s*:/g)) {
		definedVariables.add(name);
	}

	for (const [, name] of css.matchAll(/var\(\s*(--[\w-]+)/g)) {
		if (!usagesByFiles.has(name)) usagesByFiles.set(name, []);
		usagesByFiles.get(name)!.push(shortName);
	}
}

const undeclaredVars = [...usagesByFiles.entries()].filter(
	([name]) => !definedVariables.has(name) && !VARS_USED_AT_RUNTIME.has(name),
);

if (undeclaredVars.length === 0) {
	console.log(
		`All CSS custom properties defined (checked ${files.length} files)`,
	);
	process.exit(0);
}

console.error(`Undeclared CSS custom properties:\n`);
for (const [name, fileList] of undeclaredVars) {
	const unique = [...new Set(fileList)];
	console.error(`  ${name}`);
	console.error(`    used in: ${unique.join(", ")}`);
}
process.exit(1);
