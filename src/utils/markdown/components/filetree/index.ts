import { createComponent } from "../utils";
import { transformFileTree } from "./rehype-transform";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const fileTree = createComponent<Record<string, never>>()
	.withBuildTime({
		transform: transformFileTree,
	})
	.withRuntime({
		componentFSPath: resolve(__dirname, "file-list.tsx"),
	});
