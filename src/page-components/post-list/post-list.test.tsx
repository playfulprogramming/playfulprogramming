/**
 * This test is in the `__tests__` directory
 */
import React from "react";
import { fireEvent, render } from "@testing-library/react";
import ReactDOMServer from "react-dom/server";
// import { axe } from "jest-axe";

import { siteMetadata } from "__mocks__/data/mock-site-metadata";
import { MockMultiAuthorPost, MockPost } from "__mocks__/data/mock-post";
import { MockUnicorn } from "__mocks__/data/mock-unicorn";
import PostsPage from "../../pages/page/[pageNum]";
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
        basePath: "/",
      } as any
    }
  >
    <PostsPage
      posts={[MockPost, MockMultiAuthorPost] as any[]}
      path={"/"}
      pageNum={1}
      numberOfPages={8}
    />
  </RouterContext.Provider>
);

test("Blog index page renders", async () => {
  const navigatePushFn = jest.fn();
  const { baseElement, findByText, findAllByTestId } = render(
    getElement(navigatePushFn)
  );

  expect(baseElement).toBeInTheDocument();
  fireEvent.click(await findByText("About Us"));
  expect(navigatePushFn).toHaveBeenCalledTimes(1);

  // Post cards
  expect(await findByText("October 10, 2010")).toBeInTheDocument();
  expect(
    await findByText(
      "This is a short description dunno why this would be this short"
    )
  ).toBeInTheDocument();

  fireEvent.click(await findByText("Post title"));
  expect(navigatePushFn).toHaveBeenCalledTimes(2);

  const authorImgs = await findAllByTestId("author-pic-0");
  fireEvent.click(authorImgs[0]);
  expect(navigatePushFn).toHaveBeenCalledTimes(3);
});

// test.skip("Blog index page should not have axe errors", async () => {
//   const html = ReactDOMServer.renderToString(getElement());
//   const results = await axe(html);
//   expect(results).toHaveNoViolations();
// });
