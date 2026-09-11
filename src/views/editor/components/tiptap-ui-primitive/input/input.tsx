import type { JSX } from "preact";
import { cn } from "../../../lib/tiptap-utils.ts";
import "./input.scss";

function Input({
	className,
	type,
	...props
}: JSX.InputHTMLAttributes<HTMLInputElement>) {
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
