---
{
	title: "Example Post",
	description: "Look at all those edge cases!",
	published: '1999-09-18',
	tags: [],
	license: 'cc-by-nc-sa-4',
	noindex: true,
    coverImg: "share-banner.png"
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
[Writing Modern JavaScript without a Bundler](/posts/modern-js-bundleless)
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

# Snitip

Here's a cool sentence that talks about [Node](pfp-snitip:#nodejs)!

<!-- ::start:snitip id="nodejs" -->
## NodeJS

I'd like to inform you that what you're referring to as _NodeJS_ is actually _ECMAScript + NodeJS_, or "ECMA Node" for short.

NodeJS is not a **programming language** unto itself, but rather another component of a fully functioning [JavaScript](https://javascript.info) system made useful by the ECMA standards, ecosystem, and vital components comprising a full JavaScript runtime as defined by the OpenJS Foundation.

- [Node.js - Run JavaScript Everywhere](https://nodejs.org/en)
<!-- ::end:snitip -->

This snitip contains [references to multiple tags](pfp-snitip:#programming).

<!-- ::start:snitip id="programming" tags="java,nodejs,testing" -->
## Programming

Computers are bad
<!-- ::end:snitip -->

This is a referece to [a global tag](pfp-snitip:#javascript)!

# Katex is cool $$3\times3$$

I found a trend line of $$\left(x\log_{10} x \cdot 16\right) + 101$$ was reasonable. A file containing a union of size 1 is 101 bytes

Plugging in the safe integer range size ($$1.80\cdot10^{16}$$) yields $$3.15\times10^{17}$$ MB, or 315 ZB

## Font families

- Main/Math (default): $$x + y = z$$, *italic variables* like $$a, b, \theta$$
- Bold: $$\mathbf{v} = \boldsymbol{v}$$
- Text italic: $$\text{\textit{annotation}}$$
- Text bold italic: $$\text{\textbf{\textit{note}}}$$
- Blackboard bold (AMS): $$\mathbb{R}, \mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{C}$$
- Calligraphic: $$\mathcal{A}, \mathcal{L}, \mathcal{O}(n \log n)$$
- Script: $$\mathscr{F}, \mathscr{H}$$
- Fraktur: $$\mathfrak{g}, \mathfrak{su}(2)$$
- Sans-serif: $$\mathsf{sans}, \mathsf{ABC}$$
- Typewriter: $$\mathtt{monospace}, \mathtt{ABC}$$
- AMS symbols (used even without `\mathbb`): $$\leq, \geq, \neq, \in, \notin, \subset, \subseteq, \emptyset, \nabla, \partial, \infty, \aleph, \therefore, \because$$

## Delimiters and operators (Size1-4 fonts)

Large auto-sized delimiters, sums, products, and nested fractions all scale through KaTeX's Size1-4 fonts:

$$\left( \frac{1}{1 + \frac{1}{1 + \frac{1}{x}}} \right)$$

$$\sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6} \qquad \prod_{k=1}^{n} k = n! \qquad \bigcup_{i=1}^{n} A_i$$

$$\sqrt{\frac{a^2 + b^2}{\sqrt{c^2 + \sqrt{d^2}}}}$$

## Matrices, cases, and accents

$$\begin{pmatrix} a & b \\ c & d \end{pmatrix} \qquad f(x) = \begin{cases} 1 & x > 0 \\ 0 & x = 0 \\ -1 & x < 0 \end{cases}$$

Accents and vectors: $$\vec{v}, \hat{x}, \bar{y}, \dot{z}, \tilde{n}$$

Greek letters: $$\alpha, \beta, \gamma, \Delta, \pi, \Sigma, \omega, \Omega$$

Limits and binomials: $$\lim_{x \to \infty} \frac{1}{x} = 0 \qquad \binom{n}{k}$$

# Users

<!-- ::user id="crutchcorn" -->

# YouTube and Videos Embeds

A normal YouTube video

<iframe src="https://www.youtube.com/watch?v=_licnRxAVk0"></iframe>

A YouTube short

<iframe src="https://www.youtube.com/shorts/Fdbha07mFzo"></iframe>

A Vimeo video

<iframe src="https://vimeo.com/750377602"></iframe>

A Twitch clip

<iframe src="https://clips.twitch.tv/TacitFitIcecreamTriHard-KgJCKYYIEPqxe4dQ"></iframe>

> We can't get a ton of data from Twitch without using their API (and therefore a token), so this is just a simple embed

# X Embeds

With text:

<iframe src="https://x.com/playful_program/status/1917675879695552789"></iframe>

With picture:

<iframe src="https://x.com/playful_program/status/1917675872854614490"></iframe>

404 embed:

<iframe src="https://x.com/playful_program/status/123"></iframe>

# GitHub Gist Embeds

<iframe src="https://gist.github.com/crutchcorn/36fe5553219c05ea38bacf1c7396085b"></iframe>

# Thanks for taking the trip down here

<a href="#cool-id🦦🦦🦦" id="welcome🦀🦀🦀">Go back</a>

# Quiz Components

Here are the rules—get the answer right or else 😈

<!-- ::start:quiz -->

<!-- ::start:quiz-radio -->
## Based on what you’ve seen: Why does JS? {#why-does-js}
- ( ) Option 1 {#1}
- (x) Option 2 {#2}
- ( ) Option 3 {#3}
- ( ) Option 4 {#4}
<!-- ::end:quiz-radio -->

Cool text between the section I love teaching yipee

[link](#why-does-js)

<!-- ::start:quiz-radio -->
## Why did you do that
- ( ) I'm sorry
- ( ) it was a continuous lapse of judgement
- ( ) I didn't mean it
- (x) I didn't do it
- (x) You'll have to talk to my lawyer
<!-- ::end:quiz-radio -->

<!-- ::end:quiz -->

## Standalone question

<!-- ::start:quiz-radio -->
## don't touch me!
- (x) *adds vertical padding so questions don't touch*
- ( ) `code`
- ( ) **bold**
- ( ) rreally long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long really long eally long really long
<!-- ::end:quiz-radio -->

<!-- ::start:quiz-radio -->
## Question with an explanation
- (x) Confusing answer
- ( ) Confusing answer
- ( ) Confusing answer
- ( ) Confusing answer

This is why the question is because of the way it is.

Look at [this link](https://example.com).
<!-- ::end:quiz-radio -->

<!-- ::start:quiz-radio -->
## Never

- ( ) Gonna

- ( ) Give

- (x) You

- ( ) Up

Try running this code in your browser:
```js
location.href = atob("aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==");
```
<!-- ::end:quiz-radio -->
