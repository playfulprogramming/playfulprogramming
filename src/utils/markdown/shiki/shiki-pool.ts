import type { Element } from "hast";
import fs from "fs/promises";
import esbuild from "esbuild";
import { join } from "path";
import { Tinypool } from "tinypool";

const WORKER_DIR_PREFIX = ".tmp-shiki-worker-";

for (const file of await fs.readdir(process.cwd())) {
	if (file.startsWith(WORKER_DIR_PREFIX)) {
		await fs.rm(file, { recursive: true });
	}
}

const inputFileName = join(process.cwd(), "src/utils/markdown/shiki/worker.ts");
const workerDir = await fs.mkdtemp(join(process.cwd(), WORKER_DIR_PREFIX));
const workerFile = join(workerDir, "index.js");
const { errors, warnings } = await esbuild.build({
	tsconfigRaw: {},
	outfile: workerFile,
	entryPoints: [inputFileName],
	bundle: true,
	minify: false,
	format: "esm",
	packages: "external",
});

if (warnings.length) {
	console.warn(warnings);
}

if (errors.length) {
	console.error(errors);
	process.exit(1);
}

const tinypool = new Tinypool({
	filename: workerFile,
	minThreads: 0,
	idleTimeout: 60 * 1000, // 60 seconds
	maxMemoryLimitBeforeRecycle: 500_000_000, // 500MB
});

export async function runShiki(node: Element): Promise<Element> {
	return (await tinypool.run(node)) as Element;
}
