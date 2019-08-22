import React from "react"
import { render } from "@testing-library/react"
import { PicTitleHeader } from "./pic-title-header"


test("Displays the correct title", () => {
  const { baseElement } = render(<PicTitleHeader
    image={'https://unicorn-utterances.com/static/e32c87870d4630382a9dae8cae941af6/5f3f7/unicorn-utterances-logo-512.png'}
    socials={{
      website: 'http://google.com'
    }}
    title={"Title"}
    description={"Test"}
  />)

  expect(baseElement).toBeInTheDocument();
})