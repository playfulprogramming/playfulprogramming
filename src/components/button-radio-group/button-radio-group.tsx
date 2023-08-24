import {
	AriaRadioProps,
	mergeProps,
	useFocusRing,
	useRadio,
	useRadioGroup,
	VisuallyHidden,
} from "react-aria";
import { Button } from "components/button/button";
import {
	ChangeEvent,
	createContext,
	PropsWithChildren,
	useContext,
} from "preact/compat";
import { useLayoutEffect, useMemo, useRef } from "preact/hooks";
import {
	RadioGroupProps,
	RadioGroupState,
	useRadioGroupState,
} from "react-stately";

const RadioContext = createContext<RadioGroupState>(null);

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
		value,
		onChange,
		...rest
	} = props;
	const _state = useRadioGroupState(rest);

	/**
	 * Remove this when the following is fixed:
	 * https://github.com/adobe/react-spectrum/issues/4971
	 */
	const state = useMemo(() => {
		return Object.assign({}, _state, {
			setSelectedValue: (value: string) => {
				_state.setSelectedValue(value);
				onChange(value);
			},
		});
	}, [_state]);

	const { radioGroupProps, labelProps } = useRadioGroup(props, state);

	useLayoutEffect(() => {
		_state.setSelectedValue(value);
	}, [value, _state]);

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
	const ref = useRef(null);
	const { inputProps, isSelected } = useRadio(props, state, ref);
	const { isFocusVisible, focusProps } = useFocusRing();

	const mergedProps = mergeProps(inputProps, focusProps, {
		onChange: (e: ChangeEvent) => {
			e.preventDefault();
		},
		onClick: (e: MouseEvent) => {
			setTimeout(() => {
				if (e.defaultPrevented) return;
				state.setSelectedValue(props.value);
			}, 0);
		},
	});

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
