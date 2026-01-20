import { vimeoHandlers } from "./vimeo";
import { youtubeHandlers } from "./youtube";

export const handlers = [...vimeoHandlers, ...youtubeHandlers];
