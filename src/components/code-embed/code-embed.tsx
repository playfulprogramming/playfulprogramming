import PlayIcon from "#src/icons/play.svg?raw";
import EditIcon from "#src/icons/edit.svg?raw";
import RefreshIcon from "#src/icons/refresh.svg?raw";
import DotIcon from "#src/icons/dot.svg?raw";
import LoadingIcon from "#src/icons/loading.svg?raw";
import CheckmarkIcon from "#src/icons/checkmark.svg?raw";
import type { PropsWithChildren } from "#components/types.ts";
import { RawSvg } from "#components/image/raw-svg.tsx";
import { Button, IconOnlyButton } from "#components/button/button.tsx";
import style from "./code-embed.module.scss";
import { useCallback, useId, useMemo } from "preact/hooks";
import type { TargetedEvent, ComponentChildren } from "preact";
import { FilePicker } from "./file-picker.tsx";
import type { FileEntry } from "./types.ts";
import { ResizeablePanels } from "./resizeable-panels.tsx";

import { m } from "#src/paraglide/messages.js";

interface ContainerProps {
	title?: string;
	editUrl?: string;
	codePanel: ComponentChildren;
	previewPanel: ComponentChildren;
}

export function Container(props: ContainerProps) {
	return (
		<div class={`${style.container} markdownCollapsePadding`}>
			<div class={style.title}>
				<p class="text-style-body-medium-bold">{props.title}</p>
				{props.editUrl ? (
					<Button
						tag="a"
						variant="primary"
						leftIcon={<RawSvg icon={EditIcon} />}
						href={props.editUrl}
					>
						{m.action_edit()}
					</Button>
				) : null}
			</div>
			<ResizeablePanels
				panelHeight={450}
				leftPanel={props.codePanel}
				rightPanel={props.previewPanel}
			/>
		</div>
	);
}

interface AddressBarProps {
	value: string;
	onChange(value: string): void;
	onSubmit(value: string): void;
	onReload(): void;
}

export function AddressBar({
	value,
	onChange,
	onSubmit,
	onReload,
}: AddressBarProps) {
	const id = useId();

	const handleSubmit = useCallback(
		(e: Event) => {
			e.preventDefault();
			onSubmit(value);
		},
		[value, onSubmit],
	);

	const handleBlur = useCallback(() => {
		onSubmit(value);
	}, [value, onSubmit]);

	const handleChange = useCallback(
		(e: TargetedEvent<HTMLInputElement, Event>) => {
			onChange(e.currentTarget.value);
		},
		[onChange],
	);

	return (
		<form class={style.address} autocomplete="off" onSubmit={handleSubmit}>
			<label
				for={`code-embed-input-${id}`}
				class={`text-style-body-medium ${style.address__input}`}
			>
				<span class="visually-hidden">{m.label_address()}</span>
				<input
					id={`code-embed-input-${id}`}
					name="address"
					type="text"
					value={value}
					onChange={handleChange}
					onBlur={handleBlur}
				/>
			</label>
			<IconOnlyButton
				tag="button"
				variant="primary"
				aria-label={m.action_reload()}
				onClick={onReload}
			>
				<RawSvg icon={RefreshIcon} />
			</IconOnlyButton>
		</form>
	);
}

export interface CodeContainerProps extends PropsWithChildren {
	file?: string;
	onFileChange(file: string): void;
	entries: Array<FileEntry>;
}

export function CodeContainer(props: CodeContainerProps) {
	const file = useMemo(() => {
		return props.file ?? props.entries.at(0)?.name ?? "";
	}, [props.file, props.entries]);

	return (
		<div class={style.content__code}>
			<div class={style.content__code__filepicker}>
				<FilePicker
					file={file}
					entries={props.entries}
					onFileChange={props.onFileChange}
				/>
			</div>
			<div class={style.content__code__snippet}>{props.children}</div>
		</div>
	);
}

export function PreviewContainer({ children }: PropsWithChildren) {
	return <div class={style.content__preview}>{children}</div>;
}

interface PreviewPlaceholderProps {
	onClick(): void;
}

export function PreviewPlaceholder(props: PreviewPlaceholderProps) {
	return (
		<div class={style.preview}>
			<Button
				tag="button"
				class={style.preview__button}
				variant="primary-emphasized"
				leftIcon={<RawSvg icon={PlayIcon} />}
				onClick={props.onClick}
			>
				{m.action_run()}
			</Button>
		</div>
	);
}

function LoadingStepIcon(props: { index: number; current: number }) {
	if (props.index > props.current) {
		return <RawSvg class={style.loader__icon__pending} icon={DotIcon} />;
	} else if (props.index == props.current) {
		return <RawSvg class={style.loader__icon__loading} icon={LoadingIcon} />;
	}
	return <RawSvg class={style.loader__icon__done} icon={CheckmarkIcon} />;
}

interface LoadingPlaceholderProps {
	loading?: "download" | "install" | "start";
	consoleProcess?: string;
	consoleOutput?: string;
}

export function LoadingPlaceholder(props: LoadingPlaceholderProps) {
	const steps = ["download", "install", "start"];
	const current = steps.indexOf(props.loading ?? "");

	return (
		<div class={style.preview}>
			<div class={style.loader}>
				<ol>
					<li>
						<LoadingStepIcon index={0} current={current} />
						<span class="text-style-body-medium-bold">
							{m.code_embed_loading_download_sources()}
						</span>
					</li>
					<li>
						<LoadingStepIcon index={1} current={current} />
						<span class="text-style-body-medium-bold">
							{m.code_embed_loading_install_dependencies()}
						</span>
					</li>
					<li>
						<LoadingStepIcon index={2} current={current} />
						<span class="text-style-body-medium-bold">
							{m.code_embed_loading_starting_up()}
						</span>
					</li>
				</ol>
				<span class={`${style.loader__command} text-style-body-small-bold`}>
					{props.consoleProcess}
				</span>
				<span class={`${style.loader__console} text-style-code`}>
					{props.consoleOutput}
				</span>
			</div>
		</div>
	);
}

interface PreviewFrameProps {
	src: string;
	onLoad(src: string): void;
}

export function PreviewFrame(props: PreviewFrameProps) {
	const { src, onLoad } = props;
	const handleLoad = useCallback(
		(e: TargetedEvent<HTMLIFrameElement>) => {
			const src = e.currentTarget.src;
			if (src) onLoad(src);
		},
		[onLoad],
	);

	return (
		<div class={style.preview}>
			<iframe src={src} onLoad={handleLoad} />
		</div>
	);
}

export function PreviewError() {
	return (
		<div class={style.error}>
			<div class={style.error__grid}>
				<div class={style.error__background} />
				<p class={`${style.error__heading} text-style-headline-3`}>
					{m.code_embed_error_title()}
				</p>
				<p class={`${style.error__message} text-style-body-large`}>
					{m.code_embed_error_description_before_link()}{" "}
					<a href="https://webcontainers.io/guides/browser-support">
						{m.code_embed_error_supported_browser()}
					</a>
					.
				</p>
				<div class={style.error__buttons}>
					<Button
						tag="a"
						href="https://github.com/playfulprogramming/playfulprogramming/issues"
						target="_blank"
						variant="secondary"
					>
						{m.action_report_issue()}
					</Button>
				</div>
			</div>
		</div>
	);
}
