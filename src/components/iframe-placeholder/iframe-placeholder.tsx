import { Button } from "components/button/button";
import { RawSvg } from "components/image/raw-svg";
import { HTMLAttributes } from "preact/compat";
import { useState } from "preact/hooks";
import LaunchIcon from "src/icons/launch.svg?raw";
import PlayIcon from "src/icons/play.svg?raw";
import FallbackPageIcon from "src/icons/website.svg?raw";
import style from "./iframe-placeholder.module.scss";

export interface IFramePlaceholderProps {
	width: string;
	height: string;
	src: string;
	iframeAttrs: HTMLAttributes<HTMLIFrameElement>;
	pageTitle: string;
	pageIcon?: string;
	pageThumbnail: string;
}

export function IFramePlaceholder({
	height,
	width,
	iframeAttrs,
	...props
}: IFramePlaceholderProps) {
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
					<a
						href={props.src}
						rel="nofollow noopener noreferrer"
						target="_blank"
					>
						{props.src}
					</a>
				</div>
				<Button
					class={style.headerButton}
					href={props.src}
					rel="nofollow noopener noreferrer"
					target="_blank"
					leftIcon={<RawSvg icon={LaunchIcon} />}
				>
					New tab
				</Button>
			</div>
			{!frameVisible ? (
				<div
					class={style.placeholder}
					style={`height: ${Number(height) ? `${height}px` : height};`}
				>
					<Button
						class={style.placeholderButton}
						tag="button"
						variant="primary-emphasized"
						leftIcon={<RawSvg icon={PlayIcon} />}
						onClick={() => setFrameVisible(true)}
					>
						Run
					</Button>
				</div>
			) : (
				<iframe
					{...iframeAttrs}
					style={`height: ${Number(height) ? `${height}px` : height};`}
					src={props.src}
					loading="lazy"
				/>
			)}
		</div>
	);
}
