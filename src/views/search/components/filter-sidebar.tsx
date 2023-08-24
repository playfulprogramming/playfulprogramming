import { UnicornInfo } from "types/UnicornInfo";
import styles from "./filter-sidebar.module.scss";
import { SearchInput } from "components/input/input";
import { Button, LargeButton } from "components/button/button";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { CSSProperties } from "preact/compat";
import { FilterSection } from "./filter-section";
import { FilterSectionItem } from "./filter-section-item";
import { Picture as UUPicture } from "components/image/picture";
import { ExtendedTag, ExtendedUnicorn } from "./types";
import { DEFAULT_TAG_EMOJI } from "./constants";
import {
	RadioButton,
	RadioButtonGroup,
} from "components/button-radio-group/button-radio-group";
import { useElementSize } from "../../../hooks/use-element-size";

interface FilterSidebar {
	unicornProfilePicMap: ProfilePictureMap;
	desktopStyle?: CSSProperties;
	selectedTags: string[];
	setSelectedTags: (tags: string[]) => void;
	selectedAuthorIds: string[];
	setSelectedAuthorIds: (authors: string[]) => void;
	sort: "newest" | "oldest" | null;
	setSort: (sortBy: "newest" | "oldest" | null) => void;
	tags: ExtendedTag[];
	authors: ExtendedUnicorn[];
	onSelectedAuthorChange: (authorId: string) => void;
	onTagsChange: (tag: string) => void;
	searchString: string;
}

export const FilterSidebar = ({
	sort,
	setSort,
	selectedAuthorIds,
	selectedTags,
	setSelectedAuthorIds,
	setSelectedTags,
	desktopStyle,
	onSelectedAuthorChange,
	onTagsChange,
	authors,
	tags,
	unicornProfilePicMap,
	searchString,
}: FilterSidebar) => {
	const { setEl, size } = useElementSize({ includeMargin: false });

	const hideSearchbar = !searchString;
	return (
		<div
			ref={setEl}
			className={`${styles.sidebarContainer}`}
			style={{
				...desktopStyle,
				marginLeft: hideSearchbar ? `calc(0px - ${size.width}px)` : "",
			}}
			inert={hideSearchbar}
		>
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
			<RadioButtonGroup
				testId={"sort-order-group-sidebar"}
				className={styles.buttonsContainer}
				value={sort}
				label={"Sort order"}
				onChange={(val) => {
					if (sort === val) {
						setSort(null);
						return;
					}

					setSort(val as "newest");
				}}
			>
				<RadioButton value={"newest"}>Newest</RadioButton>
				<RadioButton value={"oldest"}>Oldest</RadioButton>
			</RadioButtonGroup>
			<FilterSection
				title={"Tag"}
				data-testid="tag-filter-section-sidebar"
				selectedNumber={selectedTags.length}
				onClear={() => setSelectedTags([])}
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
							selected={selectedTags.includes(tag.tag)}
							onChange={() => onTagsChange(tag.tag)}
						/>
					);
				})}
			</FilterSection>
			<FilterSection
				title={"Author"}
				data-testid="author-filter-section-sidebar"
				selectedNumber={selectedAuthorIds.length}
				onClear={() => setSelectedAuthorIds([])}
			>
				{authors.map((author) => {
					return (
						<FilterSectionItem
							count={author.numPosts}
							icon={
								<UUPicture
									picture={unicornProfilePicMap.find((u) => u.id === author.id)}
									alt={""}
									class={styles.authorIcon}
								/>
							}
							label={author.name}
							selected={selectedAuthorIds.includes(author.id)}
							onChange={() => onSelectedAuthorChange(author.id)}
						/>
					);
				})}
			</FilterSection>
		</div>
	);
};
