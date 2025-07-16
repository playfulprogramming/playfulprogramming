import { useCallback, useEffect, useState } from "preact/hooks";
import styles from "./filter-dialog.module.scss";
import { useWindowSize } from "src/hooks/use-window-size";
import { mobile } from "src/tokens/breakpoints";
import { Dialog } from "components/dialog/dialog";
import { FilterSection } from "./filter-section";
import { ExtendedTag, ExtendedUnicorn } from "./types";
import { LargeButton, LargeIconOnlyButton } from "components/button/button";
import { FilterSectionItem } from "./filter-section-item";
import { Picture as UUPicture } from "components/image/picture";
import { DEFAULT_TAG_EMOJI } from "./constants";
import close from "src/icons/close.svg?raw";
import { FilterState, useFilterState } from "../use-filter-state";

interface FilterDialogProps {
	isOpen: boolean;
	onClose: (val: {
		selectedAuthorIds: string[];
		selectedTags: string[];
	}) => void;
	tags: ExtendedTag[];
	authors: ExtendedUnicorn[];
	filterState: FilterState;
	isHybridSearch: boolean;
}

type FilterDialogInner = Omit<FilterDialogProps, "isOpen" | "onClose">;

const FilterDialogMobile = ({
	tags,
	authors,
	filterState,
	isHybridSearch,
}: FilterDialogInner) => {
	return (
		<div class={styles.mobileDialogContainer}>
			<div class={styles.dialogTitleContainer}>
				<h1 class={`text-style-headline-4 ${styles.dialogTitle}`}>Filter</h1>
			</div>
			<FilterSection
				title={"Tag"}
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
				class={styles.mobileAuthorList}
				title={"Author"}
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
			<div class={styles.mobileButtonsContainer}>
				<LargeButton
					class={styles.mobileButton}
					value="cancel"
					variant="primary"
					tag="button"
				>
					Cancel
				</LargeButton>
				<LargeButton
					class={styles.mobileButton}
					tag="button"
					value="confirm"
					variant="primary-emphasized"
				>
					Filter
				</LargeButton>
			</div>
		</div>
	);
};

const FilterDialogSmallTablet = ({
	tags,
	authors,
	filterState,
	isHybridSearch,
}: FilterDialogInner) => {
	return (
		<div class={styles.tabletDialogContainer}>
			<div class={styles.dialogTitleContainer}>
				<LargeIconOnlyButton
					tag="button"
					value="cancel"
					class={styles.closeButton}
					aria-label="Close"
				>
					<span
						class={styles.closeIcon}
						dangerouslySetInnerHTML={{ __html: close }}
					/>
				</LargeIconOnlyButton>
				<h1 class={`text-style-headline-4 ${styles.dialogTitle}`}>Filter</h1>
				<LargeButton variant="primary-emphasized" tag="button" value="confirm">
					Filter results
				</LargeButton>
			</div>
			<div class={styles.filterSelectionContainer}>
				<div class={styles.filterSelection}>
					<FilterSection
						title={"Tag"}
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
				</div>
				<div class={styles.filterSelection}>
					<FilterSection
						title={"Author"}
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
				</div>
			</div>
		</div>
	);
};

export const FilterDialog = ({
	isOpen,
	onClose,
	tags,
	authors,
	filterState: parentFilterState,
	isHybridSearch,
}: FilterDialogProps) => {
	/**
	 * Inner state
	 */
	const [selectedTags, setSelectedTags] = useState(parentFilterState.tags);
	const [selectedAuthorIds, setSelectedAuthorIds] = useState(
		parentFilterState.authors,
	);
	const filterState = useFilterState({
		tags: selectedTags,
		authors: selectedAuthorIds,
		setTags: setSelectedTags,
		setAuthors: setSelectedAuthorIds,
	});

	useEffect(() => {
		// when the filter dialog is opened, reset its state to match the current search filters
		if (isOpen) {
			setSelectedTags(parentFilterState.tags);
			setSelectedAuthorIds(parentFilterState.authors);
		}
	}, [isOpen]);

	const onFormConfirm = useCallback(
		(returnValue?: string) => {
			// if the "confirm" button is pressed, the dialog should
			// close with the selected values
			if (returnValue === "confirm") {
				onClose({
					selectedAuthorIds: filterState.authors,
					selectedTags: filterState.tags,
				});
				return;
			}

			// otherwise, return the existing values with no changes
			onClose({
				selectedAuthorIds: parentFilterState.authors,
				selectedTags: parentFilterState.tags,
			});
		},
		[
			filterState.authors,
			filterState.tags,
			parentFilterState.authors,
			parentFilterState.tags,
		],
	);

	/**
	 * Styling hooks
	 */
	const windowSize = useWindowSize();

	// Adding 100px as a workaround since the mobile breakpoint is too small for this layout
	// https://github.com/playfulprogramming/playfulprogramming/issues/655
	const isMobile = windowSize.width <= mobile + 100;

	const Inner = isMobile ? FilterDialogMobile : FilterDialogSmallTablet;

	return (
		<Dialog
			open={isOpen}
			onClose={onFormConfirm}
			dialogClass={styles.dialog}
			formClass={styles.dialogForm}
		>
			<Inner
				tags={tags}
				authors={authors}
				filterState={filterState}
				isHybridSearch={isHybridSearch}
			/>
		</Dialog>
	);
};
