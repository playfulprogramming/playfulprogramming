---
{
	title: "Example Post",
	description: "Look at all those edge cases!",
	published: '1999-09-18',
	tags: [],
	license: 'cc-by-nc-sa-4',
	noindex: true
}
---

This is regular text.

# Tooltips

> **Note:**
> This is a test of what a note looks like

> **What:**
> This is ANOTHER one?
> 
> ```typescript
> console.log("With code, even!")
> ```

> **Too many:**
> Dude, c'mon
> > With an inner one - huh??

# Footnote on paragraph text

Cool text[^coolFootnote]

[^coolFootnote]: well actually

# Adjacent Footnotes Shouldn't overlap

Pretend this is something very thought provoking[^1][^2]

[^1]: Footnotes are great right? I can throw all the tangents my brain cooks up while writing

[^2]: Rust is a must 🦀🦀🦀

# Link to another part of the page

<a id="cool-id🦦🦦🦦" href="#welcome🦀🦀🦀">See you later</a>

# Single-level list

- List without a nested `<p>` tag
- List item 2
- List item 3

## Single-level ordered list

1. List without a nested `<p>` tag
2. List item 2
3. List item 3

## Single-level padded list

- List item 1

- List item 2

- List item 3

- Extended content

  This list item has multiple paragraphs with a lot of content.

  ### This is a heading!

  Hello.

- ### List item 5
  Hi

## Single-level padded ordered list

1. List item 1

2. List item 2

3. List item 3

4. Extended content

   This list item has multiple paragraphs with a lot of content.

   ### This is a heading!

   Hello.

5. ### List item 5
   Hi

## Single-level list with headings

- # List item 1
- ## List item 2
- ### List item 3

## Single-level ordered list with headings

1. # List item 1
2. ## List item 2
3. ### List item 3

## Single-level list with blocks

- ```js
  console.log("Hello world!");
  ```

- List item 2
  <details>
    <summary>What's this?</summary>
	OwO
  </details>

- List item 3

- List item 4

## Single-level ordered list with blocks

1. ```js
   console.log("Hello world!");
   ```

2. List item 2
   <details>
     <summary>What's this?</summary>
	 OwO
   </details>

3. List item 3

4. List item 4

## Nested list

- List item 1
  - Sub-item 1
  - Sub-item 2
- List item 2
- List item 3

## Nested ordered list

1. List item 1
   1. Sub-item 1
   2. Sub-item 2
2. List item 2
3. List item 3

## Nested list in padded list

- List item 1

  - Sub-item 1
  - Sub-item 2

- List item 2

  - Padded sub-item 1

  - Padded sub-item 2

- List item 3

## Nested ordered list in padded ordered list

1. List item 1

   1. Sub-item 1
   2. Sub-item 2

2. List item 2

   1. Padded sub-item 1

   2. Padded sub-item 2

3. List item 3

# Headings

## Heading `with a code snippet` inside of it

## Heading [with a link](https://example.com) inside of it

# IFrames

<iframe src="https://stackblitz.com/edit/angular-unicorns-text-input?embed=1&file=src/app/app.component.ts" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<iframe src="https://stackblitz.com/edit/angular-unicorns-text-input?embed=1&file=src/app/app.component.ts" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

# Link Previews

## Link to another post

<!-- ::start:link-preview -->
[Writing Modern JavaScript without a Bundler](https://playfulprogramming.com/posts/modern-js-bundleless)
<!-- ::end:link-preview -->

## Link to an external site

<!-- ::start:link-preview -->
[Playful Programming GitHub](https://github.com/playfulprogramming/playfulprogramming)
<!-- ::end:link-preview -->

## Link containing an image

[![](/share-banner.png)](https://example.com)

## Link containing an image alongside text content

[Example Title ![](/share-banner.png)](https://example.com)
# Heading [with a link](https://example.com) inside of it

# Code Embeds

<!-- ::start:code-embed title="1-inaccessible.html as a static embed" driver="static" project="example-a11y-form" file="1-inaccessible.html" lines="9-14" height="80" -->
This is some static hosted content:
<!-- ::end:code-embed -->

<!-- ::code-embed title="1-inaccessible.html in a webcontainer" project="example-a11y-form" file="1-inaccessible.html" lines="9-14" preview-url="1-inaccessible.html" -->

<!-- ::code-embed title="2-visual-labels.html in the same webcontainer" project="example-a11y-form" file="2-visual-labels.html" lines="4-6,9-22" preview-url="2-visual-labels.html" -->

<!-- ::code-embed title="React webcontainer" project="example-react" file="src/App.jsx" lines="3-12" -->

# Thanks for taking the trip down here

<a href="#cool-id🦦🦦🦦" id="welcome🦀🦀🦀">Go back</a>

