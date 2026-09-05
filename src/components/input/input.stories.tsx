import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { Input, SearchInput } from "./input.tsx";

const meta = preview.type<{ args: ComponentProps<typeof Input> }>().meta({
	title: "components/Input",
	component: Input,
	args: { label: "Your name", placeholder: "Alex Example" },
});
export const Default = meta.story({});
export const Disabled = meta.story({
	args: { disabled: true, value: "Alex Example" },
});
export const Invalid = meta.story({
	args: { "aria-invalid": true, value: "Invalid value" },
});
export const Search = meta.story({
	render: () => <SearchInput usedInPreact placeholder="Search articles" />,
});
export const DenseSearch = meta.story({
	render: () => (
		<SearchInput usedInPreact variant="dense" placeholder="Search articles" />
	),
});
