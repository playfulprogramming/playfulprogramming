import { genId } from "../getNewId";

test("genId generates unique IDs", async () => {
	const id1 = genId();
	const id2 = genId();
	const id3 = genId();
	expect(id1 !== id2).toBe(true);
	expect(id2 !== id3).toBe(true);
	expect(id1 !== id3).toBe(true);
});
