import type { ComponentChildren } from "preact";

export type JSXNode = ComponentChildren;

export type PropsWithChildren<T = {}> = Omit<T, "children"> & {
	children: JSXNode;
};

export type PropsWithOptionalChildren<T = {}> = Omit<T, "children"> & {
	children?: JSXNode;
};
