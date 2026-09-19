import { VFileMessage } from "vfile-message";
import { getMarkdownVFile } from "./getMarkdownVFile.ts";
import { getMarkdownHtml } from "./getMarkdownHtml.ts";
import { getMarkdownWarnings, createReporter } from "./diagnostics.ts";
import type { MarkdownFileInfo, MarkdownVFile } from "./types.ts";

export async function lintMarkdown<Stub extends MarkdownFileInfo>(
	stub: Stub,
	read: (stub: Stub, file: MarkdownVFile) => Promise<MarkdownFileInfo>,
) {
	const file = await getMarkdownVFile(stub);
	const reporter = createReporter(file);
	try {
		const post = await read(stub, file);
		await getMarkdownHtml(post, file);
	} catch (error) {
		// Only fatal diagnostics recorded on this file can become lint results.
		if (
			!(error instanceof VFileMessage) ||
			!error.fatal ||
			!file.messages.includes(error)
		) {
			reporter.failure(error);
		}
	}
	return reporter.success(getMarkdownWarnings(file));
}
