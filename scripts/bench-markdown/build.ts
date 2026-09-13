// Generated with Claude Code

import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import esbuild, { type Plugin } from "esbuild";
import { Type } from "typebox";
import Value from "typebox/value";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
const tmpDir = path.join(repoRoot, ".tmp-bench-markdown");

const { values: options, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		against: { type: "string" },
		full: { type: "boolean", default: false },
		profile: { type: "boolean", default: false },
		iterations: { type: "string", default: "15" },
		runs: { type: "string", default: "3" },
		help: { type: "boolean", short: "h", default: false },
	},
});

if (options.help) {
	console.log(`pnpm bench:markdown [slug...]        time each pipeline pass (all posts, or the given ones)
pnpm bench:markdown --against <dir>  run in that checkout first, then here: pass timings
                                     side by side and whether each post's output changed
pnpm compare:dist --against <dir>    build there and here, compare the two dist trees
pnpm compare:dist <before> <after>   same for two existing dist directories

Exit 1 when any output differs. compare:dist skips pages that shuffle content
with Math.random (index, about, collections) unless -v is passed.

  --full             print the first difference of each changed post
  --iterations N     timed runs per post (default 15)
  --runs N           with --against, alternate between the two checkouts N times
                     and report per-pass medians across them (default 3)
  --profile          write a V8 .cpuprofile to .tmp-bench-markdown/profiles/`);
	process.exit(0);
}

function stub(
	root: string,
	name: string,
	filter: RegExp,
	contents: string,
): Plugin {
	return {
		name,
		setup(build) {
			build.onResolve({ filter }, (args) => ({
				path: args.path,
				namespace: name,
			}));
			build.onLoad({ filter: /.*/, namespace: name }, () => ({
				contents,
				loader: "js",
				resolveDir: root,
			}));
		},
	};
}

const PackageJson = Type.Object({
	imports: Type.Record(Type.String(), Type.String()),
});

async function run(
	root: string,
	mode: "none" | "write" | "compare",
	final = true,
) {
	const paraglide = spawnSync("pnpm", ["run", "paraglide:compile"], {
		cwd: root,
		stdio: ["ignore", "ignore", "inherit"],
	});
	if (paraglide.status !== 0) {
		console.error(`paraglide:compile failed in ${root}`);
		process.exit(paraglide.status ?? 1);
	}
	const pkg = Value.Parse(
		PackageJson,
		JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf-8")),
	);
	const alias = Object.fromEntries(
		Object.entries(pkg.imports).map(([from, to]) => [
			from.replace(/\/\*$/, ""),
			path.join(root, to.replace(/\/\*$/, "")),
		]),
	);
	const bundlePath = path.join(root, ".tmp-bench-markdown/index.js");
	await esbuild.build({
		entryPoints: [path.join(repoRoot, "scripts/bench-markdown/entry.ts")],
		outfile: bundlePath,
		bundle: true,
		packages: "external",
		format: "esm",
		platform: "node",
		jsx: "automatic",
		absWorkingDir: root,
		alias,
		plugins: [
			stub(
				root,
				"hoof-stub",
				/hoof\/(index|get-url-metadata|get-post-images)\.ts$/,
				`export async function getUrlMetadata() {
					return {
						title: "Stub Title",
						icon: { src: "/favicon.png", width: 32, height: 32 },
						banner: { src: "/share-banner.png", width: 1200, height: 630 },
					};
				}
				export async function getPostImages() { return {}; }`,
			),
			stub(root, "astro-stub", /\.astro$/, "export default function Stub() {}"),
			stub(root, "asset-url-stub", /\?url$/, 'export default "/stub-asset";'),
			stub(
				root,
				"shiki-pool-stub",
				/shiki-pool\.ts$/,
				`export { default as runShiki } from "./src/utils/markdown/shiki/worker.ts";`,
			),
		],
		logLevel: "warning",
	});

	const nodeArgs = options.profile
		? ["--cpu-prof", `--cpu-prof-dir=${path.join(tmpDir, "profiles", mode)}`]
		: [];
	const child = spawnSync(process.execPath, [...nodeArgs, bundlePath], {
		cwd: root,
		stdio: ["inherit", "inherit", "pipe"],
		encoding: "utf-8",
		maxBuffer: 1024 ** 3,
		env: {
			...process.env,
			MODE: process.env.MODE ?? "preview",
			GIT_COMMIT_REF: process.env.GIT_COMMIT_REF ?? "main",
			BENCH_ARGS: JSON.stringify({
				targets: positionals,
				iterations: Number(options.iterations),
				full: options.full,
				mode,
				final,
				snapshot: path.join(tmpDir, "snapshot"),
			}),
		},
	});
	const log = path.join(tmpDir, `${mode}.stderr.log`);
	await fs.writeFile(log, child.stderr);
	if (child.status !== 0) {
		console.error(child.stderr);
		process.exit(child.status ?? 1);
	}
	if (child.stderr) console.log(`pipeline warnings written to ${log}`);
}

if (options.against) {
	const against = path.resolve(options.against);
	const installed = await fs.access(path.join(against, "node_modules")).then(
		() => true,
		() => false,
	);
	if (!installed) {
		throw new Error(`${against} has no node_modules; run pnpm install there`);
	}
	await fs.rm(path.join(tmpDir, "snapshot"), { recursive: true, force: true });
	const runs = Value.Parse(Type.Integer({ minimum: 1 }), Number(options.runs));
	for (let i = 1; i <= runs; i++) {
		console.log(`\n== ${against} (${i}/${runs})`);
		await run(against, "write", false);
		console.log(`\n== ${repoRoot} (${i}/${runs})`);
		await run(repoRoot, "compare", i === runs);
	}
} else {
	await run(repoRoot, "none");
}
