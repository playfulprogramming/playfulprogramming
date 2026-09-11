import { useCallback, useState } from "preact/hooks";
import { type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "../../../hooks/use-tiptap-editor.ts";

// --- Icons ---
import { ChevronDownIcon } from "../../tiptap-icons/chevron-down-icon.tsx";

// --- Tiptap UI ---
import { ListButton, type ListType } from "../list-button/index.tsx";

import { useListDropdownMenu } from "./use-list-dropdown-menu.ts";

// --- UI Primitives ---
import {
	type ButtonProps,
	Button,
	ButtonGroup,
} from "../../tiptap-ui-primitive/button/index.tsx";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "../../tiptap-ui-primitive/dropdown-menu/index.tsx";
import { Card, CardBody } from "../../tiptap-ui-primitive/card/index.tsx";

interface ListDropdownMenuProps extends Omit<ButtonProps, "type"> {
	/**
	 * The Tiptap editor instance.
	 */
	editor?: Editor;
	/**
	 * The list types to display in the dropdown.
	 */
	types?: ListType[];
	/**
	 * Whether the dropdown should be hidden when no list types are available
	 * @default false
	 */
	hideWhenUnavailable?: boolean;
	/**
	 * Callback for when the dropdown opens or closes
	 */
	onOpenChange?: (isOpen: boolean) => void;
	/**
	 * Whether to render the dropdown menu in a portal
	 * @default false
	 */
	portal?: boolean;
}

export function ListDropdownMenu({
	editor: providedEditor,
	types = ["bulletList", "orderedList", "taskList"],
	hideWhenUnavailable = false,
	onOpenChange,
	portal = false,
	...props
}: ListDropdownMenuProps) {
	const { editor } = useTiptapEditor(providedEditor);
	const [isOpen, setIsOpen] = useState(false);

	const { filteredLists, canToggle, isActive, isVisible, Icon } =
		useListDropdownMenu({
			editor,
			types,
			hideWhenUnavailable,
		});

	const handleOnOpenChange = useCallback(
		(open: boolean) => {
			setIsOpen(open);
			onOpenChange?.(open);
		},
		[onOpenChange],
	);

	if (!isVisible || !editor || !editor.isEditable) {
		return null;
	}

	return (
		<DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					data-style="ghost"
					data-active-state={isActive ? "on" : "off"}
					role="button"
					tabIndex={-1}
					disabled={!canToggle}
					data-disabled={!canToggle}
					aria-label="List options"
					tooltip="List"
					{...props}
				>
					<Icon className="tiptap-button-icon" />
					<ChevronDownIcon className="tiptap-button-dropdown-small" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start" portal={portal}>
				<Card>
					<CardBody>
						<ButtonGroup>
							{filteredLists.map((option) => (
								<DropdownMenuItem key={option.type} asChild>
									<ListButton
										editor={editor}
										type={option.type}
										text={option.label}
										showTooltip={false}
									/>
								</DropdownMenuItem>
							))}
						</ButtonGroup>
					</CardBody>
				</Card>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
