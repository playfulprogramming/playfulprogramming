import { PropsWithOptionalChildren } from "components/types";
import styles from "./subheader.module.scss";
import { createElement } from "preact";
import { HTMLAttributes } from "preact/compat";

type SubHeaderProps = PropsWithOptionalChildren<{
	tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	class?: string;
	style?: string;
	text: string;
}> &
	HTMLAttributes<HTMLHeadingElement>;

export function SubHeader({
	tag,
	children,
	text,
	class: className,
	...props
}: SubHeaderProps) {
	const Heading = tag;

	return (
		<div className={styles.container}>
			<Heading
				{...props}
				className={[styles.heading, "text-style-headline-4", className]
					.filter((c) => !!c)
					.join(" ")}
			>
				{text}
			</Heading>
			{children}
		</div>
	);
}
