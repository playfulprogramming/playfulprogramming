import { render } from "@testing-library/preact";
import { MockPost } from "__mocks__/data/mock-post";
import TwitterLargeCard, { splitSentence } from "./twitter-large-card";

test("Social previews splitSentence", () => {
  // doesn't split at start/end of short titles
  expect(splitSentence("Topic: Topic")).toStrictEqual(["Topic: Topic", ""]);

  // splits by colon (including the colon char)
  expect(splitSentence("A Topic: an Attribute")).toStrictEqual([
    "A Topic",
    ": an Attribute",
  ]);

  // splits by commas
  expect(
    splitSentence("An Attribute of Topic, Topic, and Topic")
  ).toStrictEqual(["An Attribute of ", "Topic, Topic, and Topic"]);

  // splits by apostrophe
  expect(splitSentence("A Topic's Attribute")).toStrictEqual([
    "A Topic's",
    " Attribute",
  ]);

  // splits by apostrophe (plural)
  expect(splitSentence("Some Topics' Attributes")).toStrictEqual([
    "Some Topics'",
    " Attributes",
  ]);

  // splits by lowercase words
  expect(splitSentence("An Attribute in a Topic")).toStrictEqual([
    "An Attribute in ",
    "a Topic",
  ]);
});

test("Social preview renders", async () => {
  const post = MockPost;
  const { baseElement, findByText } = render(
    <TwitterLargeCard
      post={post}
      postHtml="<code>test();</code>"
      width={1280}
      height={640}
      authorImagesStrs={["test.jpg"]}
      unicornUtterancesHead="uu.jpg"
    />
  );

  expect(baseElement).toBeInTheDocument();
  expect(await findByText(post.title)).toBeInTheDocument();
});
