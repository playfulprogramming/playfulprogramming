import type { Parent, RootContent } from "mdast";
import type { Position } from "unist";

export interface PlayfulComponent extends Parent {
	type: "playfulComponent";
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
		playfulComponent: PlayfulComponent;
	}
	interface RootContentMap {
		playfulComponent: PlayfulComponent;
	}
	interface RootData {
		commentComponentDiagnostics?: CommentComponentDiagnostic[];
	}
}
