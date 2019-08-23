import React from "react"
import { render } from "@testing-library/react"
import { siteMetadata } from "../../__mocks__/data/mock-site-metadata"
import { MockPost } from "../../__mocks__/data/mock-post"
import { useStaticQuery } from "gatsby"
import { MockUnicorn } from "../../__mocks__/data/mock-unicorn"
import BlogProfile from "./blog-profile"

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

test("Blog profile page renders", async () => {
  const { baseElement } = render(
  <BlogProfile
    data={{
      site: {
        siteMetadata
      },
      unicornsJson: MockUnicorn,
      allMarkdownRemark: {
        totalCount: 1,
        edges: [{
          node: MockPost
        }]
      },
    }}
    location={{
      pathname: '/post/this-post-name-here'
    }}
  />)

  expect(baseElement).toBeInTheDocument();
})

