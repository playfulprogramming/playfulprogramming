import { ComponentChild } from "preact";
import styles from "./gist-placeholder.module.scss";
import { Button } from "components/button/button";
import github from "src/icons/github.svg?raw";
import { RawSvg } from "components/image/raw-svg";

export interface GistPlaceholderProps {
	username: string;
	filename: string;
	href: string;
}

export function GistPlaceholder({
	children,
	href,
	username,
	filename,
}: GistPlaceholderProps & {
	children: ComponentChild;
}) {
	return (
		<div class={styles.container}>
			{children}
			<div class={styles.bottomContainer}>
				<p class={styles.textContainer}>
					<a
						href={`https://github.com/${username}`}
						class={`text-style-body-medium-bold ${styles.username}`}
					>
						{username}
					</a>
					<span class={`text-style-body-medium ${styles.divider}`}> / </span>
					<span class={`text-style-body-medium ${styles.filename}`}>
						{filename}
					</span>
				</p>
				<Button href={href} leftIcon={<RawSvg icon={github} />}>
					View Gist
				</Button>
			</div>
		</div>
	);
}
