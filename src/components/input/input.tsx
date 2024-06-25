import style from "./input.module.scss";
import { ComponentProps, ComponentType, Fragment, JSX } from "preact";
import search from "../../icons/search.svg?raw";
import close from "../../icons/close.svg?raw";
import { IconOnlyButton } from "components/button/button";
import { HTMLAttributes } from "preact/compat";
import { useRandomId } from "utils/preact/useId";

interface InputProps extends HTMLAttributes<HTMLInputElement> {
	label?: string;
	containerClass?: string;
}

export function Input({
	class: className = "",
	containerClass = "",
	...props
}: InputProps) {
	const _id = useRandomId();

	const id = props.id ?? _id;

	const Container = props.label ? "div" : Fragment;

	return (
		<Container class={`${style.labelContainer} ${containerClass}`}>
			{props.label && (
				<label
					class={`text-style-body-small-bold ${style.label}`}
					for={id}
					id={`${id}-label`}
				>
					{props.label}
				</label>
			)}
			<input
				{...props}
				id={id}
				class={`text-style-body-medium ${style.input} ${className}`}
			/>
		</Container>
	);
}

const IconOnlyButtonButOnClick = IconOnlyButton as never as ComponentType<
	ComponentProps<typeof IconOnlyButton> & {
		onclick?: string;
	}
>;

interface SearchInputProps {
	variant?: "default" | "dense";
	usedInPreact?: boolean;
	hideSearchButton?: boolean;
}

export function SearchInput({
	class: classClass = "",
	className = "",
	variant = "default",
	usedInPreact,
	hideSearchButton,
	id: propsId,
	type = "search",
	...props
}: JSX.IntrinsicElements["input"] & SearchInputProps) {
	const _id = useRandomId();

	const id = propsId ?? _id;

	// `onclick` lowercase is supported in Astro, not so in Preact runtime
	const clearButtonOnClickProps = usedInPreact
		? {
				onClick: () => {
					const el = document.querySelector(`#${id}`) as HTMLInputElement;
					el.value = "";
					el.dispatchEvent(new Event("input"));
					setTimeout(() => {
						el.dispatchEvent(new Event("change"));
					}, 0);
					el.focus();
				},
			}
		: {
				onclick: `el=document.querySelector("#${id}");el.value="";el.focus();`,
			};

	return (
		<div
			class={`${style.input} ${style.searchContainer} ${style[variant]} ${classClass} ${className}`}
		>
			{!hideSearchButton && (
				<div
					aria-hidden
					class={style.searchIconContainer}
					dangerouslySetInnerHTML={{ __html: search }}
				></div>
			)}
			<input
				aria-label="Search"
				{...props}
				id={id}
				type={type}
				class={`text-style-body-medium ${style.searchInput} ${
					hideSearchButton ? style.disableSearchIcon : ""
				}`}
			/>
			<div class={style.clearButtonContainer}>
				<IconOnlyButtonButOnClick
					variant="secondary"
					class={style.clearButton}
					tag="button"
					type="button"
					tabIndex={-1}
					aria-label="Clear search"
					{...clearButtonOnClickProps}
				>
					<div
						class={style.closeButtonContainer}
						dangerouslySetInnerHTML={{ __html: close }}
					></div>
				</IconOnlyButtonButOnClick>
			</div>
		</div>
	);
}
