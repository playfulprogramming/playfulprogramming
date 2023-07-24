import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import styles from "./filter-dialog.module.scss";
import { UnicornInfo } from "types/UnicornInfo";
import { useWindowSize } from "../../../hooks/use-window-size";
import { mobile } from "../../../tokens/breakpoints";
import { FilterSection } from "./filter-section";

interface FilterDialogProps {
	isOpen: boolean;
	onClose: (val: string) => void;
	tags: string[];
	authors: UnicornInfo[];
	setSelectedTags: (tags: string[]) => void;
	setSelectedAuthorIds: (authors: string[]) => void;
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
}: FilterDialogInner) => {
	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<FilterSection
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
	setSelectedTags: setParentSelectedTags,
	setSelectedAuthorIds: setParentSelectedAuthorIds,
}: FilterDialogProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null);
	/**
	 * We can't use the open attribute because otherwise the
	 * dialog is not treated as a modal
	 */
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

	const onConfirm = useCallback((e: MouseEvent) => {
		e.preventDefault();
		dialogRef.current?.close("CONFIRMED THIS IS GOOD");
	}, []);

	const onFormConfirm = useCallback((e: Event) => {
		e.preventDefault();
		onClose(dialogRef.current.returnValue);
	}, []);

	const [selectedTags, setSelectedTags] = useState<string[]>(tags);
	const [selectedAuthorIds, setSelectedAuthorIds] = useState<string[]>(
		authors.map((author) => author.id)
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

	const windowSize = useWindowSize();

	const isMobile = windowSize.width < mobile;

	return (
		<dialog onClose={onFormConfirm} ref={dialogRef} class={styles.dialog}>
			<form style={{height: '100%'}}>
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
					/>
				)}
				<button value="cancel" formMethod="dialog">
					Cancel
				</button>
				<button onClick={onConfirm}>Confirm</button>
			</form>
		</dialog>
	);
};
