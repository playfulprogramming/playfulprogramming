import type { RehypeFunctionComponent } from "./types.ts";

export const transformNoop: RehypeFunctionComponent = ({ children }) =>
	children;
