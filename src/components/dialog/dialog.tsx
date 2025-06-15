import { PropsWithChildren } from "components/types";
import { useRef, useEffect, useCallback } from "preact/hooks";

type DialogProps = PropsWithChildren<{
	id?: string;
	open: boolean;
	dialogClass?: string;
	formClass?: string;

	// returnValue is undefined if the dialog was closed from "outside"
	// (either the `open` prop changing, or the backdrop was clicked)
	onClose?: (returnValue?: string) => void;
}>;

export function Dialog(props: DialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	// We can't use the open attribute because otherwise the
	// dialog is not treated as a modal
	//
	// This will sync `props.open` with the dialog modal state
	useEffect(() => {
		if (dialogRef.current) {
			if (props.open && !dialogRef.current.open) {
				// reset the return value when re-opening the dialog
				dialogRef.current.returnValue = "";
				dialogRef.current.showModal();
			}

			if (!props.open && dialogRef.current.open) dialogRef.current.close();
		}
	}, [dialogRef.current, props.open]);

	// When the dialog backdrop is clicked (target == <dialog>),
	// call `props.onClose(undefined)` to handle a light dismiss action
	// (only needed if the closedBy attribute is unsupported)
	const handleClick = useCallback(
		(e: Event) => {
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore Missing DOM types
			if (typeof dialogRef.current?.closedBy == "undefined") {
				if (e.target === dialogRef.current) {
					props.onClose?.call(undefined);
				}
			}
		},
		[dialogRef.current, props.onClose],
	);

	// When the dialog close event fires, call `props.onClose(v)`
	// with the dialog's return value.
	const handleClose = useCallback(() => {
		props.onClose?.call(undefined, dialogRef.current?.returnValue);
	}, [dialogRef.current, props.onClose]);

	return (
		<dialog
			id={props.id}
			onClose={handleClose}
			onClick={handleClick}
			class={props.dialogClass}
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore Yes, this exists. It's fine.
			closedby="any"
			ref={dialogRef}
		>
			<form method="dialog" class={props.formClass}>
				{props.children}
			</form>
		</dialog>
	);
}
