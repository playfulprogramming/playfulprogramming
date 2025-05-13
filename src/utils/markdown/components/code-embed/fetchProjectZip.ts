import { zip } from "fflate";
import * as fs from "fs/promises";
import * as crypto from "crypto";
import { basename, join } from "path";

async function fetchProjectZipInternal(dir: string): Promise<string> {
	const projectSlug = basename(dir);
	const files = await fs.readdir(dir, { recursive: true });
	const zipFiles: Record<string, Buffer> = {};
	for (const file of files) {
		const absoluteFile = join(dir, file);
		const stat = await fs.stat(absoluteFile);
		if (stat.isFile()) {
			const buffer = await fs.readFile(absoluteFile);
			zipFiles[file] = buffer;
		}
	}

	const zipBuffer: Uint8Array = await new Promise((res, rej) => {
		zip(
			zipFiles,
			{ consume: true, level: 9, mtime: new Date("1981-01-01 0:00 UTC") },
			(err, data) => {
				if (data) res(data);
				else rej(err);
			},
		);
	});

	const hash = crypto.createHash("md5").update(zipBuffer).digest("hex");
	const fileName = `${projectSlug}_${hash}.zip`;

	await fs.mkdir(join("public", "generated", "projects"), { recursive: true });
	await fs.writeFile(
		join("public", "generated", "projects", fileName),
		zipBuffer,
	);
	return "/generated/projects/" + fileName;
}

const cache = new Map<string, string>();

export async function fetchProjectZip(dir: string): Promise<string> {
	const existing = cache.get(dir);
	if (existing) {
		return existing;
	}

	const result = await fetchProjectZipInternal(dir);
	cache.set(dir, result);
	return result;
}
