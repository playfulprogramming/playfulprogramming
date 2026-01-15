import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		exclude: [
			"**/content/**",
			"**/node_modules/**",
			"**/dist/**",
			"**/cypress/**",
			"**/e2e-tests/**",
			"**/.{idea,git,cache,output,temp}/**",
			"**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
		],
		projects: ["./vitest.config.*.ts"],
	},
});
