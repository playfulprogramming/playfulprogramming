import { useCallback, useEffect, useRef } from "preact/hooks";
import styles from "./filter-dialog.module.scss";

interface FilterDialogProps {
	isOpen: boolean;
	onClose: (val: string) => void;
}

export const FilterDialog = ({
	isOpen: isOpenProp,
	onClose,
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

	return (
		<dialog onClose={onFormConfirm} ref={dialogRef} class={styles.dialog}>
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
