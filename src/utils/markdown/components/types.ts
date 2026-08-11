import type * as hast from "hast";
import type { VFile } from "vfile";
import type * as components from "./components.ts";

type MaybePromise<T> = Promise<T> | T;

export type RehypeComponentsProps = {
	components: Record<string, RehypeFunctionComponent>;
};

export type RehypeFunctionProps = {
	vfile: VFile;
	node: hast.Node;
	attributes: Record<string, string>;
	children: components.ComponentNode["children"];
};

export type RehypeFunctionComponent = (
	props: RehypeFunctionProps,
) => MaybePromise<
	Array<components.PlayfulNode | hast.ElementContent> | undefined
>;
