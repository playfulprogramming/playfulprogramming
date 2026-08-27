import style from "./filter-sidebar-controls.module.scss";
import type { DisplayContentType, SortType } from "#src/views/search/search.ts";
import { Item, SelectWithLabel } from "#components/select/select.tsx";
import { RadioButtonGroup } from "#components/button-radio-group/button-radio-group.tsx";
import { RadioListButton } from "#components/button-radio-group/button-radio-list.tsx";
import { RawSvg } from "#components/image/raw-svg.tsx";
import ArticlesIcon from "#src/icons/articles.svg?raw";
import NotebookIcon from "#src/icons/notebook.svg?raw";
import { useMemo, useRef } from "preact/hooks";
import type { Locale } from "#src/paraglide/runtime.js";
import { m } from "#src/paraglide/messages.js";

interface FilterSidebarControlsProps {
	sort: SortType;
	setSort: (sortBy: SortType) => void;
	setContentToDisplay: (content: DisplayContentType) => void;
	contentToDisplay: DisplayContentType;
	numberOfPosts: number | null;
	numberOfCollections: number | null;
	locale: Locale;
}

function usePersistedRef<T>(value: T | undefined) {
	const ref = useRef<T>();
	return useMemo(() => {
		if (value !== undefined) {
			ref.current = value;
			return value;
		}
		return ref.current ?? value;
	}, [value]);
}

export const FilterSidebarControls = ({
	sort,
	setSort,
	setContentToDisplay,
	contentToDisplay,
	numberOfPosts,
	numberOfCollections,
	locale,
}: FilterSidebarControlsProps) => {
	const postsLabel = usePersistedRef(numberOfPosts?.toLocaleString(locale));
	const collectionsLabel = usePersistedRef(
		numberOfCollections?.toLocaleString(locale),
	);
	return (
		<>
			<RadioButtonGroup
				testId="show-group-sidebar"
				label={m.label_show({}, { locale })}
				defaultValue="articles"
				value={contentToDisplay}
				onChange={(v) => setContentToDisplay(v as DisplayContentType)}
			>
				<RadioListButton
					value="articles"
					leftIcon={<RawSvg icon={ArticlesIcon} />}
					rightIcon={postsLabel}
				>
					{m.title_articles({}, { locale })}
				</RadioListButton>
				<RadioListButton
					value="collections"
					leftIcon={<RawSvg icon={NotebookIcon} />}
					rightIcon={collectionsLabel}
				>
					{m.title_collections({}, { locale })}
				</RadioListButton>
			</RadioButtonGroup>
			<div className={style.container}>
				<SelectWithLabel
					testId={"sort-order-group-sidebar"}
					label={m.label_sort({}, { locale })}
					prefixSelected={""}
					defaultValue={m.search_sort_relevance({}, { locale })}
					value={sort}
					onChange={(v) => setSort(v as SortType)}
				>
					<Item key={"relevance"}>
						{m.search_sort_relevance({}, { locale })}
					</Item>
					<Item key={"newest"}>{m.search_sort_newest({}, { locale })}</Item>
					<Item key={"oldest"}>{m.search_sort_oldest({}, { locale })}</Item>
				</SelectWithLabel>
			</div>
		</>
	);
};
