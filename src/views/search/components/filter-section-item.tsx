import { VNode } from "preact";
import { CheckboxBox } from "components/checkbox-box/checkbox-box";
import { useCheckbox, VisuallyHidden } from "react-aria";
import style from "./filter-section-item.module.scss";
import { useToggleState } from "react-stately";
import { useRef } from "preact/hooks";

interface FilterSectionItemProps {
	icon: VNode<any>;
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
	};

	const state = useToggleState(props);

	const ref = useRef(null);
	const { inputProps } = useCheckbox(props, state, ref);
	const isSelected = state.isSelected;

	return (
		<CheckboxBox
			selected={isSelected}
			wrapper={(children) => (
				<label
					class={`${style.containerLabel} ${isSelected ? style.selected : ""}`}
				>
					<span aria-hidden={true} class={style.iconContainer}>
						{icon}
					</span>
					<span class={`text-style-body-small-bold ${style.label}`}>
						{label}
					</span>
					{children}
					<VisuallyHidden>
						<input {...inputProps} ref={ref} />
					</VisuallyHidden>
				</label>
			)}
		/>
	);
};
