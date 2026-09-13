import { expect, test } from "vitest";
import { unzipSync } from "fflate";
import { createZip } from "./zip.ts";

test("createZip is deterministic and round-trips its entries", async () => {
	const files = {
		"a.txt": Buffer.from("hello"),
		"dir/b.json": Buffer.from("{}"),
	};
	const [first, second] = await Promise.all([
		createZip(files),
		createZip(files),
	]);
	expect(first.equals(second)).toBe(true);

	const entries = unzipSync(new Uint8Array(first));
	expect(Object.keys(entries).sort()).toEqual(["a.txt", "dir/b.json"]);
	expect(Buffer.from(entries["a.txt"]).toString()).toBe("hello");
	expect(Buffer.from(entries["dir/b.json"]).toString()).toBe("{}");
});
