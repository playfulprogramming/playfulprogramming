import { COMPONENT_FOLDER, createComponent } from "../utils";
import { transformFileTree } from "./rehype-transform";
import { resolve } from "node:path";

export const fileTree = createComponent<Record<string, never>>()
	.withBuildTime({
		transform: transformFileTree,
	})
	.withRuntime({
		componentFSPath: resolve(COMPONENT_FOLDER, "./filetree/file-list.tsx"),
	});
