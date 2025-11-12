import { Context, FunctionComponent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import {
	EditorContent as _EditorContent,
	EditorContentProps,
	EditorContext as _EditorContext,
	EditorContextValue,
	useEditor,
} from "@tiptap/react";

const EditorContent =
	_EditorContent as never as FunctionComponent<EditorContentProps>;

const EditorContext = _EditorContext as Context<EditorContextValue>;

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";

// --- UI Primitives ---
import { Button } from "./components/tiptap-ui-primitive/button";
import { Spacer } from "./components/tiptap-ui-primitive/spacer";
import {
	Toolbar,
	ToolbarGroup,
	ToolbarSeparator,
} from "./components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "./components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "./components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "./components/tiptap-node/blockquote-node/blockquote-node.scss";
import "./components/tiptap-node/code-block-node/code-block-node.scss";
import "./components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "./components/tiptap-node/list-node/list-node.scss";
import "./components/tiptap-node/image-node/image-node.scss";
import "./components/tiptap-node/heading-node/heading-node.scss";
import "./components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "./components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "./components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "./components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "./components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "./components/tiptap-ui/code-block-button";
import {
	LinkPopover,
	LinkContent,
	LinkButton,
} from "./components/tiptap-ui/link-popover";
import { MarkButton } from "./components/tiptap-ui/mark-button";
import { UndoRedoButton } from "./components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "./components/tiptap-icons/arrow-left-icon";
import { LinkIcon } from "./components/tiptap-icons/link-icon";

// --- Hooks ---
import { useIsBreakpoint } from "./hooks/use-is-breakpoint";
import { useWindowSize } from "./hooks/use-window-size";
import { useCursorVisibility } from "./hooks/use-cursor-visibility";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "./lib/tiptap-utils";

// --- Styles ---
import "./editor-page.scss";

import content from "./data/content.json";

const MainToolbarContent = ({
	onLinkClick,
	isMobile,
}: {
	onLinkClick: () => void;
	isMobile: boolean;
}) => {
	return (
		<>
			<Spacer />

			<ToolbarGroup>
				<UndoRedoButton action="undo" />
				<UndoRedoButton action="redo" />
			</ToolbarGroup>

			<ToolbarSeparator />

			<ToolbarGroup>
				<HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
				<ListDropdownMenu
					types={["bulletList", "orderedList", "taskList"]}
					portal={isMobile}
				/>
				<BlockquoteButton />
				<CodeBlockButton />
			</ToolbarGroup>

			<ToolbarSeparator />

			<ToolbarGroup>
				<MarkButton type="bold" />
				<MarkButton type="italic" />
				<MarkButton type="strike" />
				<MarkButton type="code" />
				<MarkButton type="underline" />
				{!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
			</ToolbarGroup>

			<ToolbarSeparator />

			<ToolbarGroup>
				<MarkButton type="superscript" />
				<MarkButton type="subscript" />
			</ToolbarGroup>

			<ToolbarSeparator />

			<ToolbarGroup>
				<ImageUploadButton text="Add" />
			</ToolbarGroup>

			<Spacer />

			{isMobile && <ToolbarSeparator />}
		</>
	);
};

const MobileToolbarContent = ({
	type,
	onBack,
}: {
	type: "link";
	onBack: () => void;
}) => (
	<>
		<ToolbarGroup>
			<Button data-style="ghost" onClick={onBack}>
				<ArrowLeftIcon className="tiptap-button-icon" />
				<LinkIcon className="tiptap-button-icon" />
			</Button>
		</ToolbarGroup>

		<ToolbarSeparator />

		<LinkContent />
	</>
);

export function EditorPage() {
	const isMobile = useIsBreakpoint();
	const { height } = useWindowSize();
	const [mobileView, setMobileView] = useState<"main" | "link">("main");
	const toolbarRef = useRef<HTMLDivElement>(null);

	const editor = useEditor({
		immediatelyRender: false,
		editorProps: {
			attributes: {
				autocomplete: "off",
				autocorrect: "off",
				autocapitalize: "off",
				"aria-label": "Main content area, start typing to enter text.",
				class: "simple-editor",
			},
		},
		extensions: [
			StarterKit.configure({
				horizontalRule: false,
				link: {
					openOnClick: false,
					enableClickSelection: true,
				},
			}),
			HorizontalRule,
			TaskList,
			TaskItem.configure({ nested: true }),
			Image,
			Superscript,
			Subscript,
			Selection,
			ImageUploadNode.configure({
				accept: "image/*",
				maxSize: MAX_FILE_SIZE,
				limit: 3,
				upload: handleImageUpload,
				onError: (error) => console.error("Upload failed:", error),
			}),
		],
		content,
	});

	const rect = useCursorVisibility({
		editor,
		overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
	});

	useEffect(() => {
		if (!isMobile && mobileView !== "main") {
			setMobileView("main");
		}
	}, [isMobile, mobileView]);

	return (
		<div>
			<EditorContext.Provider value={{ editor }}>
				<Toolbar
					ref={toolbarRef}
					style={{
						...(isMobile
							? {
									bottom: `calc(100% - ${height - rect.y}px)`,
								}
							: {}),
					}}
				>
					{mobileView === "main" ? (
						<MainToolbarContent
							onLinkClick={() => setMobileView("link")}
							isMobile={isMobile}
						/>
					) : (
						<MobileToolbarContent
							type={"link"}
							onBack={() => setMobileView("main")}
						/>
					)}
				</Toolbar>

				<EditorContent
					editor={editor}
					role="presentation"
					className="simple-editor-content"
				/>
			</EditorContext.Provider>
		</div>
	);
}
