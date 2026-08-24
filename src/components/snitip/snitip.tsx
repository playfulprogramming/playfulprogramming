import type { HTMLAttributes } from "preact/compat";
import { Chip } from "#components/chip/chip.tsx";
import { RawSvg } from "#components/image/raw-svg.tsx";
import iconLink from "#src/icons/link.svg?raw";
import iconSearch from "#src/icons/search.svg?raw";
import { buildSearchQuery } from "#src/views/search/search.ts";
import type { SnitipInfo } from "#types/SnitipInfo.ts";
import style from "./snitip.module.scss";
import type { Translate } from "#utils/translations.ts";

export interface SnitipProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	"translate"
> {
	snitip: SnitipInfo;
	translate: Translate;
	headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	headingId?: string;
	headingLabelPrefix?: string;
	headingTabIndex?: -1;
	includeSearchTags?: boolean;
}

export function SnitipContent({
	snitip,
	headingTag: HeadingTag = "h1",
	headingId,
	headingLabelPrefix,
	headingTabIndex,
	includeSearchTags = true,
	translate,
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
				<HeadingTag
					id={headingId}
					tabIndex={headingTabIndex}
					data-snitip-title={headingId ? "" : undefined}
					data-no-heading-link={headingId ? "" : undefined}
					class={`${style.title} text-style-headline-6`}
				>
					{headingLabelPrefix ? (
						<span class="visually-hidden">{headingLabelPrefix}</span>
					) : null}
					{snitip.title}
				</HeadingTag>
			</div>
			<div class={style.containerBody}>
				<div
					class={style.description}
					dangerouslySetInnerHTML={{ __html: snitip.content }}
				/>
				{snitip.links.length > 0 ? (
					<ul
						class={style.links}
						aria-label={translate("label.links")}
						role="list"
					>
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
					<ul
						class={style.tags}
						aria-label={translate("title.tags")}
						role="list"
					>
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
									{translate("action.search_for_term", snitip.title)}
								</Chip>
							</li>
						)}
					</ul>
				) : null}
			</div>
		</>
	);
}
