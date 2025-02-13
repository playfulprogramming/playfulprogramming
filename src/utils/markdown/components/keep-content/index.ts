import { COMPONENT_FOLDER, createComponent } from "../utils";
import { resolve } from "node:path";

export const keepContent = createComponent<Record<string, never>>()
	.withBuildTime({
		transform: ({ children }) => ({ children }),
	})
	.withRuntime({
		componentFSPath: resolve(COMPONENT_FOLDER, "./keep-content/keep-content.tsx"),
	});
