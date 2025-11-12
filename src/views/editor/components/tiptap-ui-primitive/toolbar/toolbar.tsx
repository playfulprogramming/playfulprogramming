import type { JSX } from "preact";
import "./toolbar.scss";
import { cn } from "../../../lib/tiptap-utils";
import { forwardRef } from "preact/compat";

type BaseProps = JSX.HTMLAttributes<HTMLDivElement>;

type ToolbarProps = BaseProps;

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
	({ children, className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				role="toolbar"
				aria-label="toolbar"
				className={cn("tiptap-toolbar", className as string)}
				{...props}
			>
				{children}
			</div>
		);
	},
);
Toolbar.displayName = "Toolbar";

export const ToolbarGroup = forwardRef<HTMLDivElement, BaseProps>(
	({ children, className, ...props }, ref) => (
		<div
			ref={ref}
			role="group"
			className={cn("tiptap-toolbar-group", className as string)}
			{...props}
		>
			{children}
		</div>
	),
);
ToolbarGroup.displayName = "ToolbarGroup";
