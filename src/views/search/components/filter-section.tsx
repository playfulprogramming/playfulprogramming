import { PropsWithChildren } from "components/types";
import { useState, useRef } from "preact/hooks";
import { useElementSize } from "../../../hooks/use-element-size";
import styles from "./filter-section.module.scss";
import { Chip } from "components/chip/chip";
import { HTMLAttributes } from "preact/compat";

interface FilterSectionProps extends HTMLAttributes<HTMLDivElement> {
	title: string;
	selectedNumber: number;
	onClear: () => void;
	class?: string;
	className?: string;
}

export const FilterSection = ({
	title,
	children,
	selectedNumber,
	onClear,
	class: className = "",
	className: classNameName = "",
	...props
}: PropsWithChildren<FilterSectionProps>) => {
	const [collapsed, setCollapsed] = useState(false);

	const { setEl, size } = useElementSize();

	const onScroll = (e: Event) => {
		const target = e.target as HTMLElement;
		const scrollAmount = target.scrollTop;
		if (scrollAmount > 0) {
			target.classList.add("scrolled");
			return;
		}
		target.classList.remove("scrolled");
	};

	// When cleared, the focus needs to be passed to the heading button
	// to avoid resetting to <body> when the clear button is removed from the DOM.
	// https://github.com/unicorn-utterances/unicorn-utterances/issues/742
	const buttonRef = useRef();
	const handleClear = (e: Event) => {
		onClear();
		buttonRef.current?.focus();
	};

	return (
		<div
			{...props}
			className={`${styles.section} ${
				collapsed ? "" : styles.sectionExpanded
			} ${className} ${classNameName}`}
		>
			<div className={styles.sectionHeader}>
				<button
					type="button"
					className={styles.sectionTitle}
					style={{
						paddingRight: size?.width,
					}}
					aria-expanded={!collapsed}
					onClick={() => setCollapsed(!collapsed)}
					ref={buttonRef}
				>
					<span
						className={`${styles.collapseIcon} ${
							collapsed ? styles.collapsed : ""
						}`}
					/>
					<span
						className={`text-style-button-regular ${styles.sectionTitleText}`}
					>
						{title}
					</span>
					<span
						className={`text-style-button-regular ${styles.sectionNumberText}`}
					>
						{selectedNumber ? `(${selectedNumber})` : null}
					</span>
				</button>
				{!!selectedNumber && (
					<div className={styles.clearContainer} ref={setEl}>
						<Chip
							tag="button"
							type="button"
							className={styles.clearChip}
							onClick={handleClear}
						>
							Clear
						</Chip>
					</div>
				)}
			</div>
			<div
				className={styles.sectionContent}
				aria-hidden={collapsed}
				onScroll={onScroll}
				inert={collapsed}
			>
				{children}
			</div>
		</div>
	);
};
