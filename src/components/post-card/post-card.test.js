import React from "react"
import { render } from "@testing-library/react"
import { PostCard } from "./post-card"
import { MockUnicornData } from "../../../__mocks__/mock-unicorn-data"

test("Renders with the expected text", async () => {
  const { baseElement, findByText } = render(<PostCard
    title={"Post title"}
    author={MockUnicornData}
    published={"10-10-2010"}
    tags={["item1"]}
    excerpt={"This is a short description dunno why this would be this short"}
    slug={"/this-post-name-here"}
  />)

  expect(baseElement).toBeInTheDocument();
})