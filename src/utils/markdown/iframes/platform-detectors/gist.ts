import { PlatformDetector } from "utils/markdown/iframes/platform-detectors/types";
import { getGist } from "utils/markdown/data-providers";
import { createComponent } from "utils/markdown/components";
import { gistHosts } from "utils/markdown/data-providers/gist";
import { GistCodeBlock } from "utils/markdown/iframes/hastscript-components/GistCodeBlock";

export const gistPlatformDetector: PlatformDetector = {
	detect: (src) => {
		const srcUrl = new URL(src);
		const isGist = gistHosts.includes(srcUrl.hostname);
		return isGist;
	},
	rehypeTransform: async ({ parent, index, src }) => {
		const srcUrl = new URL(src);

		// https://gist.github.com/crutchcorn/36fe5553219c05ea38bacf1c7396085b
		const gistPathParts = srcUrl.pathname.split("/").filter(Boolean);
		const githubUsername = gistPathParts[0];
		const gistId = gistPathParts[1];

		const data = await getGist(gistId);

		// TODO: How to handle no files in a Gist?
		if (!data.files) return;

		const file = Object.values(
			// "File name.txt": {}
			data.files,
		)[0];

		if (!file) return;
		if (!file.content) return;

		const { contents, truncated } = limitStringToNLines(file.content, 10);
		// This is the language from GitHub's API, might not align with Shiki's lang code
		const language = file.language?.toLowerCase() ?? "text";

		parent.children.splice(
			index,
			1,
			createComponent(
				"GistPlaceholder",
				{
					username: githubUsername,
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
