---
{
  title: "Let’s Be Specific: CSS Specificity Explained",
  description: "Struggling with stubborn CSS rules? Learn how specificity works so you can write styles that apply the way you want, every time",
  published: '2025-09-22',
  tags: ["css", "html", "design"],
  license: 'cc-by-4'
}
---

Specificity in CSS is one of the most misunderstood and important concepts in the web dev space. It refers to the algorithm that browsers run when trying to decide which CSS declarations to apply to HTML elements.

For example, let's say the follwoing HTML markup and CSS styles are in index.html

```html
<style>
  .container p.content {
    color: bisque;
  }
  .container .content {
    color: blue;
  }
</style>
<div class="container">
  <p class="content">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
</div>
```

How does the browser decide which style wins when multiple rules target the same element? Anyone who has edited pages in a CMS knows why understanding this is so important.

In this article, we’ll explore how browsers decide which CSS rules apply, including quirks and nuances of specificity. I’ll also share a quick way to identify which rules take priority, helping you avoid frustration when styles don’t appear as expected.

> Browsers first check importance and origin of rules. Only then does specificity matter. If two rules have the same specificity, the one written later (or closer in scope) wins.
---
## Anatomy of a CSS rule

Before we begin, let's look at CSS in a bit more detail. First, let's get some terminology right. We will start with the most basic term that you need to understand, selector.

- **CSS selector:** A pattern used to target elements on a webpage. For example, `h1`, `.my_class`, or `#my_id` are all selectors.
- **Combinator:** these combine selectors to target elements based on their relationship to other elements in the web page. They allows us to create complex selectors, `+`, `>`, `~`, and `||` are combinators. Space is also a combinator
- **Simple selector:** A single selector that targets elements on its own, without combining others. `p`, `.button`, `[type="text"]`, `:hover`  and `::after` are all simple selectors.
- **Compound selector:** A set of simple selectors applied together to one element. The element must match all conditions for the style to apply.
- **Complex selector:** a sequence of one or more simple and/or compound selectors that are separated by combinators.
- **Selector list:** a comma-separated list of simple, compound, and/or complex selectors. Elements that match at least one of the selectors in the list is said to match the selector list.

A CSS rule may look like this:

```html
<style>
  .header,
  input.large,
  #projects .project-header p {
    color: blue;
  }
</style>
```

In this example we have a selector list made up of a complex selector `#projects .project-header p`, a compound selector `input.large` and a simple selector `.header` as well as the declaration block `{ color: blue; }`.

A declaration block can have one or more CSS properties, each separated by a semicolon. Each property has a name and a value. In the example above, `color` is the property name, and `blue` is its value.

Together, these parts make up a CSS rule.

---
## The Specificity Hierarchy

CSS lets you be more specific about which elements your styles target. Different selector types have different strengths, and they can be combined to create more precise rules.

Here’s a brief look at the main types:

1. `*`: The universal selector. Targets every element. It’s the least specific.
2. `p`, `div`, `em`, etc: Type selectors. Apply styles to all elements of that type. E.g. `p { color: blue }` will apply to all paragraph elements.
3. `.my-class`: This is a class selector, it applies styles to all elements which belong to that class.
4. `[type="text"]`: This is an example to a attribute class. This selects the elements which have the `type` attribute set to text.
5. `:hover`: Pseudo-class selector. Targets elements in a specific state, like input:focus. Can be combined with other selectors.
6. `#my-id`: ID selector. Targets a single element with that ID. Stronger than class or type selectors.
7. `<p style="color: red;">`: This is an example of an inline style. Inline styles are applied to elements using the style attribute.

> The universal selector `*` has no specificity. Its score is always 0-0-0, so it never overrides other selectors.

> Combinators (`+`, `>`, `~`, space and `||`) don’t add to specificity. Even though they make selectors more precise, they don’t affect the specificity score.

---
## Selector Weight Categories

Before we get into how specificity is calculated, we need to categorise the selector types above based on the Specificity algorithm. The algorithm uses three selector weight categories: ID, CLASS and TYPE.

- The ID category only covers ID selectors.
- The CLASS category includes class, attribute, and pseudo-class selectors.
- The TYPE category includes type selectors, pseudo-elements as well as other selectors with the double-colon notation.

> The pseudo classes :where(), :not(), :is() and :has() are not considered as pseudo-classes for the specificity weight calculation and don't add any weight to the specificity score. 

> For :not(), :is() and :has(), the highest specificity of the parameters passed into the parentheses is used by the specificity algorithm. 

> The :where() pseudo class always has a score of 0-0-0.

---
## Calculating the Specificity "Score"

Each selector gets a weight based on its category (ID, CLASS, TYPE). The score is written as ID-CLASS-TYPE by counting each simple selector in its category to calculate the total. Let’s make this concrete with an example.

