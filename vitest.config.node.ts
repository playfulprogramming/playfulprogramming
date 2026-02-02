import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		name: "node",
		include: ["**/*.node.spec.ts"],
		environment: "node",
	},
});
