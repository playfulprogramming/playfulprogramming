import { expect, test } from "vitest";

import { serializeInlineCall } from "./serialize-inline-call.ts";

const sampleFunction = (
	title: string,
	count: number,
	config: { wooperMode: boolean },
) => {
	console.log("rust is a must 🦀🦀🦀🦀🦀");
	return { title, count, config };
};

test("serializes a function with arguments", () => {
	const inline = serializeInlineCall(sampleFunction)("rust", 8923988932893893, {
		wooperMode: true,
	});

	expect(inline).toMatchInlineSnapshot(`
		"((title, count, config) => {
			console.log("rust is a must 🦀🦀🦀🦀🦀");
			return {
				title,
				count,
				config
			};
		})("rust",8923988932893893,{"wooperMode":true});"
	`);
});
