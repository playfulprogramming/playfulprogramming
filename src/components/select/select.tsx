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
	useButton,
	useFocusVisible,
	useFocusRing,
} from "react-aria";
import { PropsWithChildren } from "preact/compat";
import down from "src/icons/chevron_down.svg?raw";
import { Button } from "components/button/button";
import styles from "./select.module.scss";
import checkmark from "src/icons/checkmark.svg?raw";
import { useRef } from "preact/hooks";
import { Node } from "@react-types/shared";
import { useReactAriaScrollGutterHack } from "src/hooks/useReactAriaScrollGutterHack";

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

	// bandaid solution for layout shift
	useReactAriaScrollGutterHack();

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
	defaultValue: string;
	prefixSelected: string;
	testId?: string;
}

export function SelectWithLabel<T extends object>({
	class: className = "",
	className: classNameName = "",
	defaultValue,
	prefixSelected = "",
	testId,
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
	const { isFocusVisible, focusProps } = useFocusRing();

	const { buttonProps } = useButton(triggerProps, ref);

	// fix: ids passed to aria-labelledby are in the reverse order: https://github.com/unicorn-utterances/unicorn-utterances/issues/805
	buttonProps["aria-labelledby"] = buttonProps["aria-labelledby"]
		.split(" ")
		.reverse()
		.join(" ");

	return (
		<div
			data-testid={testId}
			className={`${className} ${classNameName} ${styles.selectedWithLabel}`}
		>
			<div
				{...labelProps}
				className={`text-style-button-regular ${styles.visibleLabel}`}
			>
				{props.label}
			</div>
			<HiddenSelect
				isDisabled={props.isDisabled}
				state={state}
				triggerRef={ref}
				label={props.label}
				name={props.name}
			/>
			<Button
				class={state.isOpen ? "" : styles.transparentBackground}
				tag="button"
				type="button"
				variant={"primary"}
				isFocusVisible={isFocusVisible}
				ref={ref}
				{...buttonProps}
				{...focusProps}
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
					{prefixSelected}
					{state.selectedItem ? state.selectedItem.rendered : defaultValue}
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

export function Select<T extends object>({
	class: className = "",
	className: classNameName = "",
	defaultValue,
	prefixSelected = "",
	testId,
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

	const { buttonProps } = useButton(triggerProps, ref);

	return (
		<div
			data-testid={testId}
			class={`${className} ${classNameName}`}
			style={{ display: "inline-block" }}
		>
			<div {...labelProps} class={"visually-hidden"}>
				{props.label}
			</div>
			<HiddenSelect
				isDisabled={props.isDisabled}
				state={state}
				triggerRef={ref}
				label={props.label}
				name={props.name}
			/>
			<Button
				tag="button"
				type="button"
				variant={state.isOpen ? "primary-emphasized" : "primary"}
				ref={ref}
				{...buttonProps}
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
					{prefixSelected}
					{state.selectedItem ? state.selectedItem.rendered : defaultValue}
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

	// As this is inside a portal (within <Popover>), nothing from Preact's useId can be trusted
	// ...but nothing should be using these IDs anyway.
	Object.assign(listBoxProps, {
		["id"]: undefined,
		["aria-labelledby"]: undefined,
	});

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
	const { optionProps, isDisabled, isSelected, isFocusVisible } = useOption(
		{
			key: item.key,
		},
		state,
		ref,
	);

	// As this is inside a portal (within <Popover>), nothing from Preact's useId can be trusted
	// ...but nothing should be using these IDs anyway.
	Object.assign(optionProps, {
		["aria-labelledby"]: undefined,
		["aria-describedby"]: undefined,
	});

	return (
		<li
			{...optionProps}
			ref={ref}
			class={`${styles.option} ${isSelected ? styles.selected : ""}`}
			data-focus-visible={isFocusVisible}
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
