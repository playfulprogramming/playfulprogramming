import PlayIcon from "src/icons/play.svg?raw";
import EditIcon from "src/icons/edit.svg?raw";
import RefreshIcon from "src/icons/refresh.svg?raw";
import DotIcon from "src/icons/dot.svg?raw";
import LoadingIcon from "src/icons/loading.svg?raw";
import CheckmarkIcon from "src/icons/checkmark.svg?raw";
import { JSXNode, PropsWithChildren } from "components/types";
import { RawSvg } from "components/image/raw-svg";
import { Button, IconOnlyButton } from "components/button/button";
import style from "./code-embed.module.scss";
import { useCallback, useId } from "preact/hooks";
import { ChangeEvent } from "preact/compat";

interface ContainerProps {
	title?: string;
	editUrl?: string;
	children: JSXNode;
}

export function Container(props: ContainerProps) {
	return (
		<div class={style.container}>
			<div class={style.title}>
				<p class="text-style-body-medium-bold">{props.title}</p>
				{props.editUrl ? (
					<Button
						tag="a"
						variant="primary"
						leftIcon={<RawSvg icon={EditIcon} />}
						href={props.editUrl}
					>
						Edit
					</Button>
				) : null}
			</div>
			<div class={style.content}>{props.children}</div>
		</div>
	);
}

interface AddressBarProps {
	value: string;
	onChange(value: string): void;
	onSubmit(value: string): void;
	onReload(): void;
}

export function AddressBar(props: AddressBarProps) {
	const id = useId();

	const handleSubmit = useCallback(
		(e: Event) => {
			e.preventDefault();
			props.onSubmit(props.value);
		},
		[props.value, props.onSubmit],
	);

	const handleBlur = useCallback(() => {
		props.onSubmit(props.value);
	}, [props.value, props.onSubmit]);

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			props.onChange(e.currentTarget.value);
		},
		[props.onChange],
	);

	return (
		<form class={style.address} autocomplete="off" onSubmit={handleSubmit}>
			<label
				for={`code-embed-input-${id}`}
				class={`text-style-body-medium ${style.address__input}`}
			>
				<span class="visually-hidden">Address</span>
				<input
					id={`code-embed-input-${id}`}
					name="address"
					type="text"
					value={props.value}
					onChange={handleChange}
					onBlur={handleBlur}
				/>
			</label>
			<IconOnlyButton
				variant="primary"
				aria-label="Reload"
				onClick={props.onReload}
			>
				<RawSvg icon={RefreshIcon} />
			</IconOnlyButton>
		</form>
	);
}

export function CodeContainer({ children }: PropsWithChildren) {
	return <div class={style.content__code}>{children}</div>;
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
				class={style.preview__button}
				variant="primary-emphasized"
				leftIcon={<RawSvg icon={PlayIcon} />}
				onClick={props.onClick}
			>
				Run
			</Button>
		</div>
	);
}

function LoadingStepIcon(props: { index: number; current: number }) {
	if (props.index > props.current) {
		return <RawSvg class={style.loader__icon__pending} icon={DotIcon} />;
	} else if (props.index == props.current) {
		return <RawSvg class={style.loader__icon__loading} icon={LoadingIcon} />;
	} else {
		return <RawSvg class={style.loader__icon__done} icon={CheckmarkIcon} />;
	}
}

interface LoadingPlaceholderProps {
	loading: "download" | "install" | "start";
	consoleProcess?: string;
	consoleOutput?: string;
}

export function LoadingPlaceholder(props: LoadingPlaceholderProps) {
	const steps = ["download", "install", "start"];
	const current = steps.indexOf(props.loading);

	return (
		<div class={style.preview}>
			<div class={style.loader}>
				<ol>
					<li>
						<LoadingStepIcon index={0} current={current} />
						<span class="text-style-body-medium-bold">Downloading sources</span>
					</li>
					<li>
						<LoadingStepIcon index={1} current={current} />
						<span class="text-style-body-medium-bold">
							Installing dependencies
						</span>
					</li>
					<li>
						<LoadingStepIcon index={2} current={current} />
						<span class="text-style-body-medium-bold">Starting up</span>
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
}

export function PreviewFrame(props: PreviewFrameProps) {
	return (
		<div class={style.preview}>
			<iframe src={props.src} />
		</div>
	);
}
