import type * as hast from "hast";

export type RehypeFunctionProps = {
	attributes: Record<string, string>;
	children: hast.Node[];
};

export type RehypeFunctionComponent = (
	props: RehypeFunctionProps,
) => hast.Node | Array<hast.Node> | undefined;
