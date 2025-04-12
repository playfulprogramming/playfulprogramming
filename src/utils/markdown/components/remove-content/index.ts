import { COMPONENT_FOLDER, createComponent } from "../utils";
import { resolve } from "node:path";

export const removeContent = createComponent<Record<string, never>>()
	.withBuildTime({
		transform: () => ({}),
	})
	.withRuntime({
		componentFSPath: resolve(COMPONENT_FOLDER, "./remove-content/remove-content.tsx"),
	});
