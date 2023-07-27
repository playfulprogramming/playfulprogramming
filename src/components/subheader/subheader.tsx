import { PropsWithOptionalChildren } from "components/types";
import styles from "./subheader.module.scss";
import { createElement } from "preact";

type SubHeaderProps = PropsWithOptionalChildren<{
	tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	class?: string;
	style?: string;
	text: string;
}>;

export function SubHeader({
	tag,
	children,
	text,
	class: className,
	...props
}: SubHeaderProps) {
	const Heading = (props: any) =>
		createElement(
			tag,
			{
				...props,
			},
			props.children,
		);

	return (
		<div className={styles.container}>
			<Heading
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
