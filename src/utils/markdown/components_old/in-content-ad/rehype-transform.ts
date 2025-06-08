import { InContentAd } from "./ad";
import { RehypeFunctionComponent } from "../types";

export const transformInContentAd: RehypeFunctionComponent = ({
	attributes,
}) => {
	return InContentAd({
		title: String(attributes.title),
		body: String(attributes.body),
		["button-text"]: String(attributes["button-text"]),
		["button-href"]: String(attributes["button-href"]),
	});
};
