/** @jsxRuntime automatic */
import { Node, Element } from "hast";
import { fromHtml } from "hast-util-from-html";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const play = await fs.readFile("src/icons/play.svg", "utf8");
const PlayIcon = fromHtml(play, { fragment: true }).children[0] as Element;

const edit = await fs.readFile("src/icons/edit.svg", "utf8");
const EditIcon = fromHtml(edit, { fragment: true }).children[0] as Element;

const refresh = await fs.readFile("src/icons/refresh.svg", "utf8");
const RefreshIcon = fromHtml(refresh, { fragment: true })
	.children[0] as Element;

export interface CodeSnippetProps {
	line: number;
	text: string;
	language: string;
}

interface CodeEmbedProps {
	driver: string;
	title?: string;
	editUrl?: string;
	snippets: CodeSnippetProps[];
	children: Node[];
	height?: string;

	projectZip?: string;

	addressPrefix?: string;
	address?: string;
	staticUrl?: string;
}

/** @jsxImportSource hastscript */
function CodeEmbedAddressBar(props: { prefix: string, address: string }) {
	const id = uuidv4();
	return (
		<form id="code-embed-address" class="code-embed__address" autocomplete="off">
			<label for={`code-embed-input-${id}`} class="text-style-body-medium code-embed__address__input" data-prefix={props.prefix}>
				<span class="visually-hidden">Address</span>
				<input
					id={`code-embed-input-${id}`}
					name="address"
					type="text"
					value={props.address}
				/>
			</label>
			<button
				id="code-embed-reload-preview"
				type="button"
				aria-label="Reload"
				class="button iconOnly regular primary text-style-button-regular"
			>
				<div aria-hidden="true" class="iconOnlyButtonIcon">
					{RefreshIcon}
				</div>
			</button>
		</form>
	);
}

/** @jsxImportSource hastscript */
export function CodeEmbed(props: CodeEmbedProps): Element {
	return (
		<div
			class="code-embed"
			data-code-embed={props.driver}
			data-code-embed-title={`Example: ${props.title}`}
			data-project-zip={props.projectZip}
			style={{
				["--code-embed_preview_height"]: props.height ? Number(props.height) + 'px' : "350px",
			}}
		>
			{props.title ? (
				<div class="code-embed__title">
					<p class="text-style-body-medium-bold">{props.title}</p>
					{props.editUrl ? (
						<a
							href={props.editUrl}
							class="button regular primary text-style-button-regular"
						>
							<div aria-hidden="true" class="buttonIcon">
								{EditIcon}
							</div>
							<span class="innerText">Edit</span>
						</a>
					) : null}
				</div>
			) : null}
			{props.snippets.map((snippet) => (
				<div
					style={`--codeblock-line-start: ${snippet.line - 1}`}
					class="code-embed__snippet"
				>
					<pre class="shiki">
						<code class={snippet.language ? `language-${snippet.language}` : ""}>
							{snippet.text}
						</code>
					</pre>
				</div>
			))}
			{props.children.length > 0 ? (
				<div class="code-embed__content">{props.children}</div>
			) : null}
			{props.projectZip ? (
				<>
					{CodeEmbedAddressBar({
						prefix: props.addressPrefix ?? "",
						address: props.address ?? "",
					})}
					<div id="code-embed-preview-container" class="code-embed__preview">
						<button
							id="code-embed-run-preview"
							class="button regular primary-emphasized text-style-button-regular code-embed__preview__button"
						>
							<div aria-hidden="true" class="buttonIcon">
								{PlayIcon}
							</div>
							<div class="innerText">Run</div>
						</button>
					</div>
				</>
			) : null}
			{props.driver == "static" && props.staticUrl ? (
				<>
					{CodeEmbedAddressBar({ prefix: props.addressPrefix ?? "", address: props.address ?? "" })}
					<div id="code-embed-preview-container" class="code-embed__preview">
						<iframe title={`Example: ${props.title}`} src={props.staticUrl} />
					</div>
				</>
			) : null}
		</div>
	) as never;
}

/** @jsxImportSource hastscript */
export function CodeEmbedEpub(props: Pick<CodeEmbedProps, "title" | "editUrl" | "snippets" | "children">): Element {
	return <>
			{props.snippets.map((snippet) => (
				<pre class="shiki">
					<code class={snippet.language ? `language-${snippet.language}` : ""}>
						{snippet.text}
					</code>
				</pre>
			))}
			{props.children}
			{props.title && props.editUrl ? (
				<p><a href={props.editUrl}>{props.title}</a></p>
			) : null}
	</> as never;
}
