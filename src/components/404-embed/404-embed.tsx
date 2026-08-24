import style from "./404-embed.module.scss";
import { LargeButton } from "#components/button/button.tsx";
import { RawSvg } from "#components/image/raw-svg.tsx";
import LaunchIcon from "#src/icons/launch.svg?raw";
import type { Languages } from "#types/index.ts";
import { createTranslator } from "#utils/translations.ts";

export interface FourOFourEmbedProps {
	locale: Languages;
	url: string;
}

export function FourOFourEmbed({ locale, url }: FourOFourEmbedProps) {
	const translate = createTranslator(locale);
	return (
		<aside class={style.embedContainer}>
			<div class={style.embedContents}>
				<img
					src="/illustrations/404.svg"
					alt={translate("alt.404_illustration")}
					loading="lazy"
					data-dont-round
					data-nozoom
					class={style.fourOFourIllustration}
				/>
				<h2 data-no-heading-link class={`${style.title} text-style-headline-5`}>
					{translate("title.embed_not_found")}
				</h2>
				<p class={`${style.description} text-style-body-large`}>
					{translate("desc.embed_not_found")}
				</p>
				<LargeButton
					class={style.button}
					variant="secondary"
					href={url}
					target="_blank"
					rel="nofollow noopener noreferrer"
					leftIcon={<RawSvg icon={LaunchIcon} />}
				>
					{translate("action.open_url")}
				</LargeButton>
			</div>
			<div class={style.embedImageBg}>
				<div class={style.embedImageInnerBg} />
			</div>
		</aside>
	);
}
