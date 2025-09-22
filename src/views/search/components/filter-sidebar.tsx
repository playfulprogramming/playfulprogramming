import styles from "./filter-sidebar.module.scss";
import { LargeButton } from "components/button/button";
import { CSSProperties } from "preact/compat";
import { FilterSection } from "./filter-section";
import { FilterSectionItem } from "./filter-section-item";
import { Picture as UUPicture } from "components/image/picture";
import { ExtendedTag, ExtendedUnicorn } from "./types";
import { DisplayContentType, SortType } from "src/views/search/search";
import { DEFAULT_TAG_EMOJI } from "./constants";
import { FilterSidebarControls } from "./filter-sidebar-controls";
import { FilterState } from "../use-filter-state";

interface FilterSidebar {
	desktopStyle?: CSSProperties;
	sort: SortType;
	setSort: (sortBy: SortType) => void;
	tags: ExtendedTag[];
	authors: ExtendedUnicorn[];
	filterState: FilterState;
	searchString: string;
	setContentToDisplay: (content: DisplayContentType) => void;
	contentToDisplay: DisplayContentType;
	isHybridSearch: boolean;
	numberOfPosts: number | null;
	numberOfCollections: number | null;
}

export const FilterSidebar = ({
	sort,
	setSort,
	desktopStyle,
	authors,
	tags,
	filterState,
	searchString,
	setContentToDisplay,
	contentToDisplay,
	isHybridSearch,
	numberOfPosts,
	numberOfCollections,
}: FilterSidebar) => {
	const hideSearchbar = !searchString;
	return (
		<aside
			className={`${styles.sidebarContainer}`}
			style={{
				...desktopStyle,
			}}
			inert={hideSearchbar}
		>
			<h2 className="visually-hidden">Filters</h2>
			<LargeButton
				tag="button"
				type="button"
				class={styles.jumpToContents}
				onClick={() =>
					(document.querySelector("#search-bar") as HTMLInputElement).focus()
				}
			>
				Jump to search bar
			</LargeButton>

			<FilterSidebarControls
				sort={sort}
				setSort={setSort}
				setContentToDisplay={setContentToDisplay}
				contentToDisplay={contentToDisplay}
				numberOfPosts={numberOfPosts}
				numberOfCollections={numberOfCollections}
			/>
			<FilterSection
				title={"Tag"}
				data-testid="tag-filter-section-sidebar"
				selectedNumber={filterState.tags.length}
				onClear={() => filterState.setTags([])}
			>
				{tags.map((tag, i) => {
					return (
						<FilterSectionItem
							count={tag.numPosts}
							icon={
								tag.image ? (
									<img src={tag.image} alt="" className={styles.tagImage} />
								) : tag.emoji ? (
									<span className={styles.tagEmoji}>{tag.emoji}</span>
								) : (
									<span className={styles.tagEmoji}>
										{DEFAULT_TAG_EMOJI[i % DEFAULT_TAG_EMOJI.length]}
									</span>
								)
							}
							label={tag?.displayName ?? tag.tag}
							selected={filterState.tags.includes(tag.tag)}
							onChange={(selected) =>
								filterState.onTagChange(tag.tag, selected)
							}
							isHybridSearch={isHybridSearch}
						/>
					);
				})}
			</FilterSection>
			<FilterSection
				title={"Author"}
				data-testid="author-filter-section-sidebar"
				selectedNumber={filterState.authors.length}
				onClear={() => filterState.setAuthors([])}
			>
				{authors.map((author) => {
					return (
						<FilterSectionItem
							count={author.numPosts}
							icon={
								<UUPicture
									src={author.profileImgMeta.relativeServerPath}
									width={24}
									height={24}
									alt={""}
									class={styles.authorIcon}
								/>
							}
							label={author.name}
							selected={filterState.authors.includes(author.id)}
							onChange={(selected) =>
								filterState.onAuthorChange(author.id, selected)
							}
							isHybridSearch={isHybridSearch}
						/>
					);
				})}
			</FilterSection>
		</aside>
	);
};
