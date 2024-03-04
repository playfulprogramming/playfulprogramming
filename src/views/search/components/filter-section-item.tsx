import { VNode } from "preact";
import { CheckboxBox } from "components/checkbox-box/checkbox-box";
import { useCheckbox, useFocusRing, VisuallyHidden } from "react-aria";
import style from "./filter-section-item.module.scss";
import { useToggleState } from "react-stately";
import { useEffect, useRef } from "preact/hooks";

interface FilterSectionItemProps {
	icon: VNode<unknown>;
	label: string;
	count: number;
	selected: boolean;
	onChange: () => void;
}

export const FilterSectionItem = ({
	icon,
	label,
	count,
	selected,
	onChange,
}: FilterSectionItemProps) => {
	const props = {
		isSelected: selected,
		onChange: onChange,
		"aria-label": label,
	};

	const state = useToggleState(props);

	const ref = useRef(null);
	const labelRef = useRef<HTMLLabelElement>(null);

	const { inputProps, labelProps } = useCheckbox(props, state, ref);
	const { isFocusVisible, focusProps } = useFocusRing();
	const isSelected = state.isSelected;

	useEffect(() => {
		// this does not happen automatically, so we need to manually scroll to the focused item
		if (
			isFocusVisible &&
			labelRef.current &&
			typeof labelRef.current.scrollIntoView !== "undefined"
		)
			labelRef.current.scrollIntoView({ block: "nearest" });
	}, [isFocusVisible]);

	return (
		<li>
			<CheckboxBox
				selected={isSelected}
				wrapper={(children) => (
					<label
						{...labelProps}
						ref={labelRef}
						class={`${style.containerLabel} ${
							isSelected ? style.selected : ""
						}`}
						data-focus-visible={isFocusVisible}
					>
						<span aria-hidden={true} class={style.iconContainer}>
							{icon}
						</span>
						<span className={`text-style-body-small-bold ${style.label}`}>
							{label}
						</span>
						<span
							className={`text-style-body-small-bold ${style.count}`}
							aria-label={`${count} post${count > 1 ? "s" : ""}`}
						>
							<span className="visually-hidden"> - </span>
							{count}
							<span className="visually-hidden"> articles</span>
						</span>
						{children}
						<VisuallyHidden>
							<input {...inputProps} {...focusProps} ref={ref} />
						</VisuallyHidden>
					</label>
				)}
			/>
		</li>
	);
};
