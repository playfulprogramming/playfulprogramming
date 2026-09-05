import preview from "../../../.storybook/preview.ts";
import Demo from "../../../.storybook/fixtures/heading-link.astro";
const meta = preview.meta({
	title: "components/Heading Link Script",
	component: Demo,
	play: async ({ canvasElement }) => {
		// This legacy component initializes on window.load, which has already fired
		// by the time Storybook inserts its HTML. Wait for its module, then initialize.
		for (const script of canvasElement.querySelectorAll<HTMLScriptElement>(
			'script[type="module"][src]',
		)) {
			await import(/* @vite-ignore */ script.src);
		}
		canvasElement.ownerDocument.defaultView?.dispatchEvent(new Event("load"));
	},
});
export const Default = meta.story({});
