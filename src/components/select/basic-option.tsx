import { ComponentChildren } from "preact";

interface OptionProps {
	children: ComponentChildren;
}

export function Option({ children }: OptionProps) {
	return <li>{children}</li>;
}
