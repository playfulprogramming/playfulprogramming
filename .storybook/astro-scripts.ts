import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { Plugin } from "vite";

/**
 * The Astro adapter prerenders hoisted script tags but currently leaves their
 * source URLs in the static HTML. Emit those scripts through Vite and replace
 * the URLs after the adapter has finished writing its prerendered stories.
 */
export function astroStoryScripts(): Plugin {
	const root = resolve(import.meta.dirname, "../src/components");
	const scripts = new Map<string, string>();
	const modules = new Map<string, string>();
	let outputDirectory: string;
	return {
		name: "storybook-site-astro-scripts",
		apply: "build",
		enforce: "pre",
		resolveId(id) {
			if (modules.has(id)) return id;
		},
		load(id) {
			return modules.get(id);
		},
		configResolved(config) {
			outputDirectory = resolve(config.root, config.build.outDir);
		},
		async buildStart() {
			const files = await readdir(root, { recursive: true });
			for (const file of files.filter((file) => file.endsWith(".astro"))) {
				const path = resolve(root, file);
				const source = await readFile(path, "utf8");
				let index = 0;
				for (const match of source.matchAll(
					/<script\b([^>]*)>([\s\S]*?)<\/script>/g,
				)) {
					// Astro only hoists scripts without attributes, or with a sole src.
					const attributes = match[1].trim();
					if (attributes && !/^src\s*=\s*("[^"]*"|'[^']*')$/.test(attributes))
						continue;
					const id = `${path}?astro&type=script&index=${index++}&lang.ts`;
					const moduleId = `${path}.storybook-script-${index}.ts`;
					const external = attributes.match(/^src\s*=\s*["']([^"']+)["']/)?.[1];
					modules.set(
						moduleId,
						external
							? `import ${JSON.stringify(resolve(dirname(path), external))};`
							: match[2],
					);
					scripts.set(id, this.emitFile({ type: "chunk", id: moduleId }));
				}
			}
		},
		writeBundle: {
			order: "post",
			sequential: true,
			async handler() {
				const path = resolve(outputDirectory, "astro-prerendered-stories.json");
				const stories: Record<string, string> = JSON.parse(
					await readFile(path, "utf8"),
				);
				for (const [story, html] of Object.entries(stories)) {
					let rewritten = html;
					for (const [source, reference] of scripts) {
						rewritten = rewritten.replaceAll(
							source,
							`./${this.getFileName(reference)}`,
						);
					}
					stories[story] = rewritten;
				}
				await writeFile(path, JSON.stringify(stories));
			},
		},
	};
}
