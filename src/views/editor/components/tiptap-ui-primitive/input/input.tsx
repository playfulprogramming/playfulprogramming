import { cn } from "../../../lib/tiptap-utils";
import "./input.scss";

function Input({
	className,
	type,
	...props
}: JSX.HTMLAttributes<HTMLInputElement>) {
	return (
		<input type={type} className={cn("tiptap-input", className)} {...props} />
	);
}

function InputGroup({
	className,
	children,
	...props
}: JSX.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("tiptap-input-group", className)} {...props}>
			{children}
		</div>
	);
}

export { Input, InputGroup };
