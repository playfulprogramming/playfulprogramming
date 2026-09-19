import { getMarkdownVFile } from "./getMarkdownVFile.ts";
import { getMarkdownHtml } from "./getMarkdownHtml.ts";
import { getMarkdownWarnings, withMarkdownDiagnostics } from "./diagnostics.ts";
import type { MarkdownFileInfo, MarkdownVFile } from "./types.ts";

export async function lintMarkdown<Stub extends MarkdownFileInfo>(
	stub: Stub,
	read: (stub: Stub, file: MarkdownVFile) => Promise<MarkdownFileInfo>,
) {
	const file = await getMarkdownVFile(stub);
	await withMarkdownDiagnostics(file, async () => {
		try {
			const post = await read(stub, file);
			await getMarkdownHtml(post, file);
		} catch (error) {
			// A fatal diagnostic is a lint result; unrelated failures still propagate.
			if (
				!file.messages.some((message) => message === error && message.fatal)
			) {
				throw error;
			}
		}
	});
	return getMarkdownWarnings(file);
}
