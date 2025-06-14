import { LargeButton } from "components/button/button";
import DonateSvg from "../../../public/stickers/donate.svg?raw";
import style from "./ad.module.scss";
import { RawSvg } from "components/image/raw-svg";

interface InContentAdProps {
	title: string;
	body: string;
	["button-text"]: string;
	["button-href"]: string;
}

export function InContentAd(props: InContentAdProps) {
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
		<aside class={style.inContentBannerContainer}>
			<div class={style.inContentBannerContents}>
				<h2
					data-no-heading-link
					class={`${style.title} text-style-headline-5`}
				>
					{title}
				</h2>
				<p class={`${style.description} text-style-body-medium-bold`}>
					{body}
				</p>
				<LargeButton class={style.button} variant="secondary-emphasized" href={buttonHref}>
					{buttonText}
				</LargeButton>
			</div>
			<div class={style.inContentImageContainer}>
				<RawSvg class={style.inContentImage} icon={DonateSvg} aria-hidden />
				<div class={style.inContentImageBg}>
					<div class={style.inContentImageInnerBg}></div>
				</div>
			</div>
		</aside>
	);
}
