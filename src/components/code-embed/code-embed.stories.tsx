import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import {
	Container,
	AddressBar,
	CodeContainer,
	PreviewContainer,
	PreviewPlaceholder,
	LoadingPlaceholder,
	PreviewFrame,
	PreviewError,
} from "./code-embed.tsx";

import { entries } from "../../../.storybook/fixtures.ts";
import { useState } from "preact/hooks";
function CodeDemo() {
	const [file, setFile] = useState(entries[0].name);
	return (
		<CodeContainer file={file} entries={entries} onFileChange={setFile}>
			<pre>
				<code>{entries.find((entry) => entry.name === file)?.code}</code>
			</pre>
		</CodeContainer>
	);
}
function PreviewDemo() {
	const [running, setRunning] = useState(false);
	return (
		<PreviewContainer>
			{running ? (
				<p>Hello, world!</p>
			) : (
				<PreviewPlaceholder onClick={() => setRunning(true)} />
			)}
		</PreviewContainer>
	);
}
function AddressDemo() {
	const [value, setValue] = useState("/example");
	const [submitted, setSubmitted] = useState("/example");
	return (
		<>
			<AddressBar
				value={value}
				onChange={setValue}
				onSubmit={setSubmitted}
				onReload={() => setValue(submitted)}
			/>
			<p>Preview address: {submitted}</p>
		</>
	);
}
const meta = preview.type<{ args: ComponentProps<typeof Container> }>().meta({
	title: "Components/Code Embed",
	component: Container,
	args: {
		title: "A small TypeScript example",
		codePanel: <CodeDemo />,
		previewPanel: <PreviewDemo />,
	},
});
export const Default = meta.story({});
export const Address = meta.story({ render: () => <AddressDemo /> });
export const Code = meta.story({ render: () => <CodeDemo /> });
export const Preview = meta.story({ render: () => <PreviewDemo /> });
export const Loading = meta.story({
	render: () => (
		<LoadingPlaceholder
			loading="install"
			consoleProcess="pnpm install"
			consoleOutput="Installing dependencies…"
		/>
	),
});
export const Frame = meta.story({
	render: () => (
		<PreviewFrame src="/storybook-preview.html" onLoad={() => {}} />
	),
});
export const Error = meta.story({ render: () => <PreviewError /> });
