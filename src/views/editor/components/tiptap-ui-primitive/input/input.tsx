import { cn } from "../../../lib/tiptap-utils";
import "./input.scss";

function Input({ className, type, ...props }: JSX.HTMLAttributes<"input">) {
	return (
		<input type={type} className={cn("tiptap-input", className)} {...props} />
	);
}

function InputGroup({
	className,
	children,
	...props
}: JSX.HTMLAttributes<"div">) {
	return (
		<div className={cn("tiptap-input-group", className)} {...props}>
			{children}
		</div>
	);
}

export { Input, InputGroup };
