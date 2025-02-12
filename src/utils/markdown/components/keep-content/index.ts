import { createComponent } from "../utils";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const keepContent = createComponent<Record<string, never>>()
	.withBuildTime({
		transform: ({ children }) => ({ children }),
	})
	.withRuntime({
		componentFSPath: resolve(__dirname, "remove-content.tsx"),
	});
