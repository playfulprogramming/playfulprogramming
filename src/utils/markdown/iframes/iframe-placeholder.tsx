/** @jsxRuntime automatic */
import { Element } from "hast";
import { fromHtml } from "hast-util-from-html";
import fs from "fs/promises";

const launch = await fs.readFile("src/icons/launch.svg", "utf8");
const play = await fs.readFile("src/icons/play.svg", "utf8");

export interface IFramePlaceholderProps {
	width: string;
	height: string;
	src: string;
	propsToPreserve: string;
	pageTitle: string;
	pageIcon: string;
	pageIconFallback: string;
}

/** @jsxImportSource hastscript */
export function IFramePlaceholder({
	height,
	width,
	propsToPreserve,
	...props
}: IFramePlaceholderProps): Element {
	return (
		<div class="embed">
			<div class="embed__header">
				<div class="embed__header__favicon">
					<img
						src={props.pageIcon}
						width={24}
						height={24}
						alt=""
						loading="lazy"
						decoding="async"
						data-nozoom="true"
						data-dont-round="true"
						{...{
							onerror: `this.src='${props.pageIconFallback}';this.onerror='';`,
						}}
					/>
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
				<a
					href={props.src}
					class="button regular primary text-style-button-regular"
					rel="nofollow noopener noreferrer"
					target="_blank"
				>
					<div aria-hidden="true" class="buttonIcon">
						{fromHtml(launch)}
					</div>
					<div class="innerText">New tab</div>
				</a>
			</div>
			<div
				class="embed__placeholder"
				data-iframeurl={props.src}
				data-iframeprops={propsToPreserve}
				style={`height: ${Number(height) ? `${height}px` : height};`}
			>
				<button class="button regular primary-emphasized text-style-button-regular">
					<div aria-hidden="true" class="buttonIcon">
						{fromHtml(play)}
					</div>
					<div class="innerText">Run</div>
				</button>
			</div>
		</div>
	) as never;
}
