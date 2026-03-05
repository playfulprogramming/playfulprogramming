import { json } from "node:stream/consumers";
import { spawn } from "child_process";
import { kill } from "process";
import { setTimeout } from "node:timers/promises";
import type { WarningInfo } from "#src/utils/markdown/types.ts";

const changedFiles = (await json(process.stdin)) as string[];

const devProcess = spawn("pnpm", ["run", "dev", "--port=5432"], {
	env: {
		...process.env,
		CI: "1",
		BUILD_OUTPUT: "server",
	},
	stdio: ["pipe", 1, 2],
	detached: true,
});

console.log("[script] Waiting for dev server...");
while (true) {
	const result = await fetch("http://localhost:5432/healthz.json").catch(
		(_) => undefined,
	);
	if (result && result.status === 200) break;
	await setTimeout(100);
}

for (const file of changedFiles) {
	const url = new URL("http://localhost:5432/api/lint-report.json");
	url.searchParams.set("file", file);
	const buildReport = (await fetch(url).then((r) => r.json())) as {
		warnings: WarningInfo[];
	};

	// If any warning is found, the lint check should fail
	if (buildReport.warnings.length) {
		console.log(`[script] ${buildReport.warnings.length} warnings for ${file}`);
		process.exitCode = 1;
	}
}

console.log("[script] Stopping the dev server...");
if (devProcess.pid) kill(-devProcess.pid);
