import style from "./checkbox-box.module.scss";
import { VNode } from "preact";
import checkmark from "src/icons/checkmark.svg?raw";
import dot from "src/icons/dot.svg?raw";

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
				<div class={style.outerContainer} aria-hidden={true}>
					<div
						className={`${style.boxContainer} ${
							disabled ? style.disabled : ""
						} ${selected ? style.checked : ""}`}
					>
						<div
							class={style.checkmark}
							dangerouslySetInnerHTML={{ __html: selected ? checkmark : "" }}
						/>
						<div
							className={style.dot}
							dangerouslySetInnerHTML={{ __html: dot }}
						/>
					</div>
				</div>,
			)}
		</div>
	);
};
