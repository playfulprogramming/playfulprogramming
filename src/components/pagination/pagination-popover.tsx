import {
	arrow,
	FloatingArrow,
	FloatingFocusManager,
	offset,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import { useRef, useState } from "preact/hooks";
import { Fragment } from "preact";
import { createPortal, StateUpdater } from "preact/compat";
import mainStyles from "./pagination.module.scss";
import more from "src/icons/more_horiz.svg?raw";
import { PaginationProps } from "components/pagination/types";
import style from "./pagination-popover.module.scss";
import { Button, IconOnlyButton } from "components/button/button";
import subtract from "../../icons/subtract.svg?raw";
import add from "../../icons/add.svg?raw";
import { Input } from "components/input/input";

function PopupContents(
	props: Pick<PaginationProps, "page" | "getPageHref" | "softNavigate"> & {
		setIsOpen: StateUpdater<boolean>;
	}
) {
	const [count, setCount] = useState(props.page.currentPage);
	return (
		<form
			data-testid="pagination-popup"
			class={style.popupInner}
			onSubmit={(e) => {
				e.preventDefault();
				if (props.softNavigate) {
					props.softNavigate(props.getPageHref(count));
					props.setIsOpen(false);
					return;
				}
				location.href = props.getPageHref(count);
			}}
		>
			<div class={style.popupTopArea}>
				<IconOnlyButton
					data-testid="pagination-popup-decrement"
					type="button"
					tag="button"
					onClick={() => setCount((v) => v - 1)}
					disabled={count <= 1}
					class={style.iconButton}
				>
					<div
						class={style.buttonContainer}
						dangerouslySetInnerHTML={{ __html: subtract }}
					/>
				</IconOnlyButton>
				<Input
					data-testid="pagination-popup-input"
					class={style.popupInput}
					value={count}
					onChange={(e) => {
						const newVal = (e.target as HTMLInputElement).valueAsNumber;
						if (newVal > props.page.lastPage) {
							setCount(props.page.lastPage);
						} else if (newVal < 1) {
							setCount(1);
						} else if (newVal) {
							setCount(newVal);
						}
					}}
					type="number"
				/>
				<IconOnlyButton
					data-testid="pagination-popup-increment"
					type="button"
					tag="button"
					onClick={() => setCount((v) => v + 1)}
					disabled={count >= props.page.lastPage}
					class={style.iconButton}
				>
					<div
						class={style.buttonContainer}
						dangerouslySetInnerHTML={{ __html: add }}
					/>
				</IconOnlyButton>
			</div>
			<Button
				data-testid="pagination-popup-submit"
				tag="button"
				type="submit"
				variant="primary"
			>
				Go to page
			</Button>
		</form>
	);
}

export function PaginationMenuAndPopover(
	props: Pick<PaginationProps, "page" | "getPageHref" | "softNavigate">
) {
	const [isOpen, setIsOpen] = useState(false);
	const arrowRef = useRef(null);

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		placement: "top",
		onOpenChange: setIsOpen,
		middleware: [
			offset(32 - 14 / 2),
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
		<FloatingFocusManager
			context={context}
			order={["floating", "content"]}
			modal={false}
			returnFocus={false}
		>
			<div
				ref={refs.setFloating}
				style={floatingStyles as never}
				{...getFloatingProps()}
				class={style.popup}
			>
				<PopupContents {...props} setIsOpen={setIsOpen} />
				<FloatingArrow
					ref={arrowRef}
					context={context}
					height={14}
					width={24}
					stroke={"var(--page-popup_border-color)"}
					strokeWidth={2}
					tipRadius={1.5}
				/>
			</div>
		</FloatingFocusManager>,
		document.querySelector("body")
	);

	return (
		<Fragment>
			<li className={`${mainStyles.paginationItem}`}>
				<button
					data-testid="pagination-menu"
					ref={refs.setReference}
					{...getReferenceProps()}
					aria-selected={isOpen}
					className={`text-style-body-medium-bold ${mainStyles.extendPageButton} ${mainStyles.paginationButton} ${mainStyles.paginationIconButton}`}
					dangerouslySetInnerHTML={{ __html: more }}
				/>
			</li>
			{isOpen && portal}
		</Fragment>
	);
}
