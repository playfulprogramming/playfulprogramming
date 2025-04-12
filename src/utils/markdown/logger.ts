import type * as mdast from "mdast";
import type * as hast from "hast";
import { VFile } from "vfile";
import * as kleur from "kleur/colors";

/**
 * A utility function for printing readable errors out of the hast/mdast nodes in a markdown file
 */
export function logError(
	vfile: VFile,
	node: hast.Node | mdast.Node,
	...message: string[]
) {
	if (process.env.CI) {
		// In GitHub Actions, format an error message that can show up in a PR
		// https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message
		const meta = {
			file: vfile.path,
			col: node.position?.start?.column,
			endColumn: node.position?.end?.column,
			line: node.position?.start?.line,
			endLine: node.position?.end?.line,
		};

		console.log();
		console.error(
			"::error",
			Object.entries(meta)
				.filter(([_, v]) => !!v)
				.map(([k, v]) => `${k}=${v}`)
				.join(",") + "::",
			...message,
		);
	} else {
		// Otherwise, print something readable to the console
		console.log();
		console.error(kleur.red("[ERROR] " + message.join(" ")));

		const startOffset = node.position?.start?.offset;
		const endOffset = node.position?.end?.offset;
		if (startOffset && endOffset) {
			const str = vfile.value.slice(startOffset, endOffset);
			console.log("\t" + str);
			console.log("\t^");
		}

		console.log(kleur.gray(`\tin ${vfile.path}:${node.position?.start?.line}`));
	}
}
