import { IconOnlyButton } from "components/button/button";
import { RawSvg } from "components/image/raw-svg";
import { HTMLAttributes } from "preact/compat";
import { useState } from "preact/hooks";
import PlayIcon from "src/icons/play.svg?raw";
import FallbackPageIcon from "src/icons/website.svg?raw";
import style from "./video-placeholder.module.scss";

export interface VideoPlaceholderProps {
	width: string;
	height: string;
	src: string;
	iframeAttrs: HTMLAttributes<HTMLIFrameElement>;
	pageTitle: string;
	pageIcon?: string;
	thumbnailUrl: string;
}

export function VideoPlaceholder({
	height,
	width,
	iframeAttrs,
	...props
}: VideoPlaceholderProps) {
	const [pageIconError, setPageIconError] = useState(false);
	const [frameVisible, setFrameVisible] = useState(false);

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
					style={`height: ${Number(height) ? `${height}px` : height}; background-image: url(${props.thumbnailUrl});`}
				>
					<IconOnlyButton
						class={style.placeholderButton}
						tag="button"
						variant="primary"
						onClick={() => setFrameVisible(true)}
						aria-label="Play video"
					>
						<RawSvg icon={PlayIcon} />
					</IconOnlyButton>
				</div>
			) : (
				<iframe
					src={props.src}
					{...iframeAttrs}
					style={`height: ${Number(height) ? `${height}px` : height};`}
					loading="lazy"
				/>
			)}
		</div>
	);
}
