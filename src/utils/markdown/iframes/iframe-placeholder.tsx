/** @jsxRuntime automatic */
import { Element } from "hast";
import { GetPictureResult } from "@astrojs/image/dist/lib/get-picture";

export interface IFramePlaceholderProps {
	width: string;
	height: string;
	src: string;
	pageTitle: string;
	pageIcon: GetPictureResult;
}

/** @jsxImportSource hastscript */
export function IFramePlaceholder({ height, width, ...props }: IFramePlaceholderProps): Element {
	return (
		<div class="embed">
			<div class="embed__header">
				<div class="embed__header__favicon">
					<picture>
						{props.pageIcon.sources.map((source) => (
							<source {...source} />
						))}
						<img
							{...props.pageIcon.image as any}
							alt=""
							loading="lazy"
							decoding="async"
							data-nozoom="true"
						/>
					</picture>
				</div>
				<div class="embed__header__info">
					<p>
						<span class="visually-hidden">An embedded webpage:</span>
						{props.pageTitle}
					</p>
					<a
						href={props.src}
						rel="noreferrer"
						target="_blank"
					>
						{props.src}
					</a>
				</div>
				<button>New tab</button>
			</div>
			<div
				class="embed__placeholder"
				data-iframeurl={props.src}
				style={`height: ${Number(height) ? `${height}px` : height};`}
			>
				<button>Run embed</button>
			</div>
		</div>
	) as never;
}
