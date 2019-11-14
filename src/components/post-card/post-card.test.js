import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { PostCard } from "./post-card";
import { MockPost } from "../../../__mocks__/data/mock-post";
import { onLinkClick } from "gatsby";

const {
	frontmatter: { tags, authors, title, published, description },
	excerpt,
	fields: { slug }
} = MockPost;

describe("Post card", () => {
	test("Renders with the expected text and handles clicks properly", async () => {
		const { baseElement, findByText, findByTestId } = render(
			<PostCard
				title={title}
				authors={authors}
				published={published}
				tags={tags}
				excerpt={excerpt}
				slug={slug}
			/>
		);

		expect(baseElement).toBeInTheDocument();
		expect(await findByText("10-10-2010")).toBeInTheDocument();
		expect(await findByText("item1")).toBeInTheDocument();
		expect(
			await findByText(
				"This would be an auto generated excerpt of the post in particular"
			)
		).toBeInTheDocument();

		fireEvent.click(await findByText("Post title"));
		expect(onLinkClick).toHaveBeenCalledTimes(2);

		fireEvent.click(await findByTestId("author-pic-0"));
		expect(onLinkClick).toHaveBeenCalledTimes(4);
	});

	test("renders the description rather then excerpt", async () => {
		const { findByText } = render(
			<PostCard
				title={title}
				authors={authors}
				published={published}
				tags={tags}
				excerpt={excerpt}
				description={description}
				slug={slug}
			/>
		);

		expect(
			await findByText(
				"This is a short description dunno why this would be this short"
			)
		).toBeInTheDocument();
	});
});
