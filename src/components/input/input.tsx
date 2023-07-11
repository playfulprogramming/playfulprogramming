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
	class: classClass = "",
	className = "",
	usedInPreact,
	...props
}: JSX.IntrinsicElements["input"] & {
	usedInPreact?: boolean;
}) {
	const id = useId();

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
				},
		  }
		: {
				onclick: `el=document.querySelector("#${id}");el.value="";`,
		  };

	return (
		<div
			class={`${style.input} ${style.searchContainer} ${classClass} ${className}`}
		>
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
