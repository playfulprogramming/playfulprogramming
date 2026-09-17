import env from "#src/constants/env/index.ts";
import { siteMetadata } from "#src/constants/site-config.ts";

type StackblitzOpts = {
	embed?: "1";
	file?: string;
};

let currentBranch = env.GIT_COMMIT_REF;
if (!currentBranch) {
	// In local dev, GIT_COMMIT_REF might not be set, so we should default to main.
	currentBranch = "main";
	// But only for development, in production/preview builds we should throw an error to avoid unexpected behavior.
	if (env.MODE === "production" || env.MODE === "preview") {
		throw new Error("Environment variable GIT_COMMIT_REF is not set!");
	}
}

export function getStackblitzUrl(projectDir: string, opts: StackblitzOpts) {
	if (projectDir.startsWith("/")) {
		projectDir = projectDir.slice(1);
	}

	const q = new URLSearchParams(opts).toString();
	const repoPath = siteMetadata.repoPath;
	const provider = `stackblitz.com/github`;
	return `
		https://${provider}/${repoPath}/tree/${currentBranch}/${projectDir}?${q}
	`.trim();
}
