---
{
	title: "Test Content: Edge Cases",
	description: "Look at all those edge cases!",
	published: '2020-09-18',
	authors: ['fennifith'],
	tags: [],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

This is regular text.

# Single-level list

- List without a nested `<p>` tag
- List item 2
- List item 3

# Single-level padded list

- List item 1

- List item 2

- List item 3

- Extended content

  This list item has multiple paragraphs with a lot of content.

  ## This is a heading!

  Hello.

- ## List item 5
  Hi

# Single-level list with headings

- # List item 1
- ## List item 2
- ### List item 3

# Single-level list with blocks

- ```js
  console.log("Hello world!");
  ```
- List item 2
  <details>
    <summary>What's this?</summary>
	OwO
  </details>
- <iframe src="https://stackblitz.com/edit/angular-unicorns-text-input?embed=1&file=src/app/app.component.ts" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
  List item 3
- List item 4

# Single-level padded list with blocks

- ```js
  console.log("Hello world!");
  ```

- List item 2
  <details>
    <summary>What's this?</summary>
	OwO
  </details>

- <iframe src="https://stackblitz.com/edit/angular-unicorns-text-input?embed=1&file=src/app/app.component.ts" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

  List item 3

- List item 4

- | Column 1 | Column 2 | Column 3 |
  |----------|----------|----------|
  | 1        | 2        | 3        |

  List item 5

# Nested list

- List item 1
  - Sub-item 1
  - Sub-item 2
- List item 2
- List item 3

# Nested list in padded list

- List item 1

  - Sub-item 1
  - Sub-item 2

- List item 2

  - Padded sub-item 1

  - Padded sub-item 2

- List item 3
