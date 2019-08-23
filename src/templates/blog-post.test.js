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
  const { baseElement } = render(
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
})