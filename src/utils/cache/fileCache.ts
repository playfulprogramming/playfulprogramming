import * as path from "path";
import { promises as fs } from "fs";
import { createHash } from "crypto";

const cacheDir = path.join(
	process.cwd(),
	"node_modules/unicorn-utterances/.cache",
);
await fs.mkdir(cacheDir, { recursive: true });

export function hashObjectMd5(params: object) {
	const str = JSON.stringify({ ...params });
	const md5 = createHash("md5").update(str).digest("hex");
	return md5;
}

export function getPath(params: object, filename: string) {
	const key = hashObjectMd5(params);
	const ext = path.extname(filename);
	const file = path.basename(filename).slice(0, -ext.length) + "." + key + ext;
	return path.join(cacheDir, file);
}

export async function exists(
	params: object,
	filename: string,
): Promise<boolean> {
	const path = getPath(params, filename);
	return await fs
		.stat(path)
		.then((_) => true)
		.catch((_) => false);
}

export async function retrieve(
	params: object,
	filename: string,
	dest: string,
): Promise<void> {
	const path = getPath(params, filename);
	await fs.copyFile(path, dest);
}

export async function store(
	params: object,
	filename: string,
	src: string,
): Promise<void> {
	const path = getPath(params, filename);
	await fs.copyFile(src, path);
}
