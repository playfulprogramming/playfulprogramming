import { preactPreview as preview } from "../../.storybook/preview.ts";
import MermaidRenderer from "./MermaidRenderer.tsx";
const meta = preview.meta({
	title: "Components/Mermaid Renderer",
	component: MermaidRenderer,
	render: () => (
		<>
			<pre
				class="mermaid"
				data-graph="graph LR; Idea-->Example; Example-->Understanding;"
			/>
			<MermaidRenderer />
		</>
	),
});
export const Default = meta.story({});
