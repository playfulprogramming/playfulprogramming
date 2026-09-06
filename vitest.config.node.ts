import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		name: "node",
		include: ["**/*.node.spec.ts"],
		environment: "node",
	},
});
