import styles from "./filter-sidebar.module.scss";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { PostInfo } from "types/PostInfo";
import { ExtendedCollectionInfo } from "types/CollectionInfo";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import { UnicornInfo } from "types/UnicornInfo";
import { SearchInput } from "components/input/input";
import { Button } from "components/button/button";
import { CSSProperties } from "preact/compat";
import { PropsWithChildren } from "components/types";
import { Chip } from "components/chip/chip";
import { useElementSize } from "../../../hooks/use-element-size";
import { useWindowSize } from "../../../hooks/use-window-size";
import { tabletLarge, tabletSmall } from "../../../tokens/breakpoints";

interface FilterSidebarSectionProps {
	title: string;
	selectedNumber: number;
	onClear: () => void;
}

const FilterSidebarSection = ({
	title,
	children,
	selectedNumber,
	onClear,
}: PropsWithChildren<FilterSidebarSectionProps>) => {
	const [collapsed, setCollapsed] = useState(false);

	const { setEl, size } = useElementSize();

	return (
		<div
			className={`${styles.section} ${collapsed ? "" : styles.sectionExpanded}`}
		>
			<div className={styles.sectionHeader}>
				<button
					className={styles.sectionTitle}
					style={{
						paddingRight: size?.width,
					}}
					aria-expanded={!collapsed}
					onClick={() => setCollapsed(!collapsed)}
				>
					<span
						className={`${styles.collapseIcon} ${
							collapsed ? styles.collapsed : ""
						}`}
					/>
					<span
						className={`text-style-button-large ${styles.sectionTitleText}`}
					>
						{title}
					</span>
					<span
						className={`text-style-button-large ${styles.sectionNumberText}`}
					>
						{selectedNumber ? `(${selectedNumber})` : null}
					</span>
				</button>
				<div className={styles.clearContainer} ref={setEl}>
					<Chip tag="button" className={styles.clearChip} onClick={onClear}>
						Clear
					</Chip>
				</div>
			</div>
			<div className={styles.sectionContent} aria-hidden={collapsed}>
				{children}
			</div>
		</div>
	);
};

interface FilterDialogProps {
	isOpen: boolean;
	onClose: (val: string) => void;
}

const FilterDialog = ({ isOpen, onClose }: FilterDialogProps) => {
	//
	const dialogRef = useRef<HTMLDialogElement>(null);

	const onConfirm = useCallback((e: MouseEvent) => {
		e.preventDefault();
		dialogRef.current?.close("CONFIRMED THIS IS GOOD");
	}, []);

	const onFormConfirm = useCallback((e: Event) => {
		e.preventDefault();
		onClose(dialogRef.current.returnValue);
	}, []);

	return (
		<dialog open={isOpen} onClose={onFormConfirm} ref={dialogRef} style={{background: "white", zIndex: 1}}>
			<form>
				<div>Hi</div>
				<button value="cancel" formMethod="dialog">
					Cancel
				</button>
				<button onClick={onConfirm}>Confirm</button>
			</form>
		</dialog>
	);
};

interface FilterSidebar
	extends Pick<
		FilterDisplayProps,
		| "sort"
		| "setSort"
		| "setSelectedAuthorIds"
		| "selectedAuthorIds"
		| "selectedTags"
		| "setSelectedTags"
		| "desktopStyle"
		| "unicornProfilePicMap"
	> {
	tags: string[];
	authors: UnicornInfo[];
	onSelectedAuthorChange: (authorId: string) => void;
	onTagsChange: (tag: string) => void;
}

const FilterSidebar = ({
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
			<FilterSidebarSection
				title={"Tag"}
				selectedNumber={selectedTags.length}
				onClear={() => setSelectedTags([])}
			>
				{tags.map((tag) => {
					return (
						<div>
							<label>
								<span>{tag}</span>
								<input
									type="checkbox"
									onChange={(e) => onTagsChange(tag)}
									checked={selectedTags.includes(tag)}
								/>
							</label>
						</div>
					);
				})}
			</FilterSidebarSection>
			<FilterSidebarSection
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
			</FilterSidebarSection>
		</div>
	);
};

interface FilterDisplayProps {
	unicornProfilePicMap: ProfilePictureMap;
	posts: PostInfo[];

	collections: ExtendedCollectionInfo[];
	selectedTags: string[];
	setSelectedTags: (tags: string[]) => void;
	selectedAuthorIds: string[];
	setSelectedAuthorIds: (authors: string[]) => void;
	sort: "newest" | "oldest";
	setSort: (sortBy: "newest" | "oldest") => void;
	desktopStyle?: CSSProperties;
	isFilterDialogOpen: boolean;
	setFilterIsDialogOpen: (isOpen: boolean) => void;
}

export const FilterDisplay = ({
	unicornProfilePicMap,
	collections,
	posts,
	sort,
	setSort,
	selectedAuthorIds,
	selectedTags,
	setSelectedAuthorIds,
	setSelectedTags,
	desktopStyle,
	isFilterDialogOpen,
	setFilterIsDialogOpen,
}: FilterDisplayProps) => {
	const tags = useMemo(() => {
		const tags = new Set<string>();
		posts.forEach((post) => {
			post.tags.forEach((tag) => {
				tags.add(tag);
			});
		});
		return Array.from(tags);
	}, [posts]);

	const authors = useMemo(() => {
		const authors: UnicornInfo[] = [];
		posts.forEach((post) => {
			post.authorsMeta.forEach((author) => {
				authors.push(author);
			});
		});

		collections.forEach((collection) => {
			collection.authorsMeta.forEach((author) => {
				authors.push(author);
			});
		});

		const uniqueAuthors = new Map<string, UnicornInfo>();
		authors.forEach((author) => {
			uniqueAuthors.set(author.id, author);
		});
		return Array.from(uniqueAuthors.values());
	}, [posts, collections]);

	const onSelectedAuthorChange = (id: string) => {
		const isPresent = selectedAuthorIds.includes(id);
		if (isPresent) {
			setSelectedAuthorIds(selectedAuthorIds.filter((author) => author !== id));
		} else {
			setSelectedAuthorIds([...selectedAuthorIds, id]);
		}
	};

	const onTagsChange = (id: string) => {
		const isPresent = selectedTags.includes(id);
		if (isPresent) {
			setSelectedTags(selectedTags.filter((tag) => tag !== id));
		} else {
			setSelectedTags([...selectedTags, id]);
		}
	};

	const windowSize = useWindowSize();

	const shouldShowDialog = windowSize.width < tabletLarge;

	if (shouldShowDialog) {
		return (
			<FilterDialog
				isOpen={isFilterDialogOpen}
				onClose={(val) => {
					alert(val);
					setFilterIsDialogOpen(false);
				}}
			/>
		);
	}

	return (
		<FilterSidebar
			unicornProfilePicMap={unicornProfilePicMap}
			sort={sort}
			setSort={setSort}
			selectedAuthorIds={selectedAuthorIds}
			selectedTags={selectedTags}
			setSelectedAuthorIds={setSelectedAuthorIds}
			setSelectedTags={setSelectedTags}
			desktopStyle={desktopStyle}
			tags={tags}
			authors={authors}
			onSelectedAuthorChange={onSelectedAuthorChange}
			onTagsChange={onTagsChange}
		/>
	);
};
