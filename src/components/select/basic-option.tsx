import { ComponentChildren } from "preact";
import styles from "./select.module.scss";

interface OptionProps {
	children: ComponentChildren;
	isSelected?: boolean;
}

export function Option({ children, isSelected }: OptionProps) {
	return (
		<li class={`${styles.option} ${isSelected ? styles.selected : ""}`}>
			{children}
		</li>
	);
}
