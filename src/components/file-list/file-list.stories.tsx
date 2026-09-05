import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { FileList, File, FileListList } from "./file-list.tsx";

import { file, files } from "../../../.storybook/fixtures.ts";

const meta = preview.type<{ args: ComponentProps<typeof FileList> }>().meta({
	title: "Components/FileList",
	component: FileList,
	args: { items: files },
});
export const Default = meta.story({});
export const SingleFile = meta.story({ render: () => <File {...file} /> });
export const ListOnly = meta.story({
	render: (args) => <FileListList {...args} />,
});
