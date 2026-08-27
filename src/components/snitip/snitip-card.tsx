import type { HTMLAttributes } from "preact/compat";
import type { SnitipInfo } from "#types/SnitipInfo.ts";
import { SnitipContent, type SnitipProps } from "./snitip.tsx";
import style from "./snitip-card.module.scss";

export function SnitipCard(props: SnitipProps) {
	return (
		<div class={style.snitipCard}>
			<SnitipContent {...props} />
		</div>
	);
}

export interface SnitipCardGridProps extends HTMLAttributes<HTMLUListElement> {
	snitips: SnitipInfo[];
	locale: SnitipProps["locale"];
	headingTag?: SnitipProps["headingTag"];
}

export function SnitipCardGrid({
	snitips,
	headingTag,
	locale,
	...extra
}: SnitipCardGridProps) {
	return (
		<ul {...extra} role="list" class={style.list}>
			{snitips.map((snitip) => (
				<li key={snitip.id}>
					<SnitipCard
						snitip={snitip}
						headingTag={headingTag}
						includeSearchTags={false}
						locale={locale}
					/>
				</li>
			))}
		</ul>
	);
}
