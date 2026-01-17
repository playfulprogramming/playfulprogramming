import { PlatformDetector } from "utils/markdown/iframes/platform-detectors/types";
import { getGist } from "utils/markdown/data-providers";
import { createComponent } from "utils/markdown/components";
import { gistHosts } from "utils/markdown/data-providers/gist";

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
		const _githubUsername = gistPathParts[0];
		const gistId = gistPathParts[1];

		const data = await getGist(gistId);

		parent.children.splice(
			index,
			1,
			createComponent("GistPlaceholder", { data }),
		);
	},
};
