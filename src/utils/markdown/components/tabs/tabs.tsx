/** @jsxRuntime automatic */
import classNames from "classnames";
import { Node, Element } from "hast";

export interface TabInfo {
	slug: string;
	name: string;
	contents: Node[];

	// array of header slugs that are inside the header contents, for URL hash behavior
	headers: string[];
}

interface TabsProps {
	tabs: TabInfo[];
	isSmall: boolean;
}

/** @jsxImportSource hastscript */
export function Tabs({ tabs, isSmall }: TabsProps): Element {
	return (
		<div class={classNames("tabs", isSmall && "tabs-small")}>
			<ul role="tablist" class="tabs__tab-list">
				{tabs.map(({ slug, name, headers }, index) => (
					<li
						id={`tab-${index}`}
						role="tab"
						class="tabs__tab text-style-body-medium-bold"
						data-tabname={slug}
						data-headers={JSON.stringify(headers)}
						aria-selected={index === 0}
						aria-controls={`panel-${index}`}
						tabIndex={index === 0 ? 0 : -1}
					>
						{name}
					</li>
				))}
			</ul>

			{tabs.map(({ contents }, index) => (
				<div
					id={`panel-${index}`}
					role="tabpanel"
					class="tabs__tab-panel"
					tabIndex={0}
					aria-labelledby={`tab-${index}`}
					aria-hidden={index === 0 ? undefined : true}
				>
					<div class="tabs__tab-panel__inner">{contents}</div>
				</div>
			))}
		</div>
	) as never;
}
