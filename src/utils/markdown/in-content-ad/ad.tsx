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

	/**
	 * We cannot use the "A D" word in the markup, otherwise it will be blocked by ad blockers.
	 */
	return (
		<aside class="in-content-banner-container">
			<div class="in-content-banner-contents">
				<h2
					data-no-heading-link
					class="in-content-banner-title text-style-headline-5"
				>
					{title}
				</h2>
				<p class="in-content-banner-description text-style-body-medium-bold">
					{body}
				</p>
				<a
					href={buttonHref}
					class="button text-style-button-large large secondary-emphasized in-content-banner-button"
				>
					<span class="innerText">{buttonText}</span>
				</a>
			</div>
			<div class="in-content-image-container">
				<img data-nozoom class="in-content-image" src="/stickers/donate.svg" />
				<div class="in-content-image-bg">
					<div class="in-content-image-inner-bg"></div>
				</div>
			</div>
		</aside>
	) as never;
}
