import { ExtendedPostInfo } from "types/index";
import * as React from "react";

export type ComponentProps = {
	post: ExtendedPostInfo;
	postHtml: string;
	height: number;
	width: number;
	authorImageMap: Record<string, string>;
};

export type Layout = {
	name: string;
	css: string;
	Component: React.FunctionComponent<ComponentProps>;
};

export const PAGE_WIDTH = 1280;
export const PAGE_HEIGHT = 640;
