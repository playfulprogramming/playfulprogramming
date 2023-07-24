import style from "./checkbox-box.module.scss";
import { VNode } from "preact";

/**
 * This is the visuals of a checkbox, not the actual input.
 *
 * You are intended to use this component with a visually hidden checkbox <input/> and a visually shown wrapper <label>.
 */
interface CheckboxBoxProps {
	selected: boolean;
	disabled?: boolean;
	wrapper: (children: VNode) => VNode;
}

export const CheckboxBox = ({
	selected,
	disabled,
	wrapper,
}: CheckboxBoxProps) => {
	return (
		<div class={style.container}>
			{wrapper(
				<div class={style.outerContainer}>
					<div
						class={`${style.boxContainer} ${disabled ? style.disabled : ""} ${
							selected ? style.checked : ""
						}`}
					>
						{selected ? "✓" : "x"}
					</div>
				</div>,
			)}
		</div>
	);
};
