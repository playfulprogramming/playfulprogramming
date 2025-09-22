import {
	AriaRadioProps,
	mergeProps,
	useFocusRing,
	useRadio,
	VisuallyHidden,
} from "react-aria";
import { useContext } from "preact/compat";
import { useRef } from "preact/hooks";
import style from "./button-radio-list.module.scss";
import { RadioContext } from "./common";
import { JSXNode } from "components/types";

interface RadioListButtonProps extends AriaRadioProps {
	leftIcon?: JSXNode;
	rightIcon?: JSXNode;
}

export function RadioListButton({
	leftIcon,
	rightIcon,
	...props
}: RadioListButtonProps) {
	const state = useContext(RadioContext);
	if (!state) {
		throw new Error(
			"<RadioListButton> must only be used within a <RadioButtonGroup>!",
		);
	}

	const ref = useRef(null);
	const { inputProps, isSelected } = useRadio(props, state, ref);
	const { isFocusVisible, focusProps } = useFocusRing();

	const mergedProps = mergeProps(inputProps, focusProps);

	return (
		<label
			class={`${style.radioListButton} text-style-button-regular`}
			data-selected={isSelected}
			data-focus-visible={isFocusVisible}
		>
			<VisuallyHidden>
				<input {...mergedProps} ref={ref} />
			</VisuallyHidden>
			{leftIcon && (
				<div class={style.leftIcon} aria-hidden>
					{leftIcon}
				</div>
			)}
			{props.children}
			{rightIcon && (
				<div class={style.rightIcon} aria-hidden>
					{rightIcon}
				</div>
			)}
		</label>
	);
}
