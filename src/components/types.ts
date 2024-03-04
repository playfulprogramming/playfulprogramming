import { JSX } from "preact";

export type JSXNode = string | JSX.Element | (string | JSX.Element)[];

export type PropsWithChildren<T = {}> = Omit<T, "children"> & {
	children: JSXNode;
};

export type PropsWithOptionalChildren<T = {}> = Omit<T, "children"> & {
	children?: JSXNode;
};
