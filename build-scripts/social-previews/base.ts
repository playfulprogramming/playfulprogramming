import { PostInfo } from "types/index";
import { FunctionComponent } from "preact";

export type ComponentProps = {
	post: PostInfo;
	postHtml: string;
	height: number;
	width: number;
	authorImageMap: Record<string, string>;
};

export type Layout = {
	name: string;
	css: string;
	Component: FunctionComponent<ComponentProps>;
};

export const PAGE_WIDTH = 1280;
export const PAGE_HEIGHT = 640;
