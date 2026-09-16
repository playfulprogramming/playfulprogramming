// createZipArchive is experimental, TODO remove when api is stabilized or node types are updated to 26.8
declare module "node:zlib" {
	import type { Readable } from "node:stream";

	export interface ZipEntry {
		readonly name: string;
	}
	export const ZipEntry: {
		create(
			name: string,
			data: Uint8Array,
			options?: { modified?: Date },
		): Promise<ZipEntry>;
	};
	export function createZipArchive(entries: Iterable<ZipEntry>): Readable;
}
