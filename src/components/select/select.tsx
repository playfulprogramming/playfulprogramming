import { ListState, useSelectState } from "react-stately";
import {
	AriaSelectProps,
	HiddenSelect,
	useListBox,
	useOption,
	useSelect,
} from "react-aria";
import { PropsWithChildren } from "preact/compat";
import down from "src/icons/chevron_down.svg?raw";
import { Button } from "components/button/button";
import styles from "./select.module.scss";
import checkmark from "src/icons/checkmark.svg?raw";
import { useRef } from "preact/hooks";
import { AriaListBoxOptions } from "@react-aria/listbox";
import { Node } from "@react-types/shared";
import {
	autoUpdate,
	flip,
	FloatingFocusManager,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
} from "@floating-ui/react";

export { Item, Section } from "react-stately";

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
		ref
	);

	const setRefs = (el: HTMLButtonElement) => {
		ref.current = el;
		refs.setReference(el);
	};

	const { refs, floatingStyles, context } = useFloating({
		placement: "bottom-start",
		open: state.isOpen,
		onOpenChange: state.setOpen,
		whileElementsMounted: autoUpdate,
		middleware: [flip()],
	});

	const click = useClick(context);
	const dismiss = useDismiss(context);

	const { getReferenceProps, getFloatingProps } = useInteractions([
		click,
		dismiss,
	]);

	const referenceProps = getReferenceProps();

	const mergedTriggerProps = { ...triggerProps };
	for (const key in referenceProps) {
		if (!key.startsWith("on") && triggerProps[key] && referenceProps[key]) {
			mergedTriggerProps[key] = (e: any) => {
				const one = (triggerProps[key] as (e: unknown) => boolean)(e);
				const two = (referenceProps[key] as (e: unknown) => boolean)(e);
				return one && two;
			};
			continue;
		}
		mergedTriggerProps[key] = referenceProps[key];
	}

	return (
		<>
			<HiddenSelect
				isDisabled={props.isDisabled}
				state={state}
				triggerRef={ref}
				label={props.label}
				name={props.name}
			/>
			<div {...labelProps} class={"visually-hidden"}>
				Post sort order
			</div>
			<Button
				class={`${className} ${classNameName}`}
				tag="button"
				type="button"
				ref={setRefs}
				{...mergedTriggerProps}
				rightIcon={
					<span
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
				<FloatingFocusManager context={context} modal={false}>
					{/*<Popover state={state} triggerRef={ref} placement="bottom start">*/}
					<div
						ref={refs.setFloating}
						style={floatingStyles}
						{...getFloatingProps()}
					>
						<ListBox {...menuProps} state={state} />
					</div>
					{/*</Popover>*/}
				</FloatingFocusManager>
			)}
		</>
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
		<ul {...listBoxProps} ref={listBoxRef}>
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
		ref
	);

	return (
		<li
			{...optionProps}
			ref={ref}
			class={`${styles.option} ${isSelected ? styles.selected : ""} ${
				isSelected ? styles.active : ""
			}`}
		>
			<span className={"text-style-button-regular"}>{item.rendered}</span>
			{isSelected && (
				<span
					className={styles.checkmark}
					dangerouslySetInnerHTML={{ __html: checkmark }}
				></span>
			)}
		</li>
	);
}
