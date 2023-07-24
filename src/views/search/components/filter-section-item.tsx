import { VNode } from "preact";

interface FilterSectionItemProps {
	icon: VNode<any>;
	label: string;
	count: string;
	selected: boolean;
	onClick: () => void;
}

export const FilterSectionItem = ({
	icon,
	label,
	count,
	selected,
	onClick,
}: FilterSectionItemProps) => {
	return null;
};
