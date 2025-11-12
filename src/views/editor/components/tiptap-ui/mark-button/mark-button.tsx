import type { JSX } from "preact";

import { useCallback } from "preact/hooks";

// --- Hooks ---
import { useTiptapEditor } from "../../../hooks/use-tiptap-editor";

// --- Tiptap UI ---
import type { UseMarkConfig } from "./index";
import { useMark } from "./index";

// --- UI Primitives ---
import type { ButtonProps } from "../../tiptap-ui-primitive/button";
import { Button } from "../../tiptap-ui-primitive/button";
import { forwardRef } from "preact/compat";

interface MarkButtonProps
	extends Omit<ButtonProps, "type">,
		UseMarkConfig {
	/**
	 * Optional text to display alongside the icon.
	 */
	text?: string;
}

/**
 * Button component for toggling marks in a Tiptap editor.
 *
 * For custom button implementations, use the `useMark` hook instead.
 */
export const MarkButton = forwardRef<HTMLButtonElement, MarkButtonProps>(
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
		const { isVisible, handleMark, label, canToggle, isActive, Icon } = useMark(
			{
				editor,
				type,
				hideWhenUnavailable,
				onToggled,
			},
		);

		const handleClick = useCallback(
			(event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
				onClick?.(event);
				if (event.defaultPrevented) return;
				handleMark();
			},
			[handleMark, onClick],
		);

		if (!isVisible) {
			return null;
		}

		return (
			<Button
				type="button"
				disabled={!canToggle}
				data-style="ghost"
				data-active-state={isActive ? "on" : "off"}
				data-disabled={!canToggle}
				role="button"
				tabIndex={-1}
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

MarkButton.displayName = "MarkButton";
