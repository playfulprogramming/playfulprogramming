import { createComponent } from "../utils";
import { transformTabs } from "./rehype-transform";
import { enableTabs } from "./tabs-script";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const tabs = createComponent<Record<string, never>>()
	.withBuildTime({
		transform: transformTabs,
	})
	.withRuntime({
		componentFSPath: resolve(__dirname, "tabs.tsx"),
		// TODO: This is a global function that impacts all elements under `document`
		//       We should change this so that it only impacts the children of the comments
		setup: enableTabs,
	});
