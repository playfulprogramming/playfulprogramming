import { PlatformDetector } from "utils/markdown/iframes/platform-detectors/types";
import { createComponent } from "utils/markdown/components";
import { GistCodeBlock } from "utils/markdown/iframes/hastscript-components/GistCodeBlock";

export const gistPlatformDetector: PlatformDetector = {
	detect: ({ metadata }) => metadata?.embedType === "gist",
	rehypeTransform: async ({ parent, metadata, index, src }) => {
		const gist = metadata?.gist;

		if (!gist) {
			parent.children.splice(
				index,
				1,
				createComponent("FourOFourPlaceholder", {
					url: src,
				}),
			);
			return;
		}

		// TODO: How to handle no files in a Gist?
		if (!gist.files.length) return;
		const file = gist.files[0];

		const fileContent = await fetch(file.contentUrl).then((r) => r.text());
		const { contents, truncated } = limitStringToNLines(fileContent, 10);
		// This is the language from GitHub's API, might not align with Shiki's lang code
		const language = file.language?.toLowerCase() ?? "text";

		parent.children.splice(
			index,
			1,
			createComponent(
				"GistPlaceholder",
				{
					username: gist.username,
					href: src,
					filename: file.filename ?? "Untitled",
				},
				[
					GistCodeBlock({
						language,
						contents,
						truncated,
					}),
				],
			),
		);
	},
};

function limitStringToNLines(longString: string, numberOfLines: number) {
	// Split the string into an array of lines based on newline characters
	const lines = longString.split("\n");

	// If the number of lines is already 30 or less, return the original string
	if (lines.length <= 30) {
		return { contents: longString, truncated: false };
	}

	// Slice the array to get only the first 30 lines
	const limitedLines = lines.slice(0, 30);

	// Join the limited lines back into a single string with newline characters
	const result = limitedLines.join("\n");

	return { contents: result, truncated: true };
}
