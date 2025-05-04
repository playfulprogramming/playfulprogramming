import { SnitipInfo } from "types/SnitipInfo";
import style from "./snitip.module.scss";
import { buildSearchQuery } from "src/views/search/search";
import iconLink from "src/icons/link.svg?raw";
import iconSearch from "src/icons/search.svg?raw";
import iconClose from "src/icons/close.svg?raw";
import { Chip } from "components/chip/chip";
import { HTMLAttributes } from "preact/compat";
import { IconOnlyButton } from "components/button/button";

interface SnitipProps extends HTMLAttributes<HTMLDivElement> {
	snitip: SnitipInfo;
}

export function SnitipContent({ snitip }: SnitipProps) {
	return <>
		<IconOnlyButton
			id="snitip-close"
			tag="button"
			aria-label={"Close"}
			class={style.closeButton}
		>
			<div dangerouslySetInnerHTML={{ __html: iconClose }}></div>
		</IconOnlyButton>
		<div class={style.containerTitle}>
			<h1 class={style.title}>{snitip.title}</h1>
		</div>
		<div class={style.containerBody}>
			<div
				class={style.description}
				dangerouslySetInnerHTML={{ __html: snitip.content }}
			/>
			{snitip.links.length ? (
				<ul class={style.links}>
					{snitip.links.map((link) => (
						<li>
							<a class={`${style.links__item} a`} href={link.href}>
								<div
									aria-hidden
									class={style.links__item__icon}
									dangerouslySetInnerHTML={{ __html: iconLink }}
								/>
								{link.name}
							</a>
						</li>
					))}
				</ul>
			) : (
				[]
			)}
			<ul class={style.tags}>
				{snitip.tagsMeta.size ? (
					[...snitip.tagsMeta.entries()].map(([tag, tagInfo]) => (
						<li>
							<Chip
								tag="a"
								href={"/search?" + buildSearchQuery({ searchQuery: '*', filterTags: [tag] })}
							>
								{tagInfo.displayName}
							</Chip>
						</li>
					))
				) : (
					<li>
						<Chip
							tag="a"
							href={
								"/search?" + buildSearchQuery({ searchQuery: snitip.title })
							}
						>
							<div
								aria-hidden
								class={style.tags__icon}
								dangerouslySetInnerHTML={{ __html: iconSearch }}
							/>
							Search for &lsquo;{snitip.title}&rsquo;
						</Chip>
					</li>
				)}
			</ul>
		</div>
	</>;
}

export function SnitipPopover({ snitip, ...extra }: SnitipProps) {
	return (
		<div {...extra} popover class={style.popover}>
			<svg
				id="snitip-arrow"
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
					stroke-width="var(--snitip_border-width)"
				/>
			</svg>
			<div class={style.popover__content}>
				<SnitipContent snitip={snitip} />
			</div>
		</div>
	);
}
