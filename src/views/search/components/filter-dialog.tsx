import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import styles from "./filter-dialog.module.scss";
import { useWindowSize } from "../../../hooks/use-window-size";
import { mobile } from "../../../tokens/breakpoints";
import { FilterSection } from "./filter-section";
import { ExtendedTag, ExtendedUnicorn } from "./types";
import { Button, LargeButton } from "components/button/button";
import { FilterSectionItem } from "./filter-section-item";
import { Picture as UUPicture } from "components/image/picture";
import { ProfilePictureMap } from "utils/get-unicorn-profile-pic-map";
import { DEFAULT_TAG_EMOJI } from "./constants";

interface FilterDialogProps {
	isOpen: boolean;
	onClose: (val: string) => void;
	tags: ExtendedTag[];
	authors: ExtendedUnicorn[];
	setSelectedTags: (tags: string[]) => void;
	setSelectedAuthorIds: (authors: string[]) => void;
	unicornProfilePicMap: ProfilePictureMap;
}

interface FilterDialogInner extends Omit<FilterDialogProps, "isOpen"> {
	selectedTags: string[];
	selectedAuthorIds: string[];
	onSelectedAuthorChange: (id: string) => void;
	onTagsChange: (id: string) => void;
}

const FilterDialogMobile = ({
	onClose,
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
				<h1 class={`text-style-headline-4 ${styles.dialogTitle}`}>
					Headline 4
				</h1>
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
					type="submit"
					variant="primary"
					value="cancel"
					formMethod="dialog"
				>
					Cancel
				</LargeButton>
				<LargeButton
					class={styles.mobileButton}
					type="submit"
					variant="primary-emphasized"
					onClick={() => {}}
				>
					Filter
				</LargeButton>
			</div>
		</div>
	);
};

const FilterDialogSmallTablet = ({
	onClose,
	tags,
	authors,
	setSelectedTags,
	setSelectedAuthorIds,
	onSelectedAuthorChange,
	onTagsChange,
	selectedTags,
	selectedAuthorIds,
}: FilterDialogInner) => {
	return <div>Tablet</div>;
};

export const FilterDialog = ({
	isOpen: isOpenProp,
	onClose,
	tags,
	authors,
	unicornProfilePicMap,
	setSelectedTags: setParentSelectedTags,
	setSelectedAuthorIds: setParentSelectedAuthorIds,
}: FilterDialogProps) => {
	/**
	 * Dialog state and ref
	 */
	const dialogRef = useRef<HTMLDialogElement>(null);

	// We can't use the open attribute because otherwise the
	// dialog is not treated as a modal
	const isOpen = useRef(isOpenProp);

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
	 * Confirmation handlers
	 */
	const onConfirm = useCallback((e: MouseEvent) => {
		e.preventDefault();
		dialogRef.current?.close("CONFIRMED THIS IS GOOD");
	}, []);

	const onFormConfirm = useCallback((e: Event) => {
		e.preventDefault();
		onClose(dialogRef.current.returnValue);
	}, []);

	/**
	 * Inner state
	 */
	const [selectedTags, setSelectedTags] = useState<string[]>(
		tags.map((tag) => tag.tag),
	);
	const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>(
		authors.map((author) => author.id),
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
	 * Styling hooks
	 */
	const windowSize = useWindowSize();

	const isMobile = windowSize.width < mobile;

	return (
		<dialog onClose={onFormConfirm} ref={dialogRef} class={styles.dialog}>
			<form style={{ height: "100%" }}>
				{isMobile ? (
					<FilterDialogMobile
						onClose={onClose}
						tags={tags}
						authors={authors}
						selectedTags={selectedTags}
						selectedAuthorIds={selectedAuthorIds}
						setSelectedTags={setSelectedTags}
						setSelectedAuthorIds={setSelectedAuthorIds}
						onSelectedAuthorChange={onSelectedAuthorChange}
						onTagsChange={onTagsChange}
						unicornProfilePicMap={unicornProfilePicMap}
					/>
				) : (
					<FilterDialogSmallTablet
						onClose={onClose}
						tags={tags}
						authors={authors}
						selectedTags={selectedTags}
						selectedAuthorIds={selectedAuthorIds}
						setSelectedTags={setSelectedTags}
						setSelectedAuthorIds={setSelectedAuthorIds}
						onSelectedAuthorChange={onSelectedAuthorChange}
						onTagsChange={onTagsChange}
						unicornProfilePicMap={unicornProfilePicMap}
					/>
				)}
			</form>
		</dialog>
	);
};
