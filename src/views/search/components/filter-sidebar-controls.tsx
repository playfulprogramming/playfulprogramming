import style from "./filter-sidebar-controls.module.scss";
import { DisplayContentType, SortType } from "src/views/search/search";
import { Item, SelectWithLabel } from "components/select/select";

interface FilterSidebarControlsProps {
	sort: SortType;
	setSort: (sortBy: SortType) => void;
	setContentToDisplay: (content: DisplayContentType) => void;
	contentToDisplay: DisplayContentType;
}

export const FilterSidebarControls = ({
	sort,
	setSort,
	setContentToDisplay,
	contentToDisplay,
}: FilterSidebarControlsProps) => {
	return (
		<div className={style.container}>
			<SelectWithLabel
				testId={"sort-order-group-sidebar"}
				label={"Sort:"}
				prefixSelected={""}
				defaultValue={"Relevance"}
				selectedKey={sort}
				onSelectionChange={(v) => setSort(v as SortType)}
			>
				<Item key={"relevance"}>Relevance</Item>
				<Item key={"newest"}>Newest</Item>
				<Item key={"oldest"}>Oldest</Item>
			</SelectWithLabel>
			<SelectWithLabel
				testId={"show-group-sidebar"}
				label={"Show:"}
				prefixSelected={""}
				defaultValue={"All"}
				selectedKey={contentToDisplay}
				onSelectionChange={(v) => setContentToDisplay(v as DisplayContentType)}
			>
				<Item key={"all"}>All</Item>
				<Item key={"articles"}>Articles</Item>
				<Item key={"collections"}>Collections</Item>
			</SelectWithLabel>
		</div>
	);
};
