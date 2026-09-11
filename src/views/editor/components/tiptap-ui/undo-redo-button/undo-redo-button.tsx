import type { JSX } from "preact";

import { useCallback } from "preact/hooks";

// --- Hooks ---
import { useTiptapEditor } from "../../../hooks/use-tiptap-editor.ts";

// --- Tiptap UI ---
import { type UseUndoRedoConfig, useUndoRedo } from "./index.tsx";

// --- UI Primitives ---
import {
	type ButtonProps,
	Button,
} from "../../tiptap-ui-primitive/button/index.tsx";
import { forwardRef } from "preact/compat";

interface UndoRedoButtonProps
	extends Omit<ButtonProps, "type">, UseUndoRedoConfig {
	/**
	 * Optional text to display alongside the icon.
	 */
	text?: string;
}

/**
 * Button component for triggering undo/redo actions in a Tiptap editor.
 *
 * For custom button implementations, use the `useHistory` hook instead.
 */
export const UndoRedoButton = forwardRef<
	HTMLButtonElement,
	UndoRedoButtonProps
>(
	(
		{
			editor: providedEditor,
			action,
			text,
			hideWhenUnavailable = false,
			onExecuted,
			onClick,
			children,
			...buttonProps
		},
		ref,
	) => {
		const { editor } = useTiptapEditor(providedEditor);
		const { isVisible, handleAction, label, canExecute, Icon } = useUndoRedo({
			editor,
			action,
			hideWhenUnavailable,
			onExecuted,
		});

		const handleClick = useCallback(
			(event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
				onClick?.(event);
				if (event.defaultPrevented) return;
				handleAction();
			},
			[handleAction, onClick],
		);

		if (!isVisible) {
			return null;
		}

		return (
			<Button
				type="button"
				disabled={!canExecute}
				data-style="ghost"
				data-disabled={!canExecute}
				role="button"
				tabIndex={-1}
				aria-label={label}
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

UndoRedoButton.displayName = "UndoRedoButton";
