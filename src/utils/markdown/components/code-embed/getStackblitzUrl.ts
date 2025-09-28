import env from "constants/env";
import { siteMetadata } from "constants/site-config";
import GitBranch from "git-branch";

type StackblitzOpts = {
	embed?: "1";
	file?: string;
};

const currentBranch = env.GIT_COMMIT_REF ?? (await GitBranch());

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
