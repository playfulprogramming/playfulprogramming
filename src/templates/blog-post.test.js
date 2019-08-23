import React from "react"
import { render } from "@testing-library/react"
import { siteMetadata } from "../../__mocks__/data/mock-site-metadata"
import { MockPost } from "../../__mocks__/data/mock-post"
import BlogPostTemplate from "./blog-post"
import { useStaticQuery } from "gatsby"

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

test("Blog post page renders", async () => {
  const { baseElement, findByText, findByTestId } = render(
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
  />)

  expect(baseElement).toBeInTheDocument();

  // Shows post title
  expect(await findByText('Post title')).toBeInTheDocument();
  // Show a subtitle?
  // Shows post metadata
  expect(await findByText('Joe')).toBeInTheDocument();
  expect(await findByText('10-10-2010')).toBeInTheDocument();
  expect(await findByText('10000 words')).toBeInTheDocument();
  expect(await findByTestId('post-meta-author-name')).toHaveTextContent('Joe');
  // Renders the post body properly
  expect((await findByTestId('post-body-div')).innerHTML).toBe('<div>Hey there</div>');
})

test.todo("SEO should apply");
test.todo("Shows post footer image")
