import type { Root } from "mdast";
import type { Plugin } from "unified";
import { logError } from "../logger.ts";

/** Report diagnostics emitted during parsing without rediscovering markers. */
export const remarkComponentDiagnostics: Plugin<[], Root> = () => {
	return (tree, file) => {
		for (const diagnostic of tree.data?.commentComponentDiagnostics ?? []) {
			file.message(diagnostic.message, {
				place: diagnostic.position,
				ruleId: diagnostic.ruleId,
				source: "mdast-comment-components",
			});
			logError(
				file,
				{ type: "html", position: diagnostic.position },
				diagnostic.message,
			);
		}
		if (tree.data?.commentComponentDiagnostics?.length) {
			file.fail("Cannot publish malformed Markdown components.", {
				source: "mdast-comment-components",
				ruleId: "invalid-components",
			});
		}
	};
};
