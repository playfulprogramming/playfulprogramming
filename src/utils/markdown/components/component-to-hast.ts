import type { PlayfulComponent } from "mdast-comment-components";
import type { Options } from "remark-rehype";
import type { ElementContent } from "hast";
import type { ComponentMarkupNode } from "./components.ts";

/** Bridge native Markdown syntax into the existing publishing transform contract. */
export const componentToHast: NonNullable<
	Options["handlers"]
>["playfulComponent"] = (state, node: PlayfulComponent) => {
	const result: ComponentMarkupNode = {
		type: "playful-component-markup",
		component: node.component,
		attributes: { ...node.attributes },
		position: node.position,
		// The old comment wrappers included the line breaks on either side of
		// their body. Keep those boundaries for the HTML/component compiler.
		children: node.form === "ranged" ? state.wrap(state.all(node), true) : [],
	};
	// This site-specific HAST node is consumed by the component transforms,
	// and explicitly passed through rehype-raw before those transforms run.
	return result as unknown as ElementContent;
};
