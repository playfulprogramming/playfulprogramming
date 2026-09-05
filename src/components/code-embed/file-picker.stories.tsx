import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { FilePicker } from "./file-picker.tsx";
import { entries } from "../../../.storybook/fixtures.ts";
import { useState } from "preact/hooks";
function Demo(args: ComponentProps<typeof FilePicker>) {
	const [file, setFile] = useState(args.file);
	return (
		<div style={{ width: "min(600px, 100%)" }}>
			<FilePicker {...args} file={file} onFileChange={setFile} />
			<pre>{args.entries.find((entry) => entry.name === file)?.code}</pre>
		</div>
	);
}
const meta = preview.type<{ args: ComponentProps<typeof FilePicker> }>().meta({
	title: "Components/FilePicker",
	component: FilePicker,
	args: { entries, file: entries[0].name },
	render: (args) => <Demo {...args} />,
});
export const Default = meta.story({});
