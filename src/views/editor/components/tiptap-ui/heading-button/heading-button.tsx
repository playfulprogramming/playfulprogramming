import type { JSX } from "preact";
import { useCallback } from "preact/hooks";

// --- Tiptap UI ---
import type { UseHeadingConfig } from "./index";
import { useHeading } from "./index";

// --- UI Primitives ---
import type { ButtonProps } from "../../tiptap-ui-primitive/button";
import { Button } from "../../tiptap-ui-primitive/button";
import { useTiptapEditor } from "../../../hooks/use-tiptap-editor";
import { forwardRef } from "preact/compat";

interface HeadingButtonProps
	extends Omit<ButtonProps, "type">,
		UseHeadingConfig {
	/**
	 * Optional text to display alongside the icon.
	 */
	text?: string;
}

/**
 * Button component for toggling heading in a Tiptap editor.
 *
 * For custom button implementations, use the `useHeading` hook instead.
 */
export const HeadingButton = forwardRef<HTMLButtonElement, HeadingButtonProps>(
	(
		{
			editor: providedEditor,
			level,
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
			useHeading({
				editor,
				level,
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

HeadingButton.displayName = "HeadingButton";
