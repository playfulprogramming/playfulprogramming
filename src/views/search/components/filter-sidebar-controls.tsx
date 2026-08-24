import style from "./filter-sidebar-controls.module.scss";
import type { DisplayContentType, SortType } from "#src/views/search/search.ts";
import { Item, SelectWithLabel } from "#components/select/select.tsx";
import { RadioButtonGroup } from "#components/button-radio-group/button-radio-group.tsx";
import { RadioListButton } from "#components/button-radio-group/button-radio-list.tsx";
import { RawSvg } from "#components/image/raw-svg.tsx";
import ArticlesIcon from "#src/icons/articles.svg?raw";
import NotebookIcon from "#src/icons/notebook.svg?raw";
import { useMemo, useRef } from "preact/hooks";
import type { Languages } from "#types/index.ts";
import type { Translate } from "#utils/translations.ts";

interface FilterSidebarControlsProps {
	sort: SortType;
	setSort: (sortBy: SortType) => void;
	setContentToDisplay: (content: DisplayContentType) => void;
	contentToDisplay: DisplayContentType;
	numberOfPosts: number | null;
	numberOfCollections: number | null;
	locale: Languages;
	translate: Translate;
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
	translate,
}: FilterSidebarControlsProps) => {
	const postsLabel = usePersistedRef(numberOfPosts?.toLocaleString(locale));
	const collectionsLabel = usePersistedRef(
		numberOfCollections?.toLocaleString(locale),
	);
	return (
		<>
			<RadioButtonGroup
				testId="show-group-sidebar"
				label={translate("label.show")}
				defaultValue="articles"
				value={contentToDisplay}
				onChange={(v) => setContentToDisplay(v as DisplayContentType)}
			>
				<RadioListButton
					value="articles"
					leftIcon={<RawSvg icon={ArticlesIcon} />}
					rightIcon={postsLabel}
				>
					{translate("title.articles")}
				</RadioListButton>
				<RadioListButton
					value="collections"
					leftIcon={<RawSvg icon={NotebookIcon} />}
					rightIcon={collectionsLabel}
				>
					{translate("title.collections")}
				</RadioListButton>
			</RadioButtonGroup>
			<div className={style.container}>
				<SelectWithLabel
					testId={"sort-order-group-sidebar"}
					label={translate("label.sort")}
					prefixSelected={""}
					defaultValue={translate("search.sort.relevance")}
					value={sort}
					onChange={(v) => setSort(v as SortType)}
				>
					<Item key={"relevance"}>{translate("search.sort.relevance")}</Item>
					<Item key={"newest"}>{translate("search.sort.newest")}</Item>
					<Item key={"oldest"}>{translate("search.sort.oldest")}</Item>
				</SelectWithLabel>
			</div>
		</>
	);
};
