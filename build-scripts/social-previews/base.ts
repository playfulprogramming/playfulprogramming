import { PostInfo } from "types/PostInfo";
import * as React from "react";

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
	Component: React.FunctionComponent<ComponentProps>;
};
