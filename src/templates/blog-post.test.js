import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { siteMetadata } from "../../__mocks__/data/mock-site-metadata";
import { MockMultiAuthorPost, MockPost } from "../../__mocks__/data/mock-post";
import BlogPostTemplate from "./blog-post";
import { onLinkClick, useStaticQuery } from "gatsby";
import ReactDOMServer from "react-dom/server";
import { axe } from "jest-axe";

beforeAll(() => {
	useStaticQuery.mockImplementation(() => ({
		site: {
			siteMetadata
		}
	}));
});

afterAll(() => {
	useStaticQuery.mockImplementation(jest.fn());
});

const getElement = (post = MockPost) => (
	<BlogPostTemplate
		data={{
			site: {
				siteMetadata
			},
			markdownRemark: post
		}}
		location={{
			pathname: "/post/this-post-name-here"
		}}
	/>
);

test("Blog post page renders", async () => {
	const { baseElement, findByText, findByTestId } = render(getElement());

	expect(baseElement).toBeInTheDocument();

	// Shows post title
	expect(await findByText("Post title")).toBeInTheDocument();
	// Show a subtitle?
	// Shows post metadata
	expect(await findByText("Joe")).toBeInTheDocument();
	expect(await findByText("10-10-2010")).toBeInTheDocument();
	expect(await findByText("10000 words")).toBeInTheDocument();
	const authorName = await findByTestId("post-meta-author-name");
	expect(authorName).toHaveTextContent("Joe");
	// Because the links act as spans, we're wanting to find by text in this instance
	fireEvent.click(await findByText("Joe"));
	expect(onLinkClick).toHaveBeenCalledTimes(1);
	fireEvent.click(await findByTestId("author-pic-0"));
	expect(onLinkClick).toHaveBeenCalledTimes(2);

	// Renders the post body properly
	expect((await findByTestId("post-body-div")).innerHTML).toBe(
		"<div>Hey there</div>"
	);
});

test("Blog post page handles two authors", async () => {
	const { baseElement, findByText, findByTestId } = render(
		getElement(MockMultiAuthorPost)
	);

	expect(baseElement).toBeInTheDocument();

	// Shows post title
	expect(await findByText("Another post title")).toBeInTheDocument();
	// Show a subtitle?
	// Shows post metadata
	const dianeNameEl = await findByText("Diane");
	const joeNameEl = await findByText("Joe");
	expect(dianeNameEl).toBeInTheDocument();
	expect(joeNameEl).toBeInTheDocument();
	expect(await findByText("10-20-2010")).toBeInTheDocument();
	expect(await findByText("100000 words")).toBeInTheDocument();
	fireEvent.click(dianeNameEl);
	expect(onLinkClick).toHaveBeenCalledTimes(1);
	fireEvent.click(joeNameEl);
	expect(onLinkClick).toHaveBeenCalledTimes(2);
	fireEvent.click(await findByTestId("author-pic-0"));
	expect(onLinkClick).toHaveBeenCalledTimes(3);
	fireEvent.click(await findByTestId("author-pic-1"));
	expect(onLinkClick).toHaveBeenCalledTimes(4);

	// Renders the post body properly
	expect((await findByTestId("post-body-div")).innerHTML).toBe(
		"<div>Hello, friends</div>"
	);
});

test.todo("SEO should apply");
test.todo("Shows post footer image");

test("Blog post page should not have axe errors", async () => {
	const html = ReactDOMServer.renderToString(getElement());
	const results = await axe(html);
	expect(results).toHaveNoViolations();
});
