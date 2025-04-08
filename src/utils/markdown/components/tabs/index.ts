import { COMPONENT_FOLDER, createComponent } from "../utils";
import { transformTabs } from "./rehype-transform";
import { enableTabs } from "./tabs-script";
import { resolve } from "node:path";

export const tabs = createComponent<Record<string, never>>()
	.withBuildTime({
		transform: transformTabs,
	})
	.withRuntime({
		componentFSPath: resolve(COMPONENT_FOLDER, "./tabs/tabs.tsx"),
		// TODO: This is a global function that impacts all elements under `document`
		//       We should change this so that it only impacts the children of the comments
		setup: enableTabs,
	});
