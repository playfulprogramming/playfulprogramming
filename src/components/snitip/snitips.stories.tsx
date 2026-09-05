import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { SnitipDialog } from "./snitip-dialog.tsx";
import { snitip } from "../../../.storybook/fixtures.ts";
import { useLayoutEffect, useRef } from "preact/hooks";
import { RawSvg } from "#components/image/raw-svg.tsx";
import infoIcon from "#src/assets/icons/info.svg?raw";
import { m } from "#src/paraglide/messages.js";
import { initializeSnitips } from "./snitip-script-impl.ts";
import "./snitip-trigger.scss";
import "../inline-popup/inline-popup.scss";

type Args = ComponentProps<typeof SnitipDialog>;

// Hardcoded output of utils/markdown/snitip-link/SnitipLink.tsx. Both references
// share the dialog emitted by utils/markdown/components/snitip/snitip-template.astro.
function InlineReference({
	id,
	snitip,
	label,
}: Pick<Args, "id" | "snitip"> & { label: string }) {
	return (
		<span
			class="snitip-trigger"
			data-snitip-trigger={snitip.id}
			data-snitip-dialog={id}
		>
			<button
				type="button"
				class="snitip-trigger__button"
				aria-controls={id}
				aria-expanded="false"
				aria-haspopup="dialog"
				aria-label={m.label_open_tooltip_for({ label, title: snitip.title })}
			>
				<span class="snitip-trigger__text">{label}</span>
				<span class="snitip-trigger__icon-container">
					<span aria-hidden="true" class="snitip-trigger__popup inline-popup">
						<span class="inline-popup__content">{m.action_open_tooltip()}</span>
					</span>
					<RawSvg icon={infoIcon} class="snitip-trigger__icon" aria-hidden />
				</span>
			</button>
		</span>
	);
}

function Demo(args: Args) {
	const ref = useRef<HTMLDivElement>(null);
	useLayoutEffect(() => {
		if (ref.current) return initializeSnitips(ref.current);
	}, [args.id, args.snitip.id, args.headingTag]);

	return (
		<div
			ref={ref}
			style={{ maxWidth: "48rem", margin: "4rem auto", padding: "1.5rem" }}
		>
			<article class="post-body">
				<h1>Building an interface, one piece at a time</h1>
				<p>
					An interface is easier to understand when you break it into{" "}
					<InlineReference {...args} label="small components" />. Each piece
					brings together the markup, styles, and behavior it needs.
				</p>
				<p>
					Hover over the highlighted phrase for a preview, or click to keep the
					explanation open. You can also Tab to the phrase and press Enter or
					Space. Close it with Escape, the close button, or a click outside the
					card.
				</p>
				<p>
					As your interface grows, you can reuse the same{" "}
					<InlineReference {...args} label="component" /> in another part of the
					page without losing the surrounding context.
				</p>
			</article>
			<SnitipDialog {...args} />
		</div>
	);
}
const meta = preview
	.type<{ args: ComponentProps<typeof SnitipDialog> }>()
	.meta({
		title: "Components/Snitips",
		component: SnitipDialog,
		args: {
			id: "snitip-dialog-storybook-components",
			snitip,
			headingTag: "h2",
		},
		parameters: { layout: "fullscreen" },
		render: (args) => <Demo {...args} />,
	});
export const Default = meta.story({});
