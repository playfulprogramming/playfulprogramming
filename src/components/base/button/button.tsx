import style from "./button.module.scss";

interface ButtonProps {
	href: string;
	class?: string;
	state?: "selected" | "inactive";
	variant?: "primary";
	large?: boolean;
	children: React.ReactNode,
}

export function Button({ href, class: className, children, ...props }: ButtonProps) {
	return (
		<a href={href} class={[
			!props.large && "text-style-button",
			props.large && `text-style-button-large ${style.large}`,
			style.button, className, style[props.variant], props.state,
		].filter(c => !!c).join(" ")}>
			<span class={style.buttonText}>
				{children}
			</span>
		</a>
	);
}
