import { createComponent } from "../components.ts";
import type { RehypeFunctionComponent } from "../types.ts";

export const transformInContentAd: RehypeFunctionComponent = ({
	attributes,
}) => {
	return [
		createComponent("InContentAd", {
			title: String(attributes.title),
			body: String(attributes.body),
			"button-text": String(attributes["button-text"]),
			"button-href": String(attributes["button-href"]),
		}),
	];
};
