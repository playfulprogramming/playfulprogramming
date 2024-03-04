// default sizing used for iframes (MarkdownRenderer/media.tsx)
export const EMBED_SIZE = { w: "100%", h: 500 };

export const EMBED_MIN_HEIGHT = 300;

export interface MarkdownConfig {
	format: "html" | "epub";
	// fs path for any static files (used primarily for epub / rehype-absolute-paths)
	path?: string;
}
