import { SnitipInfo } from "types/SnitipInfo";
import { SnitipContent, SnitipProps } from "./snitip";
import style from "./snitip-card.module.scss";
import { HTMLAttributes } from "preact/compat";

export function SnitipCard(props: SnitipProps) {
	return (
		<div class={style.snitipCard}>
			<SnitipContent {...props} />
		</div>
	);
}

export interface SnitipCardGridProps extends HTMLAttributes<HTMLUListElement> {
	snitips: SnitipInfo[];
	headingTag: SnitipProps["headingTag"];
}

export function SnitipCardGrid({ snitips, headingTag, ...extra }: SnitipCardGridProps) {
	return (
		<ul {...extra} role="list" class={style.list}>
			{snitips.map((snitip) => (
				<li key={snitip.id}>
					<SnitipCard snitip={snitip} headingTag={headingTag} includeSearchTags={false} />
				</li>
			))}
		</ul>
	)
}
