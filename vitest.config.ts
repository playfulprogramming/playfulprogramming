import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		projects: ["./vitest.config.*.ts"],
	},
});
