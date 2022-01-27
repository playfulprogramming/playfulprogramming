import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { siteMetadata } from "__mocks__/data/mock-site-metadata";
import { MockMultiAuthorPost, MockPost } from "__mocks__/data/mock-post";
import BlogPostTemplate from "../../pages/posts/[slug]";
import ReactDOMServer from "react-dom/server";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { serialize } from "next-mdx-remote/serialize";
// import { axe } from "jest-axe";

const getElement = async ({
  post,
  fn = jest.fn(),
  markdown = "",
  slug = "/slug",
  postsDirectory = "/posts",
  seriesPosts = [],
}: {
  post: any;
  fn?: () => void;
  markdown?: string;
  slug?: string;
  postsDirectory?: string;
  seriesPosts?: any[];
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
      source={await serialize(markdown)}
      slug={slug}
      postsDirectory={postsDirectory}
      seriesPosts={seriesPosts}
    />
  </RouterContext.Provider>
);

test("Blog post page renders", async () => {
  const navigatePushFn = jest.fn();
  const { baseElement, findByText, findByTestId } = render(
    await getElement({
      post: MockPost,
      fn: navigatePushFn,
      markdown: "Hey there",
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
  expect((await findByTestId("post-body-div")).innerHTML).toMatchInlineSnapshot(
    `"<p>Hey there</p>"`
  );
});

test("Blog post page handles two authors", async () => {
  const navigatePushFn = jest.fn();

  const { baseElement, findByText, findByTestId } = render(
    await getElement({
      post: MockMultiAuthorPost,
      fn: navigatePushFn,
      markdown: "Hello, friends",
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
  expect((await findByTestId("post-body-div")).innerHTML).toMatchInlineSnapshot(
    `"<p>Hello, friends</p>"`
  );
});

test.todo("SEO should apply");
test.todo("Shows post footer image");

// test.skip("Blog post page should not have axe errors", async () => {
//   const html = ReactDOMServer.renderToString(getElement());
//   const results = await axe(html);
//   expect(results).toHaveNoViolations();
// });
