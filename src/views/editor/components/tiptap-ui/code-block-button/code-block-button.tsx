import type { JSX } from "preact";
import { useCallback } from "preact/hooks";

// --- Hooks ---
import { useTiptapEditor } from "../../../hooks/use-tiptap-editor";

// --- Lib ---
import { parseShortcutKeys } from "../../../lib/tiptap-utils";

// --- Tiptap UI ---
import type { UseCodeBlockConfig } from "./index";
import { CODE_BLOCK_SHORTCUT_KEY, useCodeBlock } from "./index";

// --- UI Primitives ---
import type { ButtonProps } from "../../tiptap-ui-primitive/button";
import { Button } from "../../tiptap-ui-primitive/button";
import { Badge } from "../../tiptap-ui-primitive/badge";
import { forwardRef } from "preact/compat";

interface CodeBlockButtonProps
	extends Omit<ButtonProps, "type">,
		UseCodeBlockConfig {
	/**
	 * Optional text to display alongside the icon.
	 */
	text?: string;
}

function CodeBlockShortcutBadge({
	shortcutKeys = CODE_BLOCK_SHORTCUT_KEY,
}: {
	shortcutKeys?: string;
}) {
	return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for toggling code block in a Tiptap editor.
 *
 * For custom button implementations, use the `useCodeBlock` hook instead.
 */
export const CodeBlockButton = forwardRef<
	HTMLButtonElement,
	CodeBlockButtonProps
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
		} = useCodeBlock({
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
				disabled={!canToggle}
				data-disabled={!canToggle}
				tabIndex={-1}
				aria-label={label}
				aria-pressed={isActive}
				tooltip="Code Block"
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

CodeBlockButton.displayName = "CodeBlockButton";
