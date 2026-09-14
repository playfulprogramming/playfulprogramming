import { ZipEntry, createZipArchive } from "node:zlib";
import { buffer } from "node:stream/consumers";

const modified = new Date("1981-01-01 0:00 UTC");

export async function createZip(
	files: Record<string, Buffer>,
): Promise<Buffer> {
	const entries = await Promise.all(
		Object.entries(files).map(([name, data]) =>
			ZipEntry.create(name, data, { modified }),
		),
	);
	return buffer(createZipArchive(entries));
}
