import { UnicornInfo } from "types/UnicornInfo";
import styles from "./filter-sidebar.module.scss";
import { SearchInput } from "components/input/input";
import { Button } from "components/button/button";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { CSSProperties } from "preact/compat";
import { FilterSection } from "./filter-section";
import { FilterSectionItem } from "./filter-section-item";
import { Picture as UUPicture } from "components/image/picture";
import { ExtendedTag, ExtendedUnicorn } from "./types";

const DEFAULT_TAG_EMOJI = [
	"🦄",
	"🌈",
	"🎉",
	"🎊",
	"✍️",
	"📔",
	"📕",
	"📖",
	"📗",
	"📘",
	"📙",
	"📚",
	"📑",
	"🔖",
	"🧾",
	"🤔",
	"📝",
	"📄",
	"📃",
	"📑",
	"📊",
	"📈",
	"🗒️",
];

interface FilterSidebar {
	unicornProfilePicMap: ProfilePictureMap;
	desktopStyle?: CSSProperties;
	selectedTags: string[];
	setSelectedTags: (tags: string[]) => void;
	selectedAuthorIds: string[];
	setSelectedAuthorIds: (authors: string[]) => void;
	sort: "newest" | "oldest";
	setSort: (sortBy: "newest" | "oldest") => void;
	tags: ExtendedTag[];
	authors: ExtendedUnicorn[];
	onSelectedAuthorChange: (authorId: string) => void;
	onTagsChange: (tag: string) => void;
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
}: FilterSidebar) => {
	return (
		<div className={styles.sidebarContainer} style={desktopStyle}>
			<SearchInput
				hideSearchButton={true}
				usedInPreact={true}
				placeholder="Filter by..."
			/>
			<div className={styles.buttonsContainer}>
				<Button
					onClick={() => setSort("newest")}
					variant={sort === "newest" ? "primary-emphasized" : "primary"}
				>
					Newest
				</Button>
				<Button
					onClick={() => setSort("oldest")}
					variant={sort === "oldest" ? "primary-emphasized" : "primary"}
				>
					Oldest
				</Button>
			</div>
			<FilterSection
				title={"Tag"}
				selectedNumber={selectedTags.length}
				onClear={() => setSelectedTags([])}
			>
				{tags.map((tag, i) => {
					return (
						<FilterSectionItem
							count={tag.numPosts}
							icon={
								tag.image ? (
									<img src={tag.image} className={styles.tagIcon} />
								) : tag.emoji ? (
									<span className={styles.tagIcon}>{tag.emoji}</span>
								) : (
									<span className={styles.tagIcon}>
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
