import type { Root, Element } from "hast";
import type { Node } from "unist";

export const isElement = (e: Root | Element | Node | undefined): e is Element =>
	e?.type == "element";

export const isRoot = (e: Root | Element | Node | undefined): e is Root =>
	e?.type == "root";
