import { Button } from "components/button/button";
import { RawSvg } from "components/image/raw-svg";
import { HTMLAttributes } from "preact/compat";
import { useState } from "preact/hooks";
import LaunchIcon from "src/icons/launch.svg?raw";
import PlayIcon from "src/icons/play.svg?raw";
import FallbackPageIcon from "src/icons/website.svg?raw";

export interface IFramePlaceholderProps {
	width: string;
	height: string;
	src: string;
	iframeAttrs: HTMLAttributes<HTMLIFrameElement>;
	pageTitle: string;
	pageIcon?: string;
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
		<div class="embed">
			<div class="embed__header">
				<div class="embed__header__favicon">
					{!pageIconError && props.pageIcon ? (
						<img
							src={props.pageIcon}
							width={24}
							height={24}
							alt=""
							loading="lazy"
							decoding="async"
							data-nozoom="true"
							data-dont-round="true"
							onError={() => setPageIconError(true)}
						/>
					) : (
						<RawSvg icon={FallbackPageIcon} aria-hidden />
					)}
				</div>
				<div class="embed__header__info">
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
					class="embed__placeholder"
					style={`height: ${Number(height) ? `${height}px` : height};`}
				>
					<Button
						tag="button"
						variant="primary-emphasized"
						leftIcon={<RawSvg icon={PlayIcon} />}
						onClick={() => setFrameVisible(true)}
					>
						Run
					</Button>
				</div>
			) : (
				<iframe {...iframeAttrs} width={width} height={height} src={props.src} loading="lazy" />
			)}
		</div>
	);
}
