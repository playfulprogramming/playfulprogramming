// Generated with Claude Code

import * as fs from "node:fs/promises";
import { parseArgs } from "node:util";
import { spawnSync } from "node:child_process";
import { globSync } from "node:fs";
import * as path from "node:path";
import { firstDifference, report } from "./diff.ts";

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		against: { type: "string" },
		verbose: { type: "boolean", short: "v", default: false },
	},
});
function build(root: string) {
	const result = spawnSync("pnpm", ["build:local"], {
		cwd: root,
		stdio: "inherit",
		env: {
			...process.env,
			GIT_COMMIT_REF: process.env.GIT_COMMIT_REF ?? "main",
		},
	});
	if (result.status !== 0) process.exit(result.status ?? 1);
	return path.join(root, "dist");
}

const dirs = values.against
	? [values.against, process.cwd()].map((root) => build(path.resolve(root)))
	: positionals.map((dir) => path.resolve(dir));
if (dirs.length !== 2) {
	throw new Error(
		"Usage: pnpm compare:dist --against <worktree> | <before/dist> <after/dist>",
	);
}
const [before, after] = dirs;

for (const dir of [before, after]) {
	const exists = await fs.access(dir).then(
		() => true,
		() => false,
	);
	if (!exists) throw new Error(`${dir} does not exist`);
}

const unstable: Array<[RegExp, string]> = [
	[/U[0-9a-f]{32}/g, "<id>"],
	[/react-aria\d+/g, "<id>"],
	[/ uid="[^"]*"/g, ""],
	[/ data-preact-island-id="\d+"/g, ""],
	[
		/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/g,
		"<uuid>",
	],
	[/<(updated|lastBuildDate|lastmod)>[^<]*<\/\1>/g, ""],
	[/"date_modified":"[^"]*"/g, ""],
];

const text = /\.(html|json|xml|js|css|svg|txt|md)$|^api\//;

async function read(dir: string, file: string): Promise<string> {
	const bytes = await fs.readFile(path.join(dir, file)).catch((e) => {
		if (e instanceof Error && "code" in e && e.code === "ENOENT") return "";
		throw e;
	});
	if (!text.test(file)) return bytes.toString("base64");
	return unstable.reduce(
		(s, [re, to]) => s.replace(re, to),
		bytes.toString().replaceAll(path.dirname(dir), "<root>"),
	);
}

const patterns = ["**/*"];
const files = [
	...new Set(
		[before, after].flatMap((dir) =>
			globSync(patterns, { cwd: dir, withFileTypes: true })
				.filter(
					(entry) => entry.isFile() && !entry.parentPath.includes("/_astro"),
				)
				.map((entry) =>
					path.relative(dir, path.join(entry.parentPath, entry.name)),
				),
		),
	),
].toSorted();
const random =
	/^(?:[a-z-]+\/)?(?:about\/)?index\.html$|^collections\/[^/]+\/index\.html$|\.epub$/;
const changed: string[] = [];
let skipped = 0;
for (const file of files) {
	if (!values.verbose && random.test(file)) {
		skipped++;
		continue;
	}
	const [a, b] = await Promise.all([read(before, file), read(after, file)]);
	if (a === b) continue;
	changed.push(file);
	if (changed.length <= 10) console.log(`${file} ${firstDifference(a, b)}\n`);
}
if (skipped) {
	console.log(
		`skipped ${skipped} files with baked-in randomness (index, about, collections, epubs); pass -v to compare them`,
	);
}
const byDir = Map.groupBy(changed, (file) => path.dirname(file).split("/")[0]);
console.log(
	[...byDir].map(([dir, list]) => `${dir} ${list.length}`).join(", "),
);
report(changed, files.length, "files");
