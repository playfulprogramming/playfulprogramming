import { vimeoHandlers } from "./vimeo";
import { youtubeHandlers } from "./youtube";
import { xHandlers } from "./x";

export const handlers = [...vimeoHandlers, ...youtubeHandlers, ...xHandlers];
