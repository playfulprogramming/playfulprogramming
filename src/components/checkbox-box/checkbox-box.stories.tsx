import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { CheckboxBox } from "./checkbox-box.tsx";
import { useState } from "preact/hooks";
function Demo(args: Omit<ComponentProps<typeof CheckboxBox>, "wrapper">) {
	const [selected, setSelected] = useState(args.selected);
	return (
		<CheckboxBox
			{...args}
			selected={selected}
			wrapper={(visual) => (
				<label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
					<input
						type="checkbox"
						class="visually-hidden"
						checked={selected}
						disabled={args.disabled}
						onChange={(e) => setSelected(e.currentTarget.checked)}
					/>
					{visual}
					<span>Receive updates</span>
				</label>
			)}
		/>
	);
}
const meta = preview
	.type<{ args: Omit<ComponentProps<typeof CheckboxBox>, "wrapper"> }>()
	.meta({
		title: "components/Checkbox Box",
		component: Demo,
		args: { selected: false },
		render: (args) => (
			<Demo key={`${args.selected}-${args.disabled}`} {...args} />
		),
	});
export const Default = meta.story({});
export const Selected = meta.story({ args: { selected: true } });
export const Disabled = meta.story({
	args: { selected: true, disabled: true },
});
