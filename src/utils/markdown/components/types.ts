import type * as hast from "hast";
import { VFile } from "vfile";
import * as components from "./components";

type MaybePromise<T> = Promise<T> | T;

export type RehypeComponentsProps = {
	components: Record<string, RehypeFunctionComponent>;
};

export type RehypeFunctionProps = {
	vfile: VFile;
	node: hast.Node;
	attributes: Record<string, string>;
	children: hast.Node[];
	processComponents: (tree: hast.Node[]) => MaybePromise<components.Node[]>;
};

export type RehypeFunctionComponent = (
	props: RehypeFunctionProps,
) => MaybePromise<Array<components.Node> | undefined>;
