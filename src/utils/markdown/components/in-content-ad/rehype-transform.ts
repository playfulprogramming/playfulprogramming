import { InContentAdProps } from "./ad";
import { RehypeFunctionProps } from "../types";

export const transformInContentAd = ({
	attributes,
}: RehypeFunctionProps<InContentAdProps>) => {
	return {
		title: String(attributes.title),
		body: String(attributes.body),
		["button-text"]: String(attributes["button-text"]),
		["button-href"]: String(attributes["button-href"]),
	};
};
