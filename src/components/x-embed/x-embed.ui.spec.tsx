import { expect, test } from "#src/ui-test-utils/index.ts";
import { render } from "@testing-library/preact";
import { XEmbedPlaceholder } from "./x-embed.tsx";

test("keeps the ordinal day suffix in English post dates", () => {
	const { getByText } = render(
		<XEmbedPlaceholder
			locale="en"
			text="Post text"
			profilePic="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
			date="2023-06-28T12:00:00"
			handle="playful_program"
			name="Playful Programming"
			link="https://x.com/playful_program/status/1"
		/>,
	);

	expect(getByText("Jun 28th, 2023")).toBeInTheDocument();
});
