import React from "react"
import { fireEvent, render } from "@testing-library/react"
import { PostCard } from "./post-card"
import { MockUnicornData } from "../../../__mocks__/mock-unicorn-data"
import {onLinkClick} from 'gatsby';

test("Renders with the expected text and handles clicks properly", async () => {
  const { baseElement, findByText, findByTestId } = render(<PostCard
    title={"Post title"}
    author={MockUnicornData}
    published={"10-10-2010"}
    tags={["item1"]}
    excerpt={"This is a short description dunno why this would be this short"}
    slug={"/this-post-name-here"}
  />)

  expect(baseElement).toBeInTheDocument();
  expect(await findByText("by Joe")).toBeInTheDocument();
  expect(await findByText('10-10-2010')).toBeInTheDocument();
  expect(await findByText('item1')).toBeInTheDocument();
  expect(await findByText('This is a short description dunno why this would be this short')).toBeInTheDocument();

  fireEvent.click(await findByText("Post title"));
  expect(onLinkClick).toHaveBeenCalledTimes(2);

  fireEvent.click(await findByTestId("authorPic"));
  expect(onLinkClick).toHaveBeenCalledTimes(4);
})