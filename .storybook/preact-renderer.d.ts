declare module "@storybook/preact/entry-preview" {
	import type { Preview } from "@storybook/preact";
	export const render: NonNullable<Preview["render"]>;
	export const renderToCanvas: NonNullable<Preview["renderToCanvas"]>;
	export const parameters: NonNullable<Preview["parameters"]>;
}
