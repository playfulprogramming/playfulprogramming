// import { useEffect, useRef, useState } from "preact/hooks";
import style from "./article-revisions.module.scss";
// import { JSX } from "preact";
import down from "src/icons/chevron_down.svg?raw";
import { log } from "console";

export function ArticleRevisionDropdown() {
	const date = "September 22, 2022";
	const version = "v2";
	return (
		<div>
			<button class={style.button} type="button" onClick={() => log("Ready")}>
				<span class={style.date}>{date}</span>
				<span class={style.dot}>•</span>
				<span class={style.version}>{version}</span>
				<span
					class={style.down}
					dangerouslySetInnerHTML={{ __html: down }}
				></span>
			</button>
		</div>
	);
}
