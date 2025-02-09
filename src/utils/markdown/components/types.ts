import type * as hast from "hast";
import { VFile } from "vfile";

export type RehypeFunctionProps<TAttributes = Record<string, string>> = {
	vfile: VFile;
	node: hast.Node;
	attributes: TAttributes;
	children: hast.Node[];
};

export type RehypeFunctionComponent = (
	props: RehypeFunctionProps,
) => hast.Node | Array<hast.Node> | undefined;
