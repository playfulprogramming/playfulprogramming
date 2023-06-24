import { useClick, useFloating, useInteractions } from "@floating-ui/react";
import { useState } from "preact/hooks";
import { Fragment } from "preact";
import { createPortal } from "preact/compat";

export function PaginationPopover() {
	const [isOpen, setIsOpen] = useState(false);

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
	});

	const click = useClick(context);

	const { getReferenceProps, getFloatingProps } = useInteractions([click]);

	const portal = createPortal(
		<div
			ref={refs.setFloating}
			style={floatingStyles as never}
			{...getFloatingProps()}
		>
			Floating element
		</div>,
		document.querySelector("body")
	);

	return (
		<Fragment>
			<div ref={refs.setReference} {...getReferenceProps()}>
				Reference element
			</div>
			{isOpen && portal}
		</Fragment>
	);
}
