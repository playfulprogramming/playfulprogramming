import type { HTMLAttributes } from "preact/compat";
import { IconOnlyButton } from "#components/button/button.tsx";
import { Chip } from "#components/chip/chip.tsx";
import { RawSvg } from "#components/image/raw-svg.tsx";
import iconClose from "#src/icons/close.svg?raw";
import iconLink from "#src/icons/link.svg?raw";
import iconSearch from "#src/icons/search.svg?raw";
import { buildSearchQuery } from "#src/views/search/search.ts";
import type { SnitipInfo } from "#types/SnitipInfo.ts";
import style from "./snitip.module.scss";

export interface SnitipProps extends HTMLAttributes<HTMLDivElement> {
	snitip: SnitipInfo;
	headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	includeSearchTags?: boolean;
}

export function SnitipContent({
	snitip,
	headingTag: HeadingTag = "h1",
	includeSearchTags = true,
}: SnitipProps) {
	return (
		<>
			<div class={style.containerTitle}>
				{snitip.icon ? (
					<img
						class={style.icon}
						src={snitip.icon}
						loading="lazy"
						decoding="async"
						alt=""
						data-nozoom
					/>
				) : null}
				<HeadingTag class={`${style.title} text-style-headline-6`}>
					{snitip.title}
				</HeadingTag>
			</div>
			<div class={style.containerBody}>
				<div
					class={style.description}
					dangerouslySetInnerHTML={{ __html: snitip.content }}
				/>
				{snitip.links.length > 0 ? (
					<ul class={style.links}>
						{snitip.links.map((link) => (
							<li key={link.href}>
								<a class={`${style.links__item} a`} href={link.href}>
									<RawSvg
										aria-hidden
										class={style.links__item__icon}
										icon={iconLink}
									/>
									{link.name}
								</a>
							</li>
						))}
					</ul>
				) : null}
				{includeSearchTags ? (
					<ul class={style.tags}>
						{snitip.tagsMeta.size > 0 ? (
							[...snitip.tagsMeta.entries()].map(([tag, tagInfo]) => (
								<li key={tag}>
									<Chip
										tag="a"
										href={`/search?${buildSearchQuery({
											searchQuery: "*",
											filterTags: [tag],
										})}`}
										icon={
											<RawSvg
												aria-hidden
												class={style.tags__icon}
												icon={iconSearch}
											/>
										}
									>
										{tagInfo.displayName}
									</Chip>
								</li>
							))
						) : (
							<li>
								<Chip
									tag="a"
									href={`/search?${buildSearchQuery({
										searchQuery: snitip.title,
									})}`}
									icon={
										<RawSvg
											aria-hidden
											class={style.tags__icon}
											icon={iconSearch}
										/>
									}
								>
									Search for &lsquo;{snitip.title}&rsquo;
								</Chip>
							</li>
						)}
					</ul>
				) : null}
			</div>
		</>
	);
}

export function SnitipPopover({
	snitip,
	headingTag,
	includeSearchTags,
	...extra
}: SnitipProps) {
	return (
		<div
			{...extra}
			popover
			role="dialog"
			aria-label={`Tooltip: ${snitip.title}`}
			class={style.popover}
		>
			<svg
				data-snitip-arrow
				aria-hidden
				width="24"
				height="14"
				viewBox="0 0 24 14"
				fill="none"
				class={style.arrow}
				data-placement="bottom"
			>
				<path
					d="M 2 -1 L 11.2 11.6 C 11.6 12.1333 12.4 12.1333 12.8 11.6 L 22 -1 Z"
					fill="var(--snitip_background-color)"
				/>
				<path
					d="M 2 -1 L 11.2 11.6 C 11.6 12.1333 12.4 12.1333 12.8 11.6 L 22 -1"
					stroke="var(--snitip_border-color)"
					strokeWidth="var(--snitip_border-width)"
				/>
			</svg>
			<div class={style.popover__content}>
				<IconOnlyButton
					data-snitip-close
					tag="button"
					aria-label="Close"
					class={style.closeButton}
				>
					<RawSvg aria-hidden icon={iconClose} />
				</IconOnlyButton>
				<SnitipContent
					snitip={snitip}
					headingTag={headingTag}
					includeSearchTags={includeSearchTags}
				/>
			</div>
		</div>
	);
}
