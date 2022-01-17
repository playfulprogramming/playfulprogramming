import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { siteMetadata } from "__mocks__/data/mock-site-metadata";
import { MockMultiAuthorPost, MockPost } from "__mocks__/data/mock-post";
import { MockUnicorn } from "__mocks__/data/mock-unicorn";
import ReactDOMServer from "react-dom/server";
import UnicornPage from "../../pages/unicorns/[...pageInfo]";
import { mockOnLinkClick } from "__mocks__/modules/next-link";
import { RouterContext } from "next/dist/shared/lib/router-context";

const getElement = (fn: () => void) => (
  <RouterContext.Provider
    value={
      {
        push: () => {
          fn();
          return Promise.resolve(false);
        },
        replace: () => Promise.resolve(false),
        prefetch: () => Promise.resolve(),
      } as any
    }
  >
    <UnicornPage
      unicorn={MockUnicorn}
      authoredPosts={[MockPost, MockMultiAuthorPost] as any[]}
      basePath={"/"}
      pageNum={1}
      numberOfPages={3}
      wordCount={10000}
    />
  </RouterContext.Provider>
);

test("Blog profile page renders", async () => {
  const navigatePushFn = jest.fn();
  const { baseElement, findByText, findAllByTestId, findAllByText } = render(
    getElement(navigatePushFn)
  );

  expect(baseElement).toBeInTheDocument();
  const joeEls = await findAllByText("Joe");
  // One in the page title, one per post
  expect(joeEls.length).toBe(4);
  expect(await findByText("Exists")).toBeInTheDocument();
  const TwitterEl = await findByText("Twitter");
  expect(TwitterEl).toBeInTheDocument();
  fireEvent.click(TwitterEl);
  // expect(onLinkClick).toHaveBeenCalledTimes(1);
  const GitHubEl = await findByText("GitHub");
  expect(GitHubEl).toBeInTheDocument();
  fireEvent.click(GitHubEl);
  // expect(onLinkClick).toHaveBeenCalledTimes(2);
  const WebsiteEl = await findByText("Website");
  expect(WebsiteEl).toBeInTheDocument();
  fireEvent.click(WebsiteEl);
  // expect(onLinkClick).toHaveBeenCalledTimes(3);
  expect(await findByText("2 Articles")).toBeInTheDocument();
  expect(await findByText("10000 Words")).toBeInTheDocument();

  mockOnLinkClick.mockReset();

  // Post cards
  const byEls = await findAllByText("by");
  expect(byEls.length).toBe(2);
  expect(await findByText("October 10, 2010")).toBeInTheDocument();
  expect(
    await findByText(
      "This is a short description dunno why this would be this short"
    )
  ).toBeInTheDocument();

  fireEvent.click(await findByText("Post title"));
  expect(navigatePushFn).toHaveBeenCalledTimes(1);

  const authorImgs = await findAllByTestId("author-pic-0");
  fireEvent.click(authorImgs[0]);
  expect(navigatePushFn).toHaveBeenCalledTimes(2);
});

// test.skip("Blog profile page should not have axe errors", async () => {
//   const html = ReactDOMServer.renderToString(getElement());
//   const results = await axe(html);
//   expect(results).toHaveNoViolations();
// });
