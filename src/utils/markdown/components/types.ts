import type * as hast from "hast";
import { VFile } from "vfile";

export type RehypeFunctionProps = {
	vfile: VFile;
	node: hast.Node;
	attributes: Record<string, string>;
	children: hast.Node[];
};

export type RehypeFunctionComponent = (
	props: RehypeFunctionProps,
) => hast.Node | Array<hast.Node> | undefined;
