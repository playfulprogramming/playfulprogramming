import style from "./filter-sidebar-controls.module.scss";
import { DisplayContentType, SortType } from "src/views/search/search";
import { Item, SelectWithLabel } from "components/select/select";
import { RadioButtonGroup } from "components/button-radio-group/button-radio-group";
import { RadioListButton } from "components/button-radio-group/button-radio-list";
import { RawSvg } from "components/image/raw-svg";
import ArticlesIcon from "src/icons/articles.svg?raw";
import NotebookIcon from "src/icons/notebook.svg?raw";
import { useMemo, useRef } from "preact/hooks";

interface FilterSidebarControlsProps {
	sort: SortType;
	setSort: (sortBy: SortType) => void;
	setContentToDisplay: (content: DisplayContentType) => void;
	contentToDisplay: DisplayContentType;
	numberOfPosts: number | null;
	numberOfCollections: number | null;
}

function usePersistedRef<T>(value: T | undefined) {
	const ref = useRef<T>();
	return useMemo(() => {
		if (value !== undefined) {
			ref.current = value;
			return value;
		} else {
			return ref.current ?? value;
		}
	}, [value]);
}

export const FilterSidebarControls = ({
	sort,
	setSort,
	setContentToDisplay,
	contentToDisplay,
	numberOfPosts,
	numberOfCollections,
}: FilterSidebarControlsProps) => {
	const postsLabel = usePersistedRef(numberOfPosts?.toLocaleString());
	const collectionsLabel = usePersistedRef(
		numberOfCollections?.toLocaleString(),
	);
	return (
		<>
			<RadioButtonGroup
				testId="show-group-sidebar"
				label="Show:"
				defaultValue="articles"
				value={contentToDisplay}
				onChange={(v) => setContentToDisplay(v as DisplayContentType)}
			>
				<RadioListButton
					value="articles"
					leftIcon={<RawSvg icon={ArticlesIcon} />}
					rightIcon={postsLabel}
				>
					Articles
				</RadioListButton>
				<RadioListButton
					value="collections"
					leftIcon={<RawSvg icon={NotebookIcon} />}
					rightIcon={collectionsLabel}
				>
					Collections
				</RadioListButton>
			</RadioButtonGroup>
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
			</div>
		</>
	);
};
