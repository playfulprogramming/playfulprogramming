import type { JSX } from "preact";
import { useCallback } from "preact/hooks";

// --- Hooks ---
import { useTiptapEditor } from "../../../hooks/use-tiptap-editor.ts";

// --- UI Primitives ---
import {
	type ButtonProps,
	Button,
} from "../../tiptap-ui-primitive/button/index.tsx";

// --- Tiptap UI ---
import { type UseListConfig, useList } from "./index.tsx";
import { forwardRef } from "preact/compat";

interface ListButtonProps extends Omit<ButtonProps, "type">, UseListConfig {
	/**
	 * Optional text to display alongside the icon.
	 */
	text?: string;
}

/**
 * Button component for toggling lists in a Tiptap editor.
 *
 * For custom button implementations, use the `useList` hook instead.
 */
export const ListButton = forwardRef<HTMLButtonElement, ListButtonProps>(
	(
		{
			editor: providedEditor,
			type,
			text,
			hideWhenUnavailable = false,
			onToggled,
			onClick,
			children,
			...buttonProps
		},
		ref,
	) => {
		const { editor } = useTiptapEditor(providedEditor);
		const { isVisible, canToggle, isActive, handleToggle, label, Icon } =
			useList({
				editor,
				type,
				hideWhenUnavailable,
				onToggled,
			});

		const handleClick = useCallback(
			(event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
				onClick?.(event);
				if (event.defaultPrevented) return;
				handleToggle();
			},
			[handleToggle, onClick],
		);

		if (!isVisible) {
			return null;
		}

		return (
			<Button
				type="button"
				data-style="ghost"
				data-active-state={isActive ? "on" : "off"}
				role="button"
				tabIndex={-1}
				disabled={!canToggle}
				data-disabled={!canToggle}
				aria-label={label}
				aria-pressed={isActive}
				tooltip={label}
				onClick={handleClick}
				{...buttonProps}
				ref={ref}
			>
				{children ?? (
					<>
						<Icon className="tiptap-button-icon" />
						{text && <span className="tiptap-button-text">{text}</span>}
					</>
				)}
			</Button>
		);
	},
);

ListButton.displayName = "ListButton";
