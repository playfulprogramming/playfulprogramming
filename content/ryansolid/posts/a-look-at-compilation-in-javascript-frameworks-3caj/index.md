---
{
title: "A Look at Compilation in JavaScript Frameworks",
published: "2021-06-01T21:58:09Z",
edited: "2021-06-03T20:09:15Z",
tags: ["javascript", "webdev", "svelte", "marko"],
description: "In 2017 Tom Dale, wrote Compilers are the New Frameworks. And he was right. In 2017 things were alrea...",
originalLink: "https://dev.to/this-is-learning/a-look-at-compilation-in-javascript-frameworks-3caj",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

In 2017 Tom Dale, wrote [Compilers are the New Frameworks](https://tomdale.net/2017/09/compilers-are-the-new-frameworks/). And he was right. In 2017 things were already heading that way and have only continued on that trend since.

If you look at the whole range of build tools we use every framework is enhanced by some build ahead process. And if you want to take it to its natural extent you might land on, as @swyx did in his article [Language Servers are the new Frameworks](https://dev.to/dx/language-servers-are-the-new-frameworks-1lbm), down to a language itself.

But there are more steps still to go on this path. This trend of UI Framework in JavaScript being a language goes back much further. [Elm](https://elm-lang.org/)(2012), [Marko](https://markojs.com/)(2014), and [Imba](https://imba.io/)(2015) are just handful. But fast-forward to 2021 and we have many more libraries in this space.

And that's why it's more important to familiarize yourself with compilation in JavaScript frameworks. To understand what they are doing and more importantly what they can and cannot do.

# What is a Compiled JavaScript Framework?

Ones where end user code is run through a compiler to produce the final output. To be fair this might be a bit too loose but I want to show that the approach is a spectrum rather than a single target. The term most often gets associated with frameworks like [Svelte](https://svelte.dev/) or [Marko](https://markojs.com/) where everything ends up getting processed. But almost all popular frameworks use some form of ahead of time(AOT) compilation on their templates.

The reason is simple. Declarative interfaces are easier to reason about when you have systems where the inputs can come from many points and propagate through many related or non-related outputs. Most of these compiled frameworks are an extension of their templating languages. So that is the most reasonable place to start.

While there have been a few approaches over the years in the compiled camp now there are two main ones that stick out currently. HTML-first templating languages like [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), and [Marko](https://markojs.com/), and JavaScript-first templating languages like [JSX](https://facebook.github.io/jsx/).

```html
<section>
  <h1>My favorite color</h1>
  <div>${input.color.toUpperCase()}</div>
</section>
<shared-footer/>
```

HTML-first templating languages treat the source file like it is an enhancement of HTML and often will work as a perfectly valid HTML partial if used with pure HTML. Some of the earliest form used HTML string attributes for expressions, but most now use JavaScript expressions in their binding syntax.

```jsx
export default FavoriteColor(props) {
  return <>
    <section>
      <h1>My favorite color</h1>
      <div>{props.color.toUpperCase()}</div>
    </section>
    <SharedFooter />
  </>;
}
```

JSX provides HTML like syntax that can be inlined expressions in your JavaScript. You can view it as almost a different syntax for a function call, and in many cases that is all it is. But JSX is not part of the JavaScript standard so several frameworks actually leverage its well-defined syntax the same way HTML based templates do.

# Optimizing Templates

A lot of the motivation for compiled frameworks has come from the desire to optimize these templates further. But there is a lot that can be done with the base templating language. They can be compiled differently for server and browser. They can serve as a means for feature detection to aggressively tree shake. And many frameworks use templating languages as way of doing ahead of time static analysis to optimize the the code that is generated for performance.

Most template-generated code is creation logic, whether it is a bunch of VDOM nodes or real DOM nodes. When looking at a template you can almost immediately identify which parts will never change like literal values in attributes, or fixed groupings of elements. This is low hanging fruit for any templating approach.

A VDOM library like [Inferno](https://infernojs.org/) uses this information to compile its JSX directly into [pre-optimized node](https://github.com/infernojs/babel-plugin-inferno#infernojs-babel-plugin) structures. [Marko](https://markojs.com/) hoist their static VDOM nodes outside of their components so that they don't incur the overhead of recreating them on every render. [Vue](https://vuejs.org/) ups the ante collecting dynamic nodes reducing subsequent updates to just those nodes.

[Svelte](https://svelte.dev/) separates its code between create and update lifecycles. [Solid](https://github.com/solidjs/solid) takes that one step further hoisting the DOM creation into clone-able Template elements that create whole portions of the DOM in a single call, incidentally a runtime technique used by Tagged Template Literal libraries like @webreflection's [uhtml](https://github.com/WebReflection/uhtml) and [Lit](https://lit.dev/).

```js
// Solid's compiled output
const _tmpl$ = template(
  `<section><h1>My favorite color</h1><div></div></section>`
);

function FavoriteColor(props) {
  const _el$ = _tmpl$.cloneNode(true),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.nextSibling;

  insert(_el$3, () => props.color.toUpperCase());
  return [_el$, createComponent(SharedFooter, {})];
}

export default FavoriteColor;
```

With non-VDOM libraries, like [Svelte](https://svelte.dev/) or [Solid](https://github.com/solidjs/solid), we can further optimize for updates as well since the framework is not built on a diff engine. We can use the statically known information like attributes and directly associate template expressions with them, without necessarily understanding much about those expressions. This is basically loop unwinding. Instead of iterating over a list of unknown properties we compile in the inline update expressions. You can think of it like:

```js
if (isDirty(title)) el.setAttribute("title", title);
```

We can even make some further assumptions from the input data in some cases. For example, [Solid](https://github.com/solidjs/solid)'s compiler knows that simple variable bindings are not reactive as the tracking system relies on getters. So it can choose not to put that code under the update path.

There are still limits to what can be analyzed ahead of time. Spreads have to fallback to runtime approaches as do dynamic components like [Svelte](https://svelte.dev/)'s `<svelte:component>` or [Vue](https://vuejs.org/)'s `<component>`.

The other dynamic parts like loops and conditionals are always done at runtime in every framework. **We cannot diff at build time.** We can just narrow down the possibilities for the runtime. But for things like managing lists there are no shortcuts. Their reconciliation methods make a up a good chunk of the pulled in runtime for any framework. Yes, even compiled frameworks have runtimes.

# Beyond Templates

Now it is arguable when you have Single File Components if you shouldn't view the whole file as the template and a library like [Svelte](https://svelte.dev/) or [Marko](https://markojs.com/) basically treats it as such. There are certain assumptions that can be made when you know that your file represents a single component.

In the case of [Svelte](https://svelte.dev/) this determines the reactive tracking boundary. All reactive atoms declared within a file on change tell the component to update. In so [Svelte](https://svelte.dev/) can basically compile away their reactive system, removing the need to manage any subscriptions, by simply augmenting every assignment with a call to update the component (`$$invalidate`).

```js
// excerpt from Svelte's compiled output
function instance($$self, $$props, $$invalidate) {
  let { color } = $$props;

  $$self.$$set = $$props => {
    if ("color" in $$props)
      $$invalidate(0, color = $$props.color);
  };
  return [color];
}
```

This is relatively easy for static analysis since the decision can be made by looking at where variables are defined in the scope and update all places they are used. But this is much harder to do automatically when these reactive atoms need to come outside the template. [Svelte](https://svelte.dev/) uses a `$` naming convention to signify the stores so the compiler can know how to setup subscriptions.

A similar local optimization is how [Marko](https://markojs.com/) looks for classes in their components to know if they are stateful. Depending on what life-cycles are present on them and the types of bindings being used in the template you can determine if these component need to be sent to the browser or only include them on the server. This simple heuristic with some bundler magic makes for a simple approach to Partial Hydration.

Both of these approaches use specific syntax to denote understanding the nature of their state. Their data has become part of their language. While not enforced, have you ever wondered about the potential value of the `use` prefix on [React](https://reactjs.org/) hooks?

# Beyond Modules?

![Alt Text](./o9tubvj0k4stkeu4oyht.jpg)

The biggest limitation to compilation is the scope of what it can reasonably analyze. While we can do tricks to inform the compiler, like [Svelte](https://svelte.dev/)'s `$`, we tend to not see beyond `import` statements. This means we have to assume the worst when looking at what inputs come into our components (is it dynamic?). We don't know if children components use our stateful data in dynamic manner.

This hinders our ability for efficient composition. We need to fallback to usually different runtime mechanisms to fill this gap instead of leveraging the compiler's strengths. What if you could tell how a piece of data could affect the whole app at compile time?

So, for the most part we focus on local optimization. However, bundlers and minifiers get to work with final output code. While there is a lot we can do ahead of time to generate output that plays nice with their ability to optimize, at a certain point compilers will want to get in there too.

What we are doing through specific language is better understanding the developer's intent. Especially with heavy use of declarative constructs. This information is useful at all stages. This is something that is harder to do with general purpose programming languages.

# Conclusion

We are just scratching the surface of compiled JavaScript frameworks, but the techniques that we associate with pure compiled frameworks are working their way into others. For example, [Vue](https://vuejs.org/) has been exploring new [data-level language in their Single File Components](https://github.com/vuejs/rfcs/pull/228). And it is easy since the groundwork is already there.

The approach(HTML-first vs JS-first) each Framework takes to templating is mostly a superficial differentiator. There is very little meaningful difference here. But the devil is in the details when it comes feature support. Every framework has places where they have no choice but to lean heavier on their runtimes and these boundaries are commonly crossed in any significant application. So even code size isn't a clear benefit.

Where compilation excels is abstracting the complexity. From simpler syntax to interact with data and updates, to specialized output for server versus browser. This is a DX tool much like Hot Module Replacement on your bundler's Dev Server. It feeds into better IDE support since the program better understands your intent. And it also can bring performance gains.

Today, the biggest limitation to compiled approaches is that they are module scoped. If compiled approaches want to scale like runtime approaches this is a hurdle we will have to overcome. For now hybrid approaches might be the best solution. But even today, compilers are capable of so much it's hard to picture a future without them being a significant part.
