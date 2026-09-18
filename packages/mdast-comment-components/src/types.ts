import type { Parent, RootContent } from "mdast";
import type { Position } from "unist";

export interface CommentComponent extends Parent {
	type: "commentComponent";
	component: string;
	attributes: Record<string, string>;
	form: "ranged" | "standalone";
	children: RootContent[];
}

export interface CommentComponentDiagnostic {
	ruleId:
		| "missing-close"
		| "unexpected-close"
		| "mismatched-close"
		| "invalid-marker";
	message: string;
	severity: "error";
	position: Position;
}

declare module "mdast" {
	interface BlockContentMap {
		commentComponent: CommentComponent;
	}
	interface RootContentMap {
		commentComponent: CommentComponent;
	}
	interface RootData {
		commentComponentDiagnostics?: CommentComponentDiagnostic[];
	}
}
