import {
	AriaRadioProps,
	mergeProps,
	useFocusRing,
	useRadio,
	useRadioGroup,
	VisuallyHidden,
} from "react-aria";
import { Button } from "components/button/button";
import { createContext, PropsWithChildren, useContext } from "preact/compat";
import { useRef } from "preact/hooks";
import {
	RadioGroupProps,
	RadioGroupState,
	useRadioGroupState,
} from "react-stately";

const RadioContext = createContext<RadioGroupState | null>(null);

interface RadioButtonGroupProps extends PropsWithChildren<RadioGroupProps> {
	class?: string;
	className?: string;
	testId?: string;
}

export function RadioButtonGroup(props: RadioButtonGroupProps) {
	const {
		children,
		label,
		class: className = "",
		className: classNameName = "",
		testId,
	} = props;
	const state = useRadioGroupState(props);
	const { radioGroupProps, labelProps } = useRadioGroup(props, state);

	return (
		<div
			{...radioGroupProps}
			class={`${className} ${classNameName}`}
			data-testid={testId}
		>
			<VisuallyHidden>
				<span {...labelProps}>{label}</span>
			</VisuallyHidden>
			<RadioContext.Provider value={state}>{children}</RadioContext.Provider>
		</div>
	);
}

export function RadioButton(props: AriaRadioProps) {
	const { children } = props;
	const state = useContext(RadioContext);
	if (!state) {
		throw new Error(
			"<RadioButton> must only be used within a <RadioButtonGroup>!",
		);
	}

	const ref = useRef(null);
	const { inputProps, isSelected } = useRadio(props, state, ref);
	const { isFocusVisible, focusProps } = useFocusRing();

	const mergedProps = mergeProps(inputProps, focusProps);

	return (
		<label>
			<VisuallyHidden>
				<input {...mergedProps} ref={ref} />
			</VisuallyHidden>
			<Button
				tag="div"
				variant={isSelected ? "primary-emphasized" : "primary"}
				isFocusVisible={isFocusVisible}
			>
				{children}
			</Button>
		</label>
	);
}
