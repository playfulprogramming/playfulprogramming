import style from "./button.module.scss";

type ButtonProps = {
	tag?: "anchor" | "button";
	class?: string;
	state?: "selected" | "inactive";
	variant?: "primary";
	large?: boolean;
	children: React.ReactNode,
} & React.ButtonHTMLAttributes<any> & React.AnchorHTMLAttributes<any>;

export function Button({ tag, class: className, children, state, variant, large, ...props }: ButtonProps) {
	const Wrapper = (props: any) => tag === "button" ? <button {...props}/> : <a {...props}/>;

	return (
		<Wrapper {...props} aria-label={props["aria-label"]} class={[
			!large && "text-style-button",
			large && `text-style-button-large ${style.large}`,
			style.button, className, style[variant], state,
		].filter(c => !!c).join(" ")}>
			<span class={`d-flex ${style.buttonText}`}>
				{children}
			</span>
		</Wrapper>
	);
}
