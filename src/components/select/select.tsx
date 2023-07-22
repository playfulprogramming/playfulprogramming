/**
 * TODO: Migrate this to be controlled at some point. Right now, it's uncontrolled
 */
import {
	autoUpdate,
	flip,
	useFloating,
	useInteractions,
	useListNavigation,
	useTypeahead,
	useClick,
	useListItem,
	useDismiss,
	useRole,
	FloatingFocusManager,
	FloatingList,
} from "@floating-ui/react";
import { createContext } from "preact";
import { PropsWithChildren, useContext } from "preact/compat";
import { useCallback, useMemo, useRef, useState } from "preact/hooks";
import down from "src/icons/chevron_down.svg?raw";
import { Button } from "components/button/button";
import styles from "./select.module.scss";

interface SelectContextValue {
	activeIndex: number | null;
	selectedIndex: number | null;
	getItemProps: ReturnType<typeof useInteractions>["getItemProps"];
	handleSelect: (index: number | null) => void;
}

const SelectContext = createContext<SelectContextValue>(
	{} as SelectContextValue
);

const rightIcon = (
	<span
		className={styles.downSpan}
		dangerouslySetInnerHTML={{ __html: down }}
	></span>
);

interface SelectProps {
	initial?: {
		selectedIndex: number;
		selectedLabel: string;
	};
	class?: string;
	className?: string;
	onChangeVal: (val: string) => void;
}

export function Select({
	children,
	initial,
	class: className = "",
	className: classNameName = "",
	onChangeVal,
}: PropsWithChildren<SelectProps>) {
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(
		initial?.selectedIndex ?? null
	);
	const [selectedLabel, setSelectedLabel] = useState<string | null>(
		initial?.selectedLabel ?? null
	);

	const { refs, floatingStyles, context } = useFloating({
		placement: "bottom",
		open: isOpen,
		onOpenChange: setIsOpen,
		whileElementsMounted: autoUpdate,
		middleware: [flip()],
	});

	const elementsRef = useRef<Array<HTMLElement | null>>([]);
	const labelsRef = useRef<Array<string | null>>([]);

	const handleSelect = useCallback((index: number | null) => {
		setSelectedIndex(index);
		setIsOpen(false);
		if (index !== null) {
			const newLabel = labelsRef.current[index];
			setSelectedLabel(newLabel);
			onChangeVal(newLabel);
		}
	}, []);

	function handleTypeaheadMatch(index: number | null) {
		if (isOpen) {
			setActiveIndex(index);
		} else {
			handleSelect(index);
		}
	}

	const listNav = useListNavigation(context, {
		listRef: elementsRef,
		activeIndex,
		selectedIndex,
		onNavigate: setActiveIndex,
	});
	const typeahead = useTypeahead(context, {
		listRef: labelsRef,
		activeIndex,
		selectedIndex,
		onMatch: handleTypeaheadMatch,
	});
	const click = useClick(context);
	const dismiss = useDismiss(context);
	const role = useRole(context, { role: "listbox" });

	const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
		[listNav, typeahead, click, dismiss, role]
	);

	const selectContext = useMemo(
		() => ({
			activeIndex,
			selectedIndex,
			getItemProps,
			handleSelect,
		}),
		[activeIndex, selectedIndex, getItemProps, handleSelect]
	);

	return (
		<>
			<Button
				class={`${className} ${classNameName}`}
				tag="button"
				type="button"
				ref={refs.setReference}
				{...getReferenceProps()}
				rightIcon={rightIcon}
			>
				{selectedLabel ?? "Select..."}
			</Button>

			<SelectContext.Provider value={selectContext}>
				{isOpen && (
					<FloatingFocusManager context={context} modal={false}>
						<div
							ref={refs.setFloating}
							style={floatingStyles}
							class={styles.selectDropdown}
							{...getFloatingProps()}
						>
							<FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
								{children}
							</FloatingList>
						</div>
					</FloatingFocusManager>
				)}
			</SelectContext.Provider>
		</>
	);
}

export function Option({ label }: { label: string }) {
	const { activeIndex, selectedIndex, getItemProps, handleSelect } =
		useContext(SelectContext);

	const { ref, index } = useListItem({ label });

	const isActive = activeIndex === index;
	const isSelected = selectedIndex === index;

	return (
		<button
			ref={ref}
			role="option"
			aria-selected={isActive && isSelected}
			tabIndex={isActive ? 0 : -1}
			style={{
				background: isActive ? "cyan" : "",
				fontWeight: isSelected ? "bold" : "",
			}}
			{...getItemProps({
				onClick: () => handleSelect(index),
			})}
		>
			{label}
		</button>
	);
}