```html
<style>
  .header,
  input.large,
  #projects .project-header p {
    color: blue;
  }
</style>
```

In the example, `#projects .project-header p` has a score of 1-1-1. It includes one ID, one class, and one type selector, so each column gets 1, giving the final specificity score.

The second selector in the list `.header` will have a score of `0-1-0` since it has one simple class selector.

The third selector `input.large` comprises the two simple selectors, the TYPE selector `input` and the CLASS selector `.large` thus will have a score of `0-1-1`.

> An interesting hack for the class column of the specificity score is to repeat a class of an element multiple times in a complex selector since each class slelector is counted as one. 

Look at the following example

```html
p.text { } /** 0-1-1 LOSES */

.text.text.text { } /** 0-3-0 WINS */

<p class="text">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
```

---
## Applying Styles

After calculating specificity for the relevant selectors, they are compared left to right: ID column first, then CLASS, then TYPE. The selector with the highest value in the ID column wins. If IDs are equal, the class column decides, and so on.

If both the ID and class columns are equal, the type column is compared. The selector with more type selectors wins. 

If all columns are equal, the later declaration in the CSS wins. This is called the proximity rule.

Let's test what we have learnt so far.

### Specificity Scoring Legend  

To recap, when calculating specificity, each selector adds to one of three columns in the format:  **ID – CLASS – TYPE**  

| Selector type       | Examples                              | Score     |
|---------------------|---------------------------------------|-----------|
| ID selectors        | `#my-id`                              | **1-0-0** |
| Class selectors     | `.my-class`                           | **0-1-0** |
| Attribute selectors | `[type="text"]`                       | **0-1-0** |
| Pseudo-classes      | `:hover`, `:focus`, `:nth-child`      | **0-1-0** |
| Type selectors      | `div`, `p`, `span`                    | **0-0-1** |
| Pseudo-elements     | `::before`, `::after`, `::first-line` | **0-0-1** |
| Universal selector  | `*`                                   | **0-0-0** |

👉 Special cases:  
- `:not()`, `:is()`, `:has()` → don’t add weight themselves, but take the **highest specificity of their arguments**.  
- `:where()` → always **0-0-0** regardless of arguments. 

```html
<style>
  p {
    color: blue;
  }
</style>
```
<details><summary>View answer</summary>0-0-1</details>

```html
<style>
  .content {
    color: red;
  }
</style>
```
<details><summary>View answer</summary>0-1-0</details>

```html
<style>
  #main {
    background: yellow;
  }
</style>
```
<details><summary>View answer</summary>1-0-0</details>

```html
<style>
  input[type="text"] {
    border: 1px solid black;
  }
</style>
```
<details><summary>View answer</summary>0-1-1</details>

```html
<style>
  a:hover {
    text-decoration: underline;
  }
</style>
```
<details><summary>View answer</summary>0-1-1</details>

```html
<style>
  .nav .link.active {
    color: green;
  }
</style>
```
<details><summary>View answer</summary>0-2-1</details>

```html
<style>
  #sidebar .menu-item:hover {
    background: lightgray;
  }
</style>
```
<details><summary>View answer</summary>1-2-0</details>

```html
<style>
  * {
    margin: 0;
  }
</style>
```
<details><summary>View answer</summary>0-0-0</details>

```html
<style>
  p::first-line {
    font-weight: bold;
  }
</style>
```
<details><summary>View answer</summary>0-0-2</details>

```html
<style>
  div:is(.highlight, #featured) {
    padding: 10px;
  }
</style>
```
<details>
<summary>View answer</summary>
1-0-1

(Explanation: `:is()` takes the highest specificity of its arguments — `#featured` contributes `1-0-0`, combined with `div` = `0-0-1`, so total `1-0-1`.)
</details>

---
## Inline Styles

Inline styles, like `<p style="color: blue;">Some text</p>`, always override styles in stylesheets. Think of them as having the highest specificity, as if adding a new column to the left. They can only be overridden using `!important`.

---
## The important! declaration

`!important` makes a style override any other rule, even more specific ones. If two `!important` rules conflict, normal specificity decides. It’s best to avoid `!important` and write selectors with the proper specificity instead.

---
## Quick Tip: Inspecting Specificity

A quick way to see which styles are most specific is using your browser’s inspector. It lists all styles applied to an element, showing the most specific rules at the top, making it easy to identify which declarations are actually taking effect.

---
## Conclusion

Understanding CSS specificity helps you control which styles apply and avoid frustrating conflicts. 

Use the inspector to quickly check applied rules, and aim to write clear, well-structured selectors instead of relying on !important. Mastery of specificity leads to cleaner, more predictable CSS.