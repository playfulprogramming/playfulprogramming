import React from "react"
import { fireEvent, render } from "@testing-library/react"
import { siteMetadata } from "../../__mocks__/data/mock-site-metadata"
import { MockPost } from "../../__mocks__/data/mock-post"
import { useStaticQuery } from "gatsby"
import { MockUnicorn } from "../../__mocks__/data/mock-unicorn"
import BlogProfile from "./blog-profile"
import {onLinkClick as onAnalyticsLinkClick} from 'gatsby-plugin-google-analytics';
import {onLinkClick as onGarsbyLinkClick} from 'gatsby';

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
  expect(await findByText('Joe')).toBeInTheDocument();
  expect(await findByText('Exists')).toBeInTheDocument();
  const TwitterEl = await findByText('Twitter')
  expect(TwitterEl).toBeInTheDocument();
  fireEvent.click(TwitterEl);
  expect(onAnalyticsLinkClick).toHaveBeenCalledTimes(1)
  const GitHubEl = await findByText('GitHub')
  expect(GitHubEl).toBeInTheDocument();
  fireEvent.click(GitHubEl);
  expect(onAnalyticsLinkClick).toHaveBeenCalledTimes(2)
  const WebsiteEl = await findByText('Website')
  expect(WebsiteEl).toBeInTheDocument();
  fireEvent.click(WebsiteEl);
  expect(onAnalyticsLinkClick).toHaveBeenCalledTimes(3)
  expect(await findByText('1 Articles')).toBeInTheDocument();
  expect(await findByText('10000 Words')).toBeInTheDocument();

  // Post cards
  expect(await findByText("by Joe")).toBeInTheDocument();
  expect(await findByText('10-10-2010')).toBeInTheDocument();
  expect(await findByText('This is a short description dunno why this would be this short')).toBeInTheDocument();

  fireEvent.click(await findByText("Post title"));
  expect(onGarsbyLinkClick).toHaveBeenCalledTimes(2);

  fireEvent.click(await findByTestId("authorPic"));
  expect(onGarsbyLinkClick).toHaveBeenCalledTimes(4);

})

