/**
 * This test is in the `__tests__` directory
 */
import React from "react"
import { fireEvent, render } from "@testing-library/react"
import { siteMetadata } from "../../../__mocks__/data/mock-site-metadata"
import { MockPost } from "../../../__mocks__/data/mock-post"
import { useStaticQuery } from "gatsby"
import { MockUnicorn } from "../../../__mocks__/data/mock-unicorn"
import {onLinkClick} from 'gatsby';
import BlogIndex from "../index"

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
  const { baseElement, findByText, findByTestId } = render(
  <BlogIndex
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
      file: {
        childImageSharp: {
          smallPic: {
            fixed: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
          },
        }
      }
    }}
    location={{
      pathname: '/post/this-post-name-here'
    }}
  />)

  expect(baseElement).toBeInTheDocument();
  fireEvent.click(await findByText('Read More'));
  expect(onLinkClick).toHaveBeenCalledTimes(1)

  // Post cards
  expect(await findByText("by Joe")).toBeInTheDocument();
  expect(await findByText('10-10-2010')).toBeInTheDocument();
  expect(await findByText('This is a short description dunno why this would be this short')).toBeInTheDocument();

  fireEvent.click(await findByText("Post title"));
  expect(onLinkClick).toHaveBeenCalledTimes(3);

  fireEvent.click(await findByTestId("authorPic"));
  expect(onLinkClick).toHaveBeenCalledTimes(5);
})
