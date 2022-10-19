---
{
    title: "Accessibility",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
    order: 17,
    series: "The Framework Field Guide"
}
---

As application developers, our job is to make sure that people have a good experience with the apps we build; While performance and stability make up part of that story, a user's experience (or, UX) is made up of multiple different aspects of their interactions with the app. 

One of the crucial aspects of UX is the ability to interact with the ability to have information presented in a way that's easily digestible.

There's multiple ways to think about this; some UX rules are objective while others are much more subjective.

Here's an example of what I'm talking about:

```html
<button style="background: transparent; border: none; color: transparent">
  Buy Now
</button>
```

This button is fully transparent. Render it on a page and any user (that's not looking at the HTML) will not be able to find it.

Now, take this button:

```html
<button
  style="background: #ffabab; border: 2rem solid #082450; color: #213224; font-size: 4rem;"
>
  Buy Now
</button>
```

<button aria-label="A large button with dark blue border, dark green 'buy now' text, and light red text" style="background: #ffabab; border: 2rem solid #082450; color: #213224; font-size: 4rem;" > Buy Now </button>

Compare this button, with harsh edges and three different colors, against a button from Google's Material Design:

```html
    <button
      style="
        height: 9rem;
        font-size: 4rem;
        border: medium none;
        border-radius: 1rem;
        padding: 0rem 4rem;
        background: rgb(98, 0, 238);
        color: rgb(255, 255, 255);
        box-shadow: 0px 0.75rem 0.25rem -0.5rem rgba(0, 0, 0, 0.2),
          0px 0.5rem 0.5rem 0px rgba(0, 0, 0, 0.14),
          0px 0.25rem 1.25rem 0px rgba(0, 0, 0, 0.12);
      "
    >
      Buy Now
    </button>
```

 <button aria-label="A large button with dark a rounded purple background, white 'buy now' text, and a shadow"  style=" height: 9rem; font-size: 4rem; border: medium none; border-radius: 1rem; padding: 0rem 4rem; background: rgb(98, 0, 238); color: rgb(255, 255, 255); box-shadow: 0px 0.75rem 0.25rem -0.5rem rgba(0, 0, 0, 0.2), 0px 0.5rem 0.5rem 0px rgba(0, 0, 0, 0.14), 0px 0.25rem 1.25rem 0px rgba(0, 0, 0, 0.12); " > Buy Now </button>







----

- WCAG/Intro to A11Y
- Semantic HTML
- Aria
- Element association
    - Implicit element attribution (label<->input)
    - Explicit element attribution
        - Unique ID Generation/handling
- Tab focusing 
    - Outline styles
    - TabIndex handling
    - `ref` usage with `focus()`
- Live announcement
- Mouse events
    - Use CSS!, not JS (for hover states, focus states)
- External resources
    - Official WCAG guidelines
    - Unofficial resources