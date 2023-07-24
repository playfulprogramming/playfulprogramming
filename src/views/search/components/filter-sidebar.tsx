import { UnicornInfo } from "types/UnicornInfo";
import styles from "./filter-sidebar.module.scss";
import { SearchInput } from "components/input/input";
import { Button } from "components/button/button";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { CSSProperties } from "preact/compat";
import { FilterSection } from "./filter-section";
import { CheckboxBox } from "components/checkbox-box/checkbox-box";
import { VisuallyHidden } from "react-aria";

interface FilterSidebar {
	unicornProfilePicMap: ProfilePictureMap;
	desktopStyle?: CSSProperties;
	selectedTags: string[];
	setSelectedTags: (tags: string[]) => void;
	selectedAuthorIds: string[];
	setSelectedAuthorIds: (authors: string[]) => void;
	sort: "newest" | "oldest";
	setSort: (sortBy: "newest" | "oldest") => void;
	tags: string[];
	authors: UnicornInfo[];
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
				{tags.map((tag) => {
					return (
						<div>
							<CheckboxBox
								selected={true}
								disabled={true}
								wrapper={(children) => (
									<label style={{ width: "100%", display: "block" }}>
										<span style={{ marginRight: "auto" }}>{tag}</span>
										<VisuallyHidden>
											<input
												disabled={true}
												type="checkbox"
												onChange={(e) => onTagsChange(tag)}
												checked={selectedTags.includes(tag)}
											/>
										</VisuallyHidden>
										{children}
									</label>
								)}
							/>
						</div>
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
						<div>
							<label>
								<span>{author.name}</span>
								<input
									type="checkbox"
									onChange={(e) => onSelectedAuthorChange(author.id)}
									checked={selectedAuthorIds.includes(author.id)}
								/>
							</label>
						</div>
					);
				})}
			</FilterSection>
		</div>
	);
};
