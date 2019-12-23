/**
 * This test is in the `__tests__` directory
 */
import React from "react";
import { fireEvent, render } from "@testing-library/react";
import ReactDOMServer from "react-dom/server";
import { axe } from "jest-axe";
import {
	onLinkClick as onGarsbyLinkClick,
	onLinkClick,
	useStaticQuery
} from "gatsby";
import { siteMetadata } from "../../__mocks__/data/mock-site-metadata";
import { MockMultiAuthorPost, MockPost } from "../../__mocks__/data/mock-post";
import { MockUnicorn } from "../../__mocks__/data/mock-unicorn";
import BlogPostList from "./post-list";

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

const getElement = () => (
	<BlogPostList
		pageContext={{
			limitNumber: 8,
			skipNumber: 0,
			pageIndex: 1,
			numberOfPages: 1,
			relativePath: ""
		}}
		data={{
			site: {
				siteMetadata
			},
			unicornsJson: MockUnicorn,
			allMarkdownRemark: {
				totalCount: 1,
				edges: [
					{
						node: MockPost
					},
					{
						node: MockMultiAuthorPost
					}
				]
			},
			file: {
				childImageSharp: {
					smallPic: {
						fixed:
							"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
					}
				}
			}
		}}
		location={{
			pathname: "/post/this-post-name-here"
		}}
	/>
);

test("Blog index page renders", async () => {
	const { baseElement, findByText, findAllByTestId } = render(getElement());

	expect(baseElement).toBeInTheDocument();
	fireEvent.click(await findByText("Read More"));
	expect(onLinkClick).toHaveBeenCalledTimes(1);

	// Post cards
	expect(await findByText("10-10-2010")).toBeInTheDocument();
	expect(
		await findByText(
			"This is a short description dunno why this would be this short"
		)
	).toBeInTheDocument();

	fireEvent.click(await findByText("Post title"));
	expect(onLinkClick).toHaveBeenCalledTimes(3);

	const authorImgs = await findAllByTestId("author-pic-0");
	fireEvent.click(authorImgs[0]);
	expect(onGarsbyLinkClick).toHaveBeenCalledTimes(5);
});

test("Blog index page should not have axe errors", async () => {
	const html = ReactDOMServer.renderToString(getElement());
	const results = await axe(html);
	expect(results).toHaveNoViolations();
});
