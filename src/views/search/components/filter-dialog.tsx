import { useCallback, useRef } from "preact/hooks";

interface FilterDialogProps {
	isOpen: boolean;
	onClose: (val: string) => void;
}

export const FilterDialog = ({ isOpen, onClose }: FilterDialogProps) => {
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
		<dialog
			open={isOpen}
			onClose={onFormConfirm}
			ref={dialogRef}
			style={{ background: "white", zIndex: 1 }}
		>
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
