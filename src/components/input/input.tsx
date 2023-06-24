import style from "./input.module.scss";
import { ComponentProps, ComponentType, JSX } from "preact";
import search from "../../icons/search.svg?raw";
import close from "../../icons/close.svg?raw";
import { IconOnlyButton } from "components/button/button";
import { useId } from "preact/compat";

export function Input({
	class: className = "",
	...props
}: JSX.IntrinsicElements["input"]) {
	return (
		<input
			{...props}
			class={`text-style-body-medium ${style.input} ${className}`}
		/>
	);
}

const IconOnlyButtonButOnClick = IconOnlyButton as never as ComponentType<
	ComponentProps<typeof IconOnlyButton> & {
		onclick?: string;
	}
>;

export function SearchInput({
	class: className = "",
	...props
}: JSX.IntrinsicElements["input"]) {
	const id = useId();
	return (
		<div class={`${style.input} ${style.searchContainer} ${className}`}>
			<div
				class={style.searchIconContainer}
				dangerouslySetInnerHTML={{ __html: search }}
			></div>
			<input
				{...props}
				id={id}
				class={`text-style-body-medium ${style.searchInput}`}
			/>
			<div class={style.clearButtonContainer}>
				<IconOnlyButtonButOnClick
					variant="secondary"
					class={style.clearButton}
					tag="button"
					type="button"
					onclick={`el=document.querySelector("#${id}");el.value="";`}
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
