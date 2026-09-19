import type { Root } from "mdast";
import type { Plugin } from "unified";
import type { VFile } from "vfile";
import type { CommentComponentDiagnostic } from "./types.ts";

export interface RemarkComponentDiagnosticsOptions {
	/** Fail after reporting every diagnostic. Defaults to false. */
	fatal?: boolean;
	/** Receive each diagnostic after its positioned VFile message is added. */
	onDiagnostic?: (diagnostic: CommentComponentDiagnostic, file: VFile) => void;
}

/** Report parser diagnostics during run(), without changing the parsed tree. */
export const remarkComponentDiagnostics: Plugin<
	[RemarkComponentDiagnosticsOptions?],
	Root
> = (options = {}) => {
	return (tree, file) => {
		const diagnostics = tree.data?.commentComponentDiagnostics ?? [];
		for (const diagnostic of diagnostics) {
			file.message(diagnostic.message, {
				place: diagnostic.position,
				ruleId: diagnostic.ruleId,
				source: "mdast-comment-components",
			});
			options.onDiagnostic?.(diagnostic, file);
		}
		if (options.fatal && diagnostics.length) {
			file.fail("Malformed Markdown comment components.", {
				source: "mdast-comment-components",
				ruleId: "invalid-components",
			});
		}
	};
};
