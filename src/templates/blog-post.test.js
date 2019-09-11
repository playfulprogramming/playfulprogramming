import React from "react"
import { fireEvent, render } from "@testing-library/react"
import { siteMetadata } from "../../__mocks__/data/mock-site-metadata"
import { MockPost } from "../../__mocks__/data/mock-post"
import BlogPostTemplate from "./blog-post"
import { onLinkClick, useStaticQuery } from "gatsby"
import ReactDOMServer from 'react-dom/server';
import { axe } from 'jest-axe';

beforeAll(() => {
  useStaticQuery.mockImplementation(() => ({
    site: {
      siteMetadata
    }
  }))
})

afterAll(() => {
  useStaticQuery.mockImplementation(jest.fn())
})

const getElement = () => (
  <BlogPostTemplate
    data={{
      site: {
        siteMetadata
      },
      markdownRemark: MockPost,
    }}
    location={{
      pathname: '/post/this-post-name-here'
    }}
  />
)

test("Blog post page renders", async () => {
  const { baseElement, findByText, findByTestId } = render(getElement())

  expect(baseElement).toBeInTheDocument();

  // Shows post title
  expect(await findByText('Post title')).toBeInTheDocument();
  // Show a subtitle?
  // Shows post metadata
  expect(await findByText('Joe')).toBeInTheDocument();
  expect(await findByText('10-10-2010')).toBeInTheDocument();
  expect(await findByText('10000 words')).toBeInTheDocument();
  const authorName = await findByTestId('post-meta-author-name');
  expect(authorName).toHaveTextContent('Joe');
  fireEvent.click(authorName);
  expect(onLinkClick).toHaveBeenCalledTimes(1);
  fireEvent.click(await findByTestId('post-meta-author-pic'));
  expect(onLinkClick).toHaveBeenCalledTimes(2);

  // Renders the post body properly
  expect((await findByTestId('post-body-div')).innerHTML).toBe('<div>Hey there</div>');
})

test.todo("SEO should apply");
test.todo("Shows post footer image")


test("Blog post page should not have axe errors", async () => {
  const html = ReactDOMServer.renderToString(getElement());
  const results = await axe(html);
  expect(results).toHaveNoViolations();
});
