---
{
  title: "Let’s Be Specific: CSS Specificity Explained",
  description: "Struggling with stubborn CSS rules? Learn how specificity works so you can write styles that apply the way you want, every time",
  published: '2025-09-01',
  tags: ["css", "html", "design"],
  license: 'cc-by-4'
}
---

Specificity in CSS is one of the most misunderstood and important concepts in the web dev space. It refers to the algorithm that browsers run when trying to decide which CSS declarations to apply to HTML elements.

For example, let's say the follwoing HTML markup and CSS styles are in index.html

```html
<style>
  .container .content {
    color: blue;
  }

  .container p {
    color: bisque;
  }
</style>

<div class="container">
  <p class="content">
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Error ex impedit
    odit harum expedita tenetur nostrum ad ipsam, perferendis nobis eius vitae,
    mollitia provident dolorem beatae sapiente optio corrupti eveniet.
  </p>
</div>
```

How does the browser determine which color to apply when confronted with multiple declarations that target the same element? If you have ever had to modify web pages in a CMS then you will undertsnd why this is so important.

In this article, we will look at the concept in detail and explore the quirks and nuances of the way browsers decide which styles to apply. I will also introduce you to a quick way to understand which CSS rules are higher in specificity so that you can avoid the hair pulling moments when the styles you want to apply to an element, aren't being applied.

> Important Note
> Note: Browsers consider specificity after determining cascade origin and importance. In other words, for competing property rules, specificity is relevant and compared only between selectors from the one cascade origin and layer that has precedence for the property. Scoping proximity and order of appearance become relevant when the selector specificities of the competing rules in the cascade layer with precedence are equal.

## Anatomy of a CSS rule

Before we begin, let's look at CSS in a bit more detail. First, let's get some terminology right. We will start with the most basic term that you need to understand, selector.

CSS selector: refers to any pattern in CSS that represents a pattern of element(s) in the tree structure. `h1`, `.my_class` or `my_id` are all selectors.

Combinator: as the name suggests, combinators combine selectors to select DOM nodes based on their relationship to other elements within the document node tree. This allows us to create complex selectors.

Simple selector: a selector with a single component, which can be a type selector, attribute selector, pseudo-element or pseudo-class. A simple selector is not used in combination with or contains any other selector component or combinator.

Compound selector: a sequence of simple selectors that are not separated by any combinator. It represents a set of simultaneous conditions on a single element. Styles are applied to any elements that match all the simple selectors in the compound selector.

Complex selector: a sequence of one or more simple and/or compound selectors that are separated by combinators.

Selector list: a comma-separated list of simple, compound, and/or complex selectors. Elements that match at least one of the selectors in the list is said to match the selector list.

A CSS rule may look like this:

```html
<style>
  #projects .project-header p,
  .header,
  input.large {
    color: blue;
  }
</style>
```

In this example we have a selector list made up of a complex selector `#projects .project-header p`, a compound selector `input.large` and a simple selector `.header` as well as the declaration block `{ color: blue; }`.

A declaration block may contain one or more CSS properties where each property is separated by a semi-colon. Each declaration consists of a name and a value. In the example above, the property name is `color` and its value is `blue`.

Together, these parts make up a CSS rule.

## The Specificity Hierarchy: Levels of Specificity - From Universal to Inline

As the name suggests, we can be more specific about where we want our styles applied. CSS provides a wide range of selectors can be mixed to specify (pun intended ofc lol) what we want to style.

Let's have a brief look at the various selector types that can be used.

1. `*`: This is the universal selector. It applies to every element.
2. `p`, `div`, `em`, etc: These are element selectors, they apply styles to all elements of that type. For example, `p { color: blue }` will apply the colour blue to all `<p></p>` elements.
3. `.my-class`: This is a class selector, it applies styles to all elements which belong to that class.
4. `[type="text"]`: This is an example to a attribute class. This selects the elements which have the `type` attribute set to text.
5. `:hover`: This is a psseudo-class selector. Think of this selector as a way of qualifying another selector. Let's say we have input elements on a webpage, if we apply a CSS rule based on `input:focus`, then what we are doing is selecting a subset of inputs, namely the one that is currently in focus to apply the style to. Pseudo-classes can be applied to other CSS selectors such as type and class selectors.
6. `#my-id`: This is an ID selector. ID selectors apply styles to the element with that ID. As per the CSS/HTML spec, an ID can only be used once i.e., only one element should be using a specific ID.
7. `<p style="color: red;">`: This is an example of an inline style. Inline styles are applied to elements using the style attribute.

