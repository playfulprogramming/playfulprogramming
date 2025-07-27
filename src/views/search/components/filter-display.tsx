import { useMemo } from "preact/hooks";
import { PersonInfo, TagInfo } from "types/index";
import { CSSProperties } from "preact/compat";
import { useWindowSize } from "../../../hooks/use-window-size";
import { tabletLarge } from "../../../tokens/breakpoints";
import { FilterDialog } from "./filter-dialog";
import { FilterSidebar } from "./filter-sidebar";
import tagsObj from "../../../../content/data/tags.json";
import { DisplayContentType, SortType } from "src/views/search/search";
import { ExtendedTag, ExtendedUnicorn } from "./types";
import { FilterState } from "../use-filter-state";

const tagsMap: Map<string, TagInfo> = new Map(Object.entries(tagsObj));

interface FilterDisplayProps {
	tagCounts: Record<string, number>;
	authorCounts: Record<string, number>;
	peopleMap: Map<string, PersonInfo>;
	filterState: FilterState,
	sort: SortType;
	setSort: (sortBy: SortType) => void;
	desktopStyle?: CSSProperties;
	isFilterDialogOpen: boolean;
	isHybridSearch: boolean;
	setFilterIsDialogOpen: (isOpen: boolean) => void;
	searchString: string;
	setContentToDisplay: (content: DisplayContentType) => void;
	contentToDisplay: DisplayContentType;
	numberOfPosts: number | null;
	numberOfCollections: number | null;
}

export const FilterDisplay = ({
	tagCounts,
	authorCounts,
	peopleMap,
	sort,
	setSort,
	filterState,
	desktopStyle,
	isFilterDialogOpen,
	isHybridSearch,
	setFilterIsDialogOpen,
	searchString,
	setContentToDisplay,
	contentToDisplay,
	numberOfPosts,
	numberOfCollections,
}: FilterDisplayProps) => {
	const tags: ExtendedTag[] = useMemo(() => {
		const totalEntries = {
			// Ensure that selected tags are included in the filter list
			...Object.fromEntries(filterState.tags.map((tag) => [tag, 0])),
			...tagCounts,
		};

		return Object.entries(totalEntries)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(
				([tag, count]) =>
					({
						tag,
						numPosts: count,
						...tagsMap.get(tag),
					}) satisfies Partial<ExtendedTag>,
			)
			.filter((a): a is ExtendedTag => !!a.displayName);
	}, [tagCounts]);

	const authors: ExtendedUnicorn[] = useMemo(() => {
		const totalEntries = {
			// Ensure that selected authors are included in the filter list
			...Object.fromEntries(filterState.authors.map((author) => [author, 0])),
			...authorCounts,
		};

		return Object.entries(totalEntries)
			.map(
				([author, count]) =>
					({
						numPosts: count,
						...peopleMap.get(author),
					}) satisfies Partial<ExtendedUnicorn>,
			)
			.filter((a): a is ExtendedUnicorn => !!a.name)
			.sort((a, b) => a.name.localeCompare(b.name));
	}, [authorCounts, peopleMap]);

	const windowSize = useWindowSize();

	const shouldShowDialog = windowSize.width <= tabletLarge;

	if (shouldShowDialog) {
		return (
			<FilterDialog
				isOpen={isFilterDialogOpen}
				onClose={(props) => {
					filterState.setFilters({
						tags: props.selectedTags,
						authors: props.selectedAuthorIds,
					});
					setFilterIsDialogOpen(false);
				}}
				tags={tags}
				authors={authors}
				filterState={filterState}
				isHybridSearch={isHybridSearch}
			/>
		);
	}

	return (
		<FilterSidebar
			sort={sort}
			setSort={setSort}
			desktopStyle={desktopStyle}
			tags={tags}
			authors={authors}
			filterState={filterState}
			searchString={searchString}
			setContentToDisplay={setContentToDisplay}
			contentToDisplay={contentToDisplay}
			isHybridSearch={isHybridSearch}
			numberOfPosts={numberOfPosts}
			numberOfCollections={numberOfCollections}
		/>
	);
};
