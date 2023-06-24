import {
	arrow,
	autoPlacement,
	FloatingArrow,
	FloatingFocusManager,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import { useRef, useState } from "preact/hooks";
import { Fragment } from "preact";
import { createPortal } from "preact/compat";
import mainStyles from "./pagination.module.scss";
import more from "src/icons/more-horizontal.svg?raw";
import { PaginationProps } from "components/pagination/types";

export function PaginationMenuAndPopover(
	props: Pick<PaginationProps, "page" | "getPageHref">
) {
	const [isOpen, setIsOpen] = useState(false);
	const arrowRef = useRef(null);

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		placement: "top",
		onOpenChange: setIsOpen,
		middleware: [
			shift(),
			arrow({
				element: arrowRef,
			}),
		],
	});

	const click = useClick(context);
	const dismiss = useDismiss(context);
	const role = useRole(context);

	const { getReferenceProps, getFloatingProps } = useInteractions([
		click,
		dismiss,
		role,
	]);

	const portal = createPortal(
		<FloatingFocusManager context={context} modal={false}>
			<div
				ref={refs.setFloating}
				style={floatingStyles as never}
				{...getFloatingProps()}
			>
				Floating element
				<FloatingArrow ref={arrowRef} context={context} />
			</div>
		</FloatingFocusManager>,
		document.querySelector("body")
	);

	return (
		<Fragment>
			<li className={`${mainStyles.paginationItem}`}>
				<button
					ref={refs.setReference}
					{...getReferenceProps()}
					className={`text-style-body-medium-bold ${mainStyles.paginationButton} ${mainStyles.paginationIconButton}`}
					dangerouslySetInnerHTML={{ __html: more }}
				/>
			</li>
			{isOpen && portal}
		</Fragment>
	);
}
