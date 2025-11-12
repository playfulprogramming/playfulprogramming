import type { JSX } from "preact";
import { useCallback } from "preact/hooks";

// --- Tiptap UI ---
import type { UseBlockquoteConfig } from "./index";
import { BLOCKQUOTE_SHORTCUT_KEY, useBlockquote } from "./index";

// --- Hooks ---
import { useTiptapEditor } from "../../../hooks/use-tiptap-editor";

// --- Lib ---
import { parseShortcutKeys } from "../../../lib/tiptap-utils";

// --- UI Primitives ---
import type { ButtonProps } from "../../tiptap-ui-primitive/button";
import { Button } from "../../tiptap-ui-primitive/button";
import { Badge } from "../../tiptap-ui-primitive/badge";
import { forwardRef } from "preact/compat";

interface BlockquoteButtonProps
	extends Omit<ButtonProps, "type">,
		UseBlockquoteConfig {
	/**
	 * Optional text to display alongside the icon.
	 */
	text?: string;
}

function BlockquoteShortcutBadge({
	shortcutKeys = BLOCKQUOTE_SHORTCUT_KEY,
}: {
	shortcutKeys?: string;
}) {
	return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for toggling blockquote in a Tiptap editor.
 *
 * For custom button implementations, use the `useBlockquote` hook instead.
 */
export const BlockquoteButton = forwardRef<
	HTMLButtonElement,
	BlockquoteButtonProps
>(
	(
		{
			editor: providedEditor,
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
		const {
			isVisible,
			canToggle,
			isActive,
			handleToggle,
			label,
			shortcutKeys,
			Icon,
		} = useBlockquote({
			editor,
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
				tooltip="Blockquote"
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

BlockquoteButton.displayName = "BlockquoteButton";
