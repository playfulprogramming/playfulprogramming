import styles from "./filter-sidebar.module.scss";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { PostInfo } from "types/PostInfo";
import { ExtendedCollectionInfo } from "types/CollectionInfo";
import { useMemo } from "preact/hooks";
import { UnicornInfo } from "types/UnicornInfo";
import { SearchInput } from "components/input/input";
import { Button } from "components/button/button";

interface FilterSidebarProps {
	unicornProfilePicMap: ProfilePictureMap;
	posts: PostInfo[];

	collections: ExtendedCollectionInfo[];
	selectedTags: string[];
	setSelectedTags: (tags: string[]) => void;
	selectedAuthorIds: string[];
	setSelectedAuthorIds: (authors: string[]) => void;
	sort: "newest" | "oldest";
	setSort: (sortBy: "newest" | "oldest") => void;
}

export const FilterSidebar = ({
	unicornProfilePicMap,
	collections,
	posts,
	sort,
	setSort,
	selectedAuthorIds,
	selectedTags,
	setSelectedAuthorIds,
	setSelectedTags,
}: FilterSidebarProps) => {
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

	return (
		<div className={styles.gridContainer}>
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
			<div className={styles.tagsContainer}>
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
			</div>
			<div className={styles.authorsContainer}>
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
			</div>
		</div>
	);
};
