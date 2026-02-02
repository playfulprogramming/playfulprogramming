import { IconOnlyButton } from "components/button/button";
import { RawSvg } from "components/image/raw-svg";
import { useState } from "preact/hooks";
import PlayIcon from "src/icons/play.svg?raw";
import FallbackPageIcon from "src/icons/website.svg?raw";
import style from "./video-placeholder.module.scss";
import { HTMLAttributes } from "preact/compat";

// This is hardcoded as 'false' because youtube does not support embedding within an iframe
// in credentialless mode.
// TODO: Once https://github.com/playfulprogramming/playfulprogramming/issues/1496 is resolved,
// it should be possible to remove this and always use the embed.
const isCredentiallessSupported = false;

export interface VideoPlaceholderProps {
	width: string;
	height: string;
	src: string;
	iframeAttrs: HTMLAttributes<HTMLIFrameElement>;
	pageTitle: string;
	pageIcon?: string;
	pageThumbnail: string;
}

export function VideoPlaceholder({
	height,
	width,
	iframeAttrs,
	...props
}: VideoPlaceholderProps) {
	const [pageIconError, setPageIconError] = useState(false);
	const [frameVisible, setFrameVisible] = useState(false);

	const iframeProps = {
		...iframeAttrs,
		// Seems to be missing from Preact type defs
		credentialless: "true",
	} as object;

	return (
		<div class={`${style.embed} markdownCollapsePadding`}>
			<div class={style.header}>
				<div class={style.favicon}>
					{!pageIconError && props.pageIcon ? (
						<img
							src={props.pageIcon}
							width={24}
							height={24}
							alt=""
							loading="lazy"
							decoding="async"
							crossorigin="anonymous"
							data-nozoom="true"
							data-dont-round="true"
							onError={() => setPageIconError(true)}
						/>
					) : (
						<RawSvg icon={FallbackPageIcon} aria-hidden />
					)}
				</div>
				<div class={style.headerInfo}>
					<p>
						<span class="visually-hidden">An embedded webpage:</span>
						{props.pageTitle}
					</p>
				</div>
			</div>
			{!frameVisible ? (
				<div
					class={style.placeholder}
					style={`height: ${Number(height) ? `${height}px` : height};`}
				>
					<img
						src={props.pageThumbnail}
						alt=""
						class={style.thumbnail}
						loading="lazy"
						decoding="async"
						crossorigin="anonymous"
						data-nozoom="true"
					/>
					<IconOnlyButton
						class={style.placeholderButton}
						tag={isCredentiallessSupported ? "button" : "a"}
						variant="primary"
						aria-label="Play video"
						{...(isCredentiallessSupported
							? {
									onClick: () => setFrameVisible(true),
								}
							: {
									href: props.src,
									rel: "nofollow noopener noreferrer",
									target: "_blank",
								})}
					>
						<RawSvg icon={PlayIcon} />
					</IconOnlyButton>
				</div>
			) : (
				<iframe
					src={props.src}
					{...iframeProps}
					style={`height: ${Number(height) ? `${height}px` : height};`}
					loading="lazy"
				/>
			)}
		</div>
	);
}
