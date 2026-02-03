import style from "./404-embed.module.scss";
import { LargeButton } from "components/button/button";
import { RawSvg } from "components/image/raw-svg";
import LaunchIcon from "src/icons/launch.svg?raw";

export interface FourOFourEmbedProps {
	url: string;
}

export function FourOFourEmbed({ url }: FourOFourEmbedProps) {
	return (
		<aside class={style.embedContainer}>
			<div class={style.embedContents}>
				<img
					src="/illustrations/404.svg"
					alt="404 illustration"
					loading="lazy"
					data-dont-round
					data-nozoom
					class={style.fourOFourIllustration}
				/>
				<h2 data-no-heading-link class={`${style.title} text-style-headline-5`}>
					We couldn’t find what you were looking for.
				</h2>
				<p class={`${style.description} text-style-body-large`}>
					The webpage may no longer be available or the URL may be broken.
				</p>
				<LargeButton
					class={style.button}
					variant="secondary"
					href={url}
					target="_blank"
					rel="nofollow noopener noreferrer"
					leftIcon={<RawSvg icon={LaunchIcon} />}
				>
					Open URL
				</LargeButton>
			</div>
			<div class={style.embedImageBg}>
				<div class={style.embedImageInnerBg} />
			</div>
		</aside>
	);
}
