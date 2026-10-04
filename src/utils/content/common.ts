import { join } from "path";
import { Settings } from "typebox/system";
import type { MarkdownFileInfo, MarkdownVFile } from "../markdown/types.ts";
import { createReporter } from "../markdown/diagnostics.ts";
import { getMarkdownVFile } from "../markdown/getMarkdownVFile.ts";
import { watch } from "fs/promises";
import env from "#src/constants/env/index.ts";

Settings.Set({ correctiveParse: true });

export const contentDirectory = join(process.cwd(), "content");

export function cache<Arg1 extends MarkdownFileInfo, Ret>(
	callback: (arg1: Arg1, vfile: MarkdownVFile) => Promise<Ret>,
) {
	const map = new Map<string, { result?: Promise<Ret> }>();
	return async (arg1: Arg1, vfile?: MarkdownVFile) => {
		const key = arg1.file;
		let entry = map.get(key);
		if (entry?.result && vfile === undefined) return entry.result;

		if (entry === undefined) {
			entry = {};
			map.set(key, entry);

			if (env.DEV) {
				(async () => {
					try {
						for await (const _ of watch(arg1.file)) {
							entry.result = undefined;
						}
					} catch {
						// The file was removed or renamed; drop the cached result.
						entry.result = undefined;
					}
				})();
			}
		}

		if (vfile === undefined) {
			vfile = await getMarkdownVFile(arg1);
		}

		const reporter = createReporter(vfile);
		try {
			entry.result = callback(arg1, vfile).then(reporter.success);
			return await entry.result;
		} catch (error) {
			entry.result = undefined;
			return reporter.failure(error);
		}
	};
}
