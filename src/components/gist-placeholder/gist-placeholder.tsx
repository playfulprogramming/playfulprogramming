import type { Locale } from "#src/paraglide/runtime.js";
import type { ComponentChild } from "preact";
import styles from "./gist-placeholder.module.scss";
import { Button } from "#components/button/button.tsx";
import github from "#src/icons/github.svg?raw";
import { RawSvg } from "#components/image/raw-svg.tsx";

import { m } from "#src/paraglide/messages.js";

export interface GistPlaceholderProps {
	locale: Locale;
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
					{m.action_view_gist({}, { locale })}
				</Button>
			</div>
		</div>
	);
}
