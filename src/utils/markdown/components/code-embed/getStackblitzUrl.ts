import env from "#src/constants/env/index.ts";
import { siteMetadata } from "#src/constants/site-config.ts";
import GitBranch from "git-branch";

type StackblitzOpts = {
	embed?: "1";
	file?: string;
};

let currentBranch: string | undefined;

try {
	currentBranch = env.GIT_COMMIT_REF ?? (await GitBranch());
} catch (error) {
	// In a worktree, this will fail, so we default to "main" to avoid breaking the embed functionality.
	console.error("Error getting current Git branch:", error);
	currentBranch = "main";
	// But only for development, in production we should throw an error to avoid unexpected behavior.
	if (env.MODE === "production") {
		throw error;
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
