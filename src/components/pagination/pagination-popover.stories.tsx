import { preactPreview as preview } from "../../../.storybook/preview.ts";
import type { ComponentProps } from "preact";
import { PaginationMenuAndPopover } from "./pagination-popover.tsx";
import { useState } from "preact/hooks";
function Demo(args: ComponentProps<typeof PaginationMenuAndPopover>) {
	const [currentPage, setPage] = useState(args.page.currentPage);
	return (
		<>
			<p>Current page: {currentPage}</p>
			<ul class="unlist">
				<PaginationMenuAndPopover
					{...args}
					page={{ ...args.page, currentPage }}
					getPageHref={(n) => `#page-${n}`}
					softNavigate={(_, n) => setPage(n)}
				/>
			</ul>
		</>
	);
}
const meta = preview
	.type<{ args: ComponentProps<typeof PaginationMenuAndPopover> }>()
	.meta({
		title: "Components/PaginationMenuAndPopover",
		component: PaginationMenuAndPopover,
		args: { page: { currentPage: 5, lastPage: 20 } },
		render: (args) => (
			<Demo key={`${args.page.currentPage}-${args.page.lastPage}`} {...args} />
		),
	});
export const Default = meta.story({});
export const FirstPage = meta.story({
	args: { page: { currentPage: 1, lastPage: 20 } },
});
export const LastPage = meta.story({
	args: { page: { currentPage: 20, lastPage: 20 } },
});
