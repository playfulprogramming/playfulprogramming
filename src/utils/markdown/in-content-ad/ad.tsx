/** @jsxRuntime automatic */
import { Element } from "hast";

interface InContentAdProps {
	title: string;
	body: string;
	["button-text"]: string;
	["button-href"]: string;
}

/** @jsxImportSource hastscript */
export function InContentAd(props: InContentAdProps): Element {
	const {
		["button-text"]: buttonText,
		["button-href"]: buttonHref,
		title,
		body,
	} = props;

	return (
		<aside class="in-content-ad-container">
			<h2 class="in-content-ad-title text-style-headline-5">{title}</h2>
			<p class="in-content-ad-description text-style-body-medium-bold">
				{body}
			</p>
			<a
				href={buttonHref}
				class="button text-style-button-large large secondary-emphasized"
			>
				{buttonText}
			</a>
		</aside>
	) as never;
}
