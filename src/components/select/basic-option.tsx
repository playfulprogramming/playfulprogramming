import { ComponentChildren } from "preact";
import styles from "./select.module.scss";

interface OptionProps {
	text: ComponentChildren;
	isSelected?: boolean;
	icon: ComponentChildren;
}

export function Option({ text, isSelected = false, icon }: OptionProps) {
	console.log("isSelected: ", isSelected);

	return (
		<li class={`${styles.option} ${isSelected ? styles.selected : ""}`}>
			<span class={`text-style-button-regular ${styles.optionText}`}>
				{text}
			</span>
			<span className={styles.checkmark}>{icon}</span>
		</li>
	);
}
