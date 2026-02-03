import { http, HttpResponse, HttpResponseResolver } from "msw";
import { TweetAPIResponse } from "utils/markdown/data-providers/fx-embed/types";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";

const jsonResolver: HttpResponseResolver<{
	userId: string;
	postId: string;
}> = () => {
	return HttpResponse.json({
		files: {
			"gistfile1.txt": {
				content: "Hello World!",
				filename: "gistfile1.txt",
				language: "text",
			},
		},
	});
};

export const githubHandlers = [
	http.get("https://api.github.com/gists/:gistId", jsonResolver),
];