> The universal selector `*` does not add any specificity, its score is set at (0-0-0) so that is doesn't compete with any other selector
> It is important to note that combinators do not add to specificity (+, >, ~, " ", and ||). While this is counterintuitive since they can make selectors more specific, they have no bearing on the specificity score.

## Selector Weight Categories

Before we get into how specificity is calculated, we need to categorise the selector types above based on the Specificity algorithm. The algorithm uses three selector weight categories: TYPE, ID and CLASS.

- The ID category only covers ID selectors such as `#my-id`.

- The class category includes class selectors such as `.my-class`, attribute selectors such as `[type="radio"]`, and pseudo-class selectors such as `:hover`.

- The TYPE category includes selectors which map directly to HTML elements such as `div`, `p`, `span` as well as pseudo-elements such as `::after`, `::before` and other selectors with the double-colon notation.

> Exceptions to the pseudo classes
> The pseudo classes :where(), :not(), :is() and :has() are not considered as pseudo-classes when the specificity weight calculation is done. Therefore like combinators, they don't add any weight to the specificity equation. For the :not(), :is() and :has() pseudo classes, the highest specificity of the parameters passed into the parentheses is used by the specificity algorithm. The :where() pseudo class on the other hand is like the universal selector, it always has a score of 0-0-0.

## Calculating Specificity: The Specificity "Score"

Each selector in a CSS rule is given a weight by the Specificity algorithm, the weight is based on the number of selectors of each weight category. This score is expressed as a three column value in the form of ID-CLASS-TYPE. It is calculated by adding counting each simple selector of the weight category that the selector belongs to and adding the total to the weight column. Let's make this concrete by way of an example.

```html
<style>
  #projects .project-header p,
  .header,
  input.large {
    color: blue;
  }
</style>
```

Using the earlier code snippet repeated above, we can see that there are 3 selectors in the selector list. Using the `#projects .project-header p` selector, the score will be `1-1-1`. That is because the selector consists of an ID selector, a CLASS selector and a TYPE selector, 1 is added to each column and that is the final score for this selector.

The second selector in the list `.header` will have a score of `0-1-0` since it has one simple class selector.

The third selector `input.large` comprises the two simple selectors, the TYPE selector `input` and the CLASS selector `.large` thus will have a score of `0-1-1`.

## Applying Styles

Once the specificity scores are calculated for the relevant selectors, the weights of the selector components are compared from left to right for each style. The comparison is done using the columns representing the various weight categories. The ID column is considered. This column represents the number of IDs in a selector. Competing selectors are compared, the selector with the highest value in the ID column wins, no matter what the value in the other columns are. If the values here are equal, then the next column is compared - the CLASS column.

The CLASS column counts the number of classes, attribute selectors and pseudo classes in a selector. The same process is applied here, for competing styles where the ID columns have the same value, the CLASS column with the highest value wins no matter the value in the TYPE column. If they are tied, then the TYPE column is considered.

This column counts the number of type and pseudo-elements in the selector, when both the ID and CLASS columns are tied, the selector with the highest value in this column wins.

If all three columns are tied then the last declared selector gets precedence. This is called the proximity rule.

> Quizzes to test calculation the specificity score

> An interesting hack for the class column of the specificity score is to repeat a class of an element multiple times in a complex selector since each class slelector is counted as one. Look at the following example... .myclass.myclass.myclass hack

## Inline Styles

Inline styles, such as - `<p style="color: blue;">Some words</p>` - always override styles in authored stylesheets. The best way to think about them is that they by default have the highest specificity. It is as if they add a column to the left of the specificity score, with a single value there. They can only be overriden with `!important`.

## The important! declaration

The !important declaration overrides any other rule targeting the same element, even if that rule is more specific. In simple terms, it makes a style jump to the front of the line. If two !important rules conflict, then normal specificity rules decide the winner. While it can feel like a quick fix, it’s usually best to avoid using !important and instead write selectors with the right level of specificity.

> Quizzes to test calculation the specificity score
> https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity
> https://www.w3schools.com/css/css_specificity.asp#:~:text=More%20Specificity%20Rules%20Examples
> https://web.dev/learn/css/specificity#specificity_in_context

TODO: QUICK WAY TO MOVE PAST ALL THESE RULES
