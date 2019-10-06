import React from "react"
import { fireEvent, render } from "@testing-library/react"
import { siteMetadata } from "../../__mocks__/data/mock-site-metadata"
import { MockMultiAuthorPost, MockPost } from "../../__mocks__/data/mock-post"
import { useStaticQuery } from "gatsby"
import { MockUnicorn } from "../../__mocks__/data/mock-unicorn"
import BlogProfile from "./blog-profile"
import {onLinkClick as onAnalyticsLinkClick} from 'gatsby-plugin-google-analytics';
import {onLinkClick as onGarsbyLinkClick} from 'gatsby';
import ReactDOMServer from "react-dom/server"
import { axe } from "jest-axe"

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
  <BlogProfile
    data={{
      site: {
        siteMetadata
      },
      unicornsJson: MockUnicorn,
      allMarkdownRemark: {
        totalCount: 2,
        edges: [{
          node: MockPost
        }, {
          node: MockMultiAuthorPost
        }]
      },
    }}
    location={{
      pathname: '/post/this-post-name-here'
    }}
  />
)

test("Blog profile page renders", async () => {
  const { baseElement, findByText, findAllByTestId } = render(getElement());

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
  expect(await findByText('2 Articles')).toBeInTheDocument();
  expect(await findByText('110000 Words')).toBeInTheDocument();

  // Post cards
  expect(await findByText("by Joe")).toBeInTheDocument();
  expect(await findByText('10-10-2010')).toBeInTheDocument();
  expect(await findByText('This is a short description dunno why this would be this short')).toBeInTheDocument();

  fireEvent.click(await findByText("Post title"));
  expect(onGarsbyLinkClick).toHaveBeenCalledTimes(2);

  const authorImgs = await findAllByTestId("authorPic");
  fireEvent.click(authorImgs[0]);
  expect(onGarsbyLinkClick).toHaveBeenCalledTimes(4);
})

test("Blog profile page should not have axe errors", async () => {
  const html = ReactDOMServer.renderToString(getElement());
  const results = await axe(html);
  expect(results).toHaveNoViolations();
});
