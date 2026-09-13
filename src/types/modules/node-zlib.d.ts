// @types/node does not describe the ZIP API added in Node 26.8 yet; mirrors doc/api/zlib.md at v26.8.2
declare module "node:zlib" {
	import type { Readable } from "node:stream";

	export interface ZipEntry {
		readonly filename: string;
	}
	export const ZipEntry: {
		create(
			filename: string,
			data: Buffer | NodeJS.TypedArray | DataView | ArrayBuffer,
			options?: {
				comment?: string;
				mode?: number;
				modified?: Date;
				method?: "deflate" | "store" | "zstd";
			},
		): Promise<ZipEntry>;
	};
	export function createZipArchive(
		entries: Iterable<ZipEntry> | AsyncIterable<ZipEntry>,
		options?: string | { comment?: string; baseOffset?: number },
	): Readable;
}
