import { http, HttpResponse, HttpResponseResolver } from "msw";

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
