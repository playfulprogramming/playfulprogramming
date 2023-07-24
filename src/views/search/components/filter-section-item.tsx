import { VNode } from "preact";
import { CheckboxBox } from "components/checkbox-box/checkbox-box";
import { VisuallyHidden } from "react-aria";
import style from "./filter-section-item.module.scss";

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
	return (
		<CheckboxBox
			selected={selected}
			wrapper={(children) => (
				<label
					class={`${style.containerLabel} ${selected ? style.selected : ""}`}
				>
					<span aria-hidden={true} class={style.iconContainer}>
						{icon}
					</span>
					<span class={`text-style-body-small-bold ${style.label}`}>
						{label}
					</span>
					{children}
					<VisuallyHidden>
						<input
							type="checkbox"
							onChange={(e) => onChange()}
							checked={selected}
						/>
					</VisuallyHidden>
				</label>
			)}
		/>
	);
};
