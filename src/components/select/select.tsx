import { ListState, OverlayTriggerState, useSelectState } from "react-stately";
import {
	AriaSelectProps,
	HiddenSelect,
	useListBox,
	useOption,
	useSelect,
	AriaListBoxOptions,
	DismissButton,
	Overlay,
	usePopover,
	AriaPopoverProps,
} from "react-aria";
import { PropsWithChildren } from "preact/compat";
import down from "src/icons/chevron_down.svg?raw";
import { Button } from "components/button/button";
import styles from "./select.module.scss";
import checkmark from "src/icons/checkmark.svg?raw";
import { useRef } from "preact/hooks";
import { Node } from "@react-types/shared";

export { Item, Section } from "react-stately";

interface PopoverProps extends Omit<AriaPopoverProps, "popoverRef"> {
	state: OverlayTriggerState;
}

function Popover({
	children,
	state,
	...props
}: PropsWithChildren<PopoverProps>) {
	const popoverRef = useRef(null);
	const { popoverProps, underlayProps } = usePopover(
		{
			...props,
			offset: 8,
			popoverRef,
		},
		state,
	);

	return (
		<Overlay>
			<div {...underlayProps} className={styles.underlay} />
			<div {...popoverProps} ref={popoverRef}>
				<DismissButton onDismiss={state.close} />
				{children}
				<DismissButton onDismiss={state.close} />
			</div>
		</Overlay>
	);
}

interface SelectProps<T extends object> extends AriaSelectProps<T> {
	class?: string;
	className?: string;
}

export function Select<T extends object>({
	class: className = "",
	className: classNameName = "",
	...props
}: PropsWithChildren<SelectProps<T>>) {
	const state = useSelectState(props);

	// Get props for child elements from useSelect
	const ref = useRef(null);
	const { labelProps, triggerProps, valueProps, menuProps } = useSelect(
		props,
		state,
		ref,
	);

	return (
		<div style={{ display: "inline-block" }}>
			<div {...labelProps} class={"visually-hidden"}>
				Post sort order
			</div>
			<HiddenSelect
				isDisabled={props.isDisabled}
				state={state}
				triggerRef={ref}
				label={props.label}
				name={props.name}
			/>
			{/* onPress and onPressStart isn't working for Preact */}
			<Button
				class={`${className} ${classNameName}`}
				tag="button"
				type="button"
				variant={state.isOpen ? "primary-emphasized" : "primary"}
				ref={ref}
				onMouseDown={triggerProps.onPressStart as never}
				onClick={triggerProps.onPress as never}
				{...triggerProps}
				rightIcon={
					<span
						style={{
							transform: state.isOpen ? "rotate(-180deg)" : "rotate(0deg)",
						}}
						className={styles.downSpan}
						dangerouslySetInnerHTML={{ __html: down }}
					></span>
				}
			>
				<span {...valueProps}>
					{state.selectedItem
						? state.selectedItem.rendered
						: "Select an option"}
				</span>
			</Button>

			{state.isOpen && (
				<Popover state={state} triggerRef={ref} placement="bottom end">
					<ListBox {...menuProps} state={state} />
				</Popover>
			)}
		</div>
	);
}

interface ListBoxProps extends AriaListBoxOptions<unknown> {
	listBoxRef?: React.RefObject<HTMLUListElement>;
	state: ListState<unknown>;
}

function ListBox(props: ListBoxProps) {
	const ref = useRef<HTMLUListElement>(null);
	const { listBoxRef = ref, state } = props;
	const { listBoxProps } = useListBox(props, state, listBoxRef);

	return (
		<ul {...listBoxProps} ref={listBoxRef} class={styles.optionsList}>
			{[...state.collection].map((item) => (
				<Option key={item.key} item={item} state={state} />
			))}
		</ul>
	);
}

interface OptionProps {
	item: Node<unknown>;
	state: ListState<unknown>;
}

export function Option({ item, state }: OptionProps) {
	const ref = useRef<HTMLLIElement>(null);
	const { optionProps, isDisabled, isSelected, isFocused } = useOption(
		{
			key: item.key,
		},
		state,
		ref,
	);

	return (
		<li
			{...optionProps}
			ref={ref}
			class={`${styles.option} ${isSelected ? styles.selected : ""}`}
		>
			<span className={`text-style-button-regular ${styles.optionText}`}>
				{item.rendered}
			</span>
			{isSelected && (
				<span
					className={styles.checkmark}
					dangerouslySetInnerHTML={{ __html: checkmark }}
				></span>
			)}
		</li>
	);
}