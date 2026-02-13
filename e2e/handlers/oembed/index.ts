import { vimeoHandlers } from "./vimeo";
import { youtubeHandlers } from "./youtube";
import { xHandlers } from "./x";
import { githubHandlers } from "./github";

export const handlers = [
	...vimeoHandlers,
	...youtubeHandlers,
	...xHandlers,
	...githubHandlers,
];
