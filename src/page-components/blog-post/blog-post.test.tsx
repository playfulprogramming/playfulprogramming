import React, { PropsWithChildren } from "react";
import { fireEvent, render } from "@testing-library/react";
import {
  MockCanonicalPost,
  MockMuliLanguagePost,
  MockMultiAuthorPost,
  MockPost,
} from "__mocks__/data/mock-post";
import BlogPostTemplate from "../../pages/[...postInfo]";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { Languages } from "types/index";
import { getAllByRel, getByProperty, getByRel } from "utils/tests";
// import { axe } from "jest-axe";

const getElement = ({
  post,
  fn = jest.fn(),
  markdownHTML = "",
  slug = "/slug",
  postsDirectory = "/posts",
  seriesPosts = [],
  lang = "en",
}: {
  post: any;
  fn?: () => void;
  markdownHTML?: string;
  slug?: string;
  postsDirectory?: string;
  seriesPosts?: any[];
  lang?: Languages;
}) => (
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
    <BlogPostTemplate
      post={post}
      markdownHTML={markdownHTML}
      slug={slug}
      lang={lang}
      postsDirectory={postsDirectory}
      seriesPosts={seriesPosts}
      suggestedPosts={[]}
    />
  </RouterContext.Provider>
);

test("Blog post page renders", async () => {
  const navigatePushFn = jest.fn();
  const { baseElement, findByText, findByTestId } = render(
    getElement({
      post: MockPost,
      fn: navigatePushFn,
      markdownHTML: "Hey there",
    })
  );

  expect(baseElement).toBeInTheDocument();

  // Shows post title
  expect(await findByText("Post title")).toBeInTheDocument();
  // Show a subtitle?
  // Shows post metadata
  expect(await findByText("Joe")).toBeInTheDocument();
  expect(await findByText("October 10, 2010")).toBeInTheDocument();
  expect(await findByText("10000 words")).toBeInTheDocument();
  const authorName = await findByTestId("post-meta-author-name");
  expect(authorName).toHaveTextContent("Joe");
  // Because the links act as spans, we're wanting to find by text in this instance
  fireEvent.click(await findByText("Joe"));
  expect(navigatePushFn).toHaveBeenCalledTimes(1);
  fireEvent.click(await findByTestId("author-pic-0"));
  expect(navigatePushFn).toHaveBeenCalledTimes(2);

  // Renders the post body properly
  expect((await findByTestId("post-body-div")).innerHTML).toContain(
    "<div>Hey there</div>"
  );
});

test("Blog post page handles two authors", async () => {
  const navigatePushFn = jest.fn();

  const { baseElement, findByText, findByTestId } = render(
    getElement({
      post: MockMultiAuthorPost,
      fn: navigatePushFn,
      markdownHTML: "Hello, friends",
    })
  );

  expect(baseElement).toBeInTheDocument();

  // Shows post title
  expect(await findByText("Another post title")).toBeInTheDocument();
  // Show a subtitle?
  // Shows post metadata
  const dianeNameEl = await findByText("Diane");
  const joeNameEl = await findByText("Joe");
  expect(dianeNameEl).toBeInTheDocument();
  expect(joeNameEl).toBeInTheDocument();
  expect(await findByText("October 20, 2010")).toBeInTheDocument();
  expect(await findByText("100000 words")).toBeInTheDocument();
  fireEvent.click(dianeNameEl);
  expect(navigatePushFn).toHaveBeenCalledTimes(1);
  fireEvent.click(joeNameEl);
  expect(navigatePushFn).toHaveBeenCalledTimes(2);
  fireEvent.click(await findByTestId("author-pic-0"));
  expect(navigatePushFn).toHaveBeenCalledTimes(3);
  fireEvent.click(await findByTestId("author-pic-1"));
  expect(navigatePushFn).toHaveBeenCalledTimes(4);

  // Renders the post body properly
  expect((await findByTestId("post-body-div")).innerHTML).toContain(
    "<div>Hello, friends</div>"
  );
});

/**
 * Next head mocking to `head` element
 *
 * TODO: Turn this + queries into a library
 */
const mockDocument = document;

jest.mock("next/head", () => {
  const ReactDOM = require("react-dom");
  return ({ children }: PropsWithChildren<unknown>) => {
    return ReactDOM.createPortal(children, mockDocument.head);
  };
});

test("SEO should show translation data", () => {
  const navigatePushFn = jest.fn();

  render(
    getElement({
      post: MockMuliLanguagePost,
      fn: navigatePushFn,
      markdownHTML: "Hello, friends",
      lang: "en",
    })
  );

  const alts = getAllByRel(document.head, "alternate");
  expect(alts.length).toBe(2);
  expect(alts[0]).toHaveProperty("hreflang", "x-default");
  expect(alts[1]).toHaveProperty("hreflang", "es");

  expect(getByProperty(document.head, "og:locale")).toHaveProperty(
    "content",
    "en"
  );
  expect(getByProperty(document.head, "og:locale:alternate")).toHaveProperty(
    "content",
    "es"
  );
});

test("Canonical tags should show in SEO", () => {
  const navigatePushFn = jest.fn();

  render(
    getElement({
      post: MockCanonicalPost,
      fn: navigatePushFn,
      markdownHTML: "Hello, friends",
      lang: "en",
    })
  );

  expect(getByRel(document.head, "canonical")).toHaveProperty(
    "href",
    "https://google.com/"
  );
});

test.todo("SEO Twitter");
test.todo("Shows post footer image");

// test.skip("Blog post page should not have axe errors", async () => {
//   const html = ReactDOMServer.renderToString(getElement());
//   const results = await axe(html);
//   expect(results).toHaveNoViolations();
// });
