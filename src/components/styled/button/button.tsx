import style from "./button.module.scss";

interface ButtonProps {
	href: string;
	class?: string;
	children: React.ReactNode,
}

export function Button({ href, class: className, children }: ButtonProps) {
	return (
		<a href={href} class={`${style.button} ${className || ""}`}>
			<span class={style.buttonText}>
				{children}
			</span>
		</a>
	);
}
