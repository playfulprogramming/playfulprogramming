import { JSX } from "preact";

export type JSXNode = string | JSX.Element | (string | JSX.Element)[];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type PropsWithChildren<T = {}> = Omit<T, "children"> & {
	children: JSXNode;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type PropsWithOptionalChildren<T = {}> = Omit<T, "children"> & {
	children?: JSXNode;
};
