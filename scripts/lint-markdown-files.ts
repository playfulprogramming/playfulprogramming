import { json } from "node:stream/consumers";
import { spawn } from "child_process";
import { kill } from "process";
import { setTimeout } from "node:timers/promises";
import type { WarningInfo } from "#src/utils/markdown/types.ts";
import { getLanguageFromFilename } from "#src/utils/locales.ts";

const baseUrl = "http://localhost:5432";

type LintResponse = { warnings: WarningInfo[] };

async function processFile(file: string) {
	const locale = getLanguageFromFilename(file);
	const warnings: WarningInfo[] = [];

	{
		const [, author] = /^content\/([^\/]+)\/[^\/]+\.md$/.exec(file) ?? [];
		if (author) {
			console.log(`Checking author ${author}...`);
			const res: LintResponse = await fetch(`${baseUrl}/api/lint/author`, {
				method: "POST",
				body: JSON.stringify({ author, locale }),
			}).then((r) => r.json());
			warnings.push(...res.warnings);
		}
	}

	{
		const [, author, post] =
			/^content\/([^\/]+)\/posts\/([^\/]+)\/[^\/]+\.md$/.exec(file) ?? [];
		if (author && post) {
			console.log(`Checking post ${author}/${post}...`);
			const res: LintResponse = await fetch(`${baseUrl}/api/lint/post`, {
				method: "POST",
				body: JSON.stringify({ author, post, locale }),
			}).then((r) => r.json());
			warnings.push(...res.warnings);
		}
	}

	{
		const [, author, collection] =
			/^content\/([^\/]+)\/collections\/([^\/]+)\/[^\/]+\.md$/.exec(file) ?? [];
		if (author && collection) {
			console.log(`Checking collection ${author}/${collection}...`);
			const res: LintResponse = await fetch(`${baseUrl}/api/lint/collection`, {
				method: "POST",
				body: JSON.stringify({ author, collection, locale }),
			}).then((r) => r.json());
			warnings.push(...res.warnings);
		}
	}

	{
		const [, author, collection, post] =
			/^content\/([^\/]+)\/collections\/([^\/]+)\/posts\/([^\/]+)\/[^\/]+\.md$/.exec(
				file,
			) ?? [];
		if (author && collection && post) {
			console.log(`Checking post ${author}/${collection}/${post}...`);
			const res: LintResponse = await fetch(`${baseUrl}/api/lint/post`, {
				method: "POST",
				body: JSON.stringify({ author, collection, post, locale }),
			}).then((r) => r.json());
			warnings.push(...res.warnings);
		}
	}

	// If any warning is found, the lint check should fail
	if (warnings.length) {
		console.log(`[script] ${warnings.length} warnings for ${file}`);
		process.exitCode = 1;
	}
}

const changedFiles = ((await json(process.stdin)) as string[]).filter(
	(path) =>
		path.startsWith("content/") &&
		!path.startsWith("content/site/") &&
		!path.startsWith("content/data/"),
);
if (changedFiles.length === 0) {
	console.log("No changes to lint.");
	process.exit(0);
}

const devProcess = spawn("pnpm", ["run", "dev", "--port=5432"], {
	env: {
		...process.env,
		CI: "1",
		BUILD_OUTPUT: "server",
	},
	stdio: ["pipe", 1, 2],
	detached: true,
});

try {
	console.log("[script] Waiting for dev server...");
	while (true) {
		const result = await fetch(`${baseUrl}/healthz.json`).catch(
			(_) => undefined,
		);
		if (result && result.status === 200) break;
		await setTimeout(100);
	}

	for (const file of changedFiles) {
		await processFile(file);
	}
} finally {
	console.log("[script] Stopping the dev server...");
	if (devProcess.pid) kill(-devProcess.pid);
}
