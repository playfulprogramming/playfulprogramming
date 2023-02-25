import style from "./button.module.scss";

interface ButtonProps {
	href: string;
	class?: string;
	selected?: boolean;
	inactive?: boolean;
	children: React.ReactNode,
}

export function Button({ href, class: className, children, ...props }: ButtonProps) {
	return (
		<a href={href} class={[
			"text-style-button",
			style.button, className,
			props.selected && "selected",
			props.inactive && "inactive",
		].filter(c => !!c).join(" ")}>
			<span class={style.buttonText}>
				{children}
			</span>
		</a>
	);
}
