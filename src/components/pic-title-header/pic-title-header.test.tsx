import React from "react";
import { render } from "@testing-library/react";
import { PicTitleHeader } from "./pic-title-header";

test("Renders with the expected text", async () => {
	const { baseElement, findByText } = render(
		<PicTitleHeader
			image={
				"https://unicorn-utterances.com/static/e32c87870d4630382a9dae8cae941af6/5f3f7/unicorn-utterances-logo-512.png"
			}
			socials={{
				website: "http://google.com"
			}}
			title={"User"}
			description={"Description"}
			profile={true}
		/>
	);

	expect(baseElement).toBeInTheDocument();
	expect(await findByText("User")).toBeInTheDocument();
	expect(await findByText("Description")).toBeInTheDocument();
	expect(await findByText("Website")).toBeInTheDocument();
});
