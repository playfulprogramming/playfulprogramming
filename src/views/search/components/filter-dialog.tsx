import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import styles from "./filter-dialog.module.scss";
import { useWindowSize } from "../../../hooks/use-window-size";
import { mobile } from "../../../tokens/breakpoints";
import { FilterSection } from "./filter-section";
import { ExtendedTag, ExtendedUnicorn } from "./types";
import {
	Button,
	LargeButton,
	LargeIconOnlyButton,
} from "components/button/button";
import { FilterSectionItem } from "./filter-section-item";
import { Picture as UUPicture } from "components/image/picture";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { DEFAULT_TAG_EMOJI } from "./constants";
import close from "src/icons/close.svg?raw";

interface FilterDialogProps {
	isOpen: boolean;
	onClose: (val: {
		selectedAuthorIds: string[];
		selectedTags: string[];
	}) => void;
	tags: ExtendedTag[];
	authors: ExtendedUnicorn[];
	unicornProfilePicMap: ProfilePictureMap;
	selectedAuthorIds: string[];
	selectedTags: string[];
}

interface FilterDialogInner
	extends Omit<FilterDialogProps, "isOpen" | "onClose"> {
	selectedTags: string[];
	selectedAuthorIds: string[];
	onSelectedAuthorChange: (id: string) => void;
	onTagsChange: (id: string) => void;
	setSelectedTags: (tags: string[]) => void;
	setSelectedAuthorIds: (authors: string[]) => void;
	onConfirm: () => void;
	onCancel: () => void;
}

const FilterDialogMobile = ({
	onConfirm,
	onCancel,
	tags,
	authors,
	setSelectedTags,
	setSelectedAuthorIds,
	onSelectedAuthorChange,
	onTagsChange,
	selectedTags,
	selectedAuthorIds,
	unicornProfilePicMap,
}: FilterDialogInner) => {
	return (
		<div class={styles.mobileDialogContainer}>
			<div class={styles.dialogTitleContainer}>
				<h1 class={`text-style-headline-4 ${styles.dialogTitle}`}>Filter</h1>
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
				class={styles.mobileAuthorList}
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
			<div class={styles.mobileButtonsContainer}>
				<LargeButton
					class={styles.mobileButton}
					type="button"
					variant="primary"
					onClick={onCancel}
				>
					Cancel
				</LargeButton>
				<LargeButton
					class={styles.mobileButton}
					type="button"
					variant="primary-emphasized"
					onClick={onConfirm}
				>
					Filter
				</LargeButton>
			</div>
		</div>
	);
};

const FilterDialogSmallTablet = ({
	onConfirm,
	onCancel,
	tags,
	authors,
	setSelectedTags,
	setSelectedAuthorIds,
	onSelectedAuthorChange,
	onTagsChange,
	selectedTags,
	selectedAuthorIds,
	unicornProfilePicMap,
}: FilterDialogInner) => {
	return (
		<div class={styles.tabletDialogContainer}>
			<div class={styles.dialogTitleContainer}>
				<LargeIconOnlyButton
					tag="button"
					type="button"
					onClick={onCancel}
					class={styles.closeButton}
				>
					<span
						class={styles.closeIcon}
						dangerouslySetInnerHTML={{ __html: close }}
					/>
				</LargeIconOnlyButton>
				<h1 class={`text-style-headline-4 ${styles.dialogTitle}`}>Filter</h1>
				<LargeButton
					variant="primary-emphasized"
					tag="button"
					type="button"
					onClick={onConfirm}
				>
					Filter results
				</LargeButton>
			</div>
			<div class={styles.filterSelectionContainer}>
				<div class={styles.filterSelection}>
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
				</div>
				<div class={styles.filterSelection}>
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
											picture={unicornProfilePicMap.find(
												(u) => u.id === author.id,
											)}
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
			</div>
		</div>
	);
};

export const FilterDialog = ({
	isOpen: isOpenProp,
	onClose,
	tags,
	authors,
	unicornProfilePicMap,
	selectedAuthorIds: selectedParentAuthorIds,
	selectedTags: selectedParentTags,
}: FilterDialogProps) => {
	/**
	 * Dialog state and ref
	 */
	const dialogRef = useRef<HTMLDialogElement>(null);

	// We can't use the open attribute because otherwise the
	// dialog is not treated as a modal
	//
	// This will be synced with the open attribute in an useEffect
	const isOpen = useRef(null);

	useEffect(() => {
		if (isOpenProp) {
			if (isOpen.current) return;
			dialogRef.current?.showModal();
		} else {
			dialogRef.current?.close();
		}
		isOpen.current = isOpenProp;
	}, [isOpenProp]);

	/**
	 * Inner state
	 */
	const [selectedTags, setSelectedTags] =
		useState<string[]>(selectedParentTags);
	const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>(
		selectedParentAuthorIds,
	);

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

	/**
	 * Confirmation handlers
	 */
	const onConfirm = useCallback((e?: MouseEvent) => {
		e && e.preventDefault();
		// True indicates that the user has confirmed the dialog
		dialogRef.current?.close("true");
	}, []);

	const onCancel = useCallback((e?: MouseEvent) => {
		e && e.preventDefault();
		// False indicates the user has cancelled the dialog
		dialogRef.current?.close("false");
	}, []);

	const onFormConfirm = useCallback(
		(e: Event) => {
			e.preventDefault();
			if (dialogRef.current.returnValue === "true") {
				onClose({
					selectedAuthorIds,
					selectedTags,
				});
				return;
			}
			onClose({
				selectedAuthorIds: selectedParentAuthorIds,
				selectedTags: selectedParentTags,
			});
		},
		[
			selectedAuthorIds,
			selectedTags,
			selectedParentAuthorIds,
			selectedParentTags,
		],
	);

	/**
	 * Styling hooks
	 */
	const windowSize = useWindowSize();

	const isMobile = windowSize.width < mobile;

	return (
		<dialog onClose={onFormConfirm} ref={dialogRef} class={styles.dialog}>
			<form style={{ height: "100%" }}>
				{isMobile ? (
					<FilterDialogMobile
						tags={tags}
						authors={authors}
						selectedTags={selectedTags}
						selectedAuthorIds={selectedAuthorIds}
						setSelectedTags={setSelectedTags}
						setSelectedAuthorIds={setSelectedAuthorIds}
						onSelectedAuthorChange={onSelectedAuthorChange}
						onTagsChange={onTagsChange}
						unicornProfilePicMap={unicornProfilePicMap}
						onConfirm={onConfirm}
						onCancel={onCancel}
					/>
				) : (
					<FilterDialogSmallTablet
						tags={tags}
						authors={authors}
						selectedTags={selectedTags}
						selectedAuthorIds={selectedAuthorIds}
						setSelectedTags={setSelectedTags}
						setSelectedAuthorIds={setSelectedAuthorIds}
						onSelectedAuthorChange={onSelectedAuthorChange}
						onTagsChange={onTagsChange}
						unicornProfilePicMap={unicornProfilePicMap}
						onConfirm={onConfirm}
						onCancel={onCancel}
					/>
				)}
			</form>
		</dialog>
	);
};
