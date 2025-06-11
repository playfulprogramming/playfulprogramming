import { RehypeFunctionComponent } from "./types";

export const transformNoop: RehypeFunctionComponent = ({
	children,
	processComponents,
}) => processComponents(children);
