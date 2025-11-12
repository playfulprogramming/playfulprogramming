import type { JSX, FunctionComponent } from "preact";
import { useCallback } from "preact/hooks";

// --- Hooks ---
import { useTiptapEditor } from "../../../hooks/use-tiptap-editor";

// --- Tiptap UI ---
import type { UseImageUploadConfig } from "./index";
import { useImageUpload } from "./index";

// --- UI Primitives ---
import type { ButtonProps } from "../../tiptap-ui-primitive/button";
import { Button } from "../../tiptap-ui-primitive/button";
import { forwardRef } from "preact/compat";

type IconProps = JSX.SVGAttributes<SVGSVGElement>;
type IconComponent = ({ className, ...props }: IconProps) => JSX.Element;

interface ImageUploadButtonProps
	extends Omit<ButtonProps, "type">,
		UseImageUploadConfig {
	/**
	 * Optional text to display alongside the icon.
	 */
	text?: string;
	/**
	 * Optional custom icon component to render instead of the default.
	 */
	icon?: IconComponent | FunctionComponent<IconProps>;
}

/**
 * Button component for uploading/inserting images in a Tiptap editor.
 *
 * For custom button implementations, use the `useImage` hook instead.
 */
export const ImageUploadButton = forwardRef<
	HTMLButtonElement,
	ImageUploadButtonProps
>(
	(
		{
			editor: providedEditor,
			text,
			hideWhenUnavailable = false,
			onInserted,
			onClick,
			icon: CustomIcon,
			children,
			...buttonProps
		},
		ref,
	) => {
		const { editor } = useTiptapEditor(providedEditor);
		const { isVisible, canInsert, handleImage, label, isActive, Icon } =
			useImageUpload({
				editor,
				hideWhenUnavailable,
				onInserted,
			});

		const handleClick = useCallback(
			(event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
				onClick?.(event);
				if (event.defaultPrevented) return;
				handleImage();
			},
			[handleImage, onClick],
		);

		if (!isVisible) {
			return null;
		}

		const RenderIcon = CustomIcon ?? Icon;

		return (
			<Button
				type="button"
				data-style="ghost"
				data-active-state={isActive ? "on" : "off"}
				role="button"
				tabIndex={-1}
				disabled={!canInsert}
				data-disabled={!canInsert}
				aria-label={label}
				aria-pressed={isActive}
				tooltip={label}
				onClick={handleClick}
				{...buttonProps}
				ref={ref}
			>
				{children ?? (
					<>
						<RenderIcon className="tiptap-button-icon" />
						{text && <span className="tiptap-button-text">{text}</span>}
					</>
				)}
			</Button>
		);
	},
);

ImageUploadButton.displayName = "ImageUploadButton";
