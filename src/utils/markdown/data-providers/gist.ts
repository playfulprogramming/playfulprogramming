import { Octokit } from "octokit";

const octokit = new Octokit();

export async function getGist(gistId: string) {
	try {
		const res = await octokit.request("GET /gists/{gist_id}", {
			gist_id: gistId,
			headers: {
				accept: "application/vnd.github+json",
				"X-GitHub-Api-Version": "2022-11-28",
			},
		});

		if (res.status !== 200) {
			return null;
		}

		return res.data;
	} catch (e) {
		return null;
	}
}

export const gistHosts = ["gist.github.com"];
