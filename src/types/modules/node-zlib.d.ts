// createZipArchive is experimental, TODO remove when api is stabilized or node types are updated to 26.8
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
