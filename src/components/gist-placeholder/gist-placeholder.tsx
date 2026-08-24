import type { ComponentChild } from "preact";
import styles from "./gist-placeholder.module.scss";
import { Button } from "#components/button/button.tsx";
import github from "#src/icons/github.svg?raw";
import { RawSvg } from "#components/image/raw-svg.tsx";
import type { Languages } from "#types/index.ts";
import { createTranslator } from "#utils/translations.ts";

export interface GistPlaceholderProps {
	locale: Languages;
	username: string;
	filename: string;
	href: string;
}

export function GistPlaceholder({
	children,
	href,
	locale,
	username,
	filename,
}: GistPlaceholderProps & {
	children: ComponentChild;
}) {
	const translate = createTranslator(locale);
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
					{translate("action.view_gist")}
				</Button>
			</div>
		</div>
	);
}
