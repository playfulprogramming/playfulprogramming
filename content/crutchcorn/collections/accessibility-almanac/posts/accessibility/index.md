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

This button is fully transparent. Render it on a page and any user (that's not looking at the HTML) will not be able to find it. It's clear that we should not use this button on our page.

Now, take this button:

```html
<button
  style="background: #ffabab; border: 2rem solid #082450; color: #213224; font-size: 4rem;"
>
  Buy Now
</button>
```

<button aria-label="A large button with dark blue border, dark green 'buy now' text, and light red text" style="background: #ffabab; border: 2rem solid #082450; color: #213224; font-size: 4rem;" > Buy Now </button>

This button works, [has good contrast](https://unicorn-utterances.com/posts/intro-to-web-accessability#contrast), but might confuse some users whether it's a button or not.

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

This button is more rounded, has a drop shadow, and matches Google's designs.

Between the three buttons, which one do you want to use on your page?

The first button is clearly not a good contender, since it's invisible to the end user. That said; between the last two buttons, I think a reasonable argument could be made for either of them. There's few "objectively" correct guidelines for what a button _should_ look like.

It's important, however, to acknowledge that your decisions on the UX can impact your users long into their usage. We should be sure to test our behaviors and verify with those users that they enjoy using your app.

> Why are you talking about this now? What does it matter?

It matters because if the end users don't enjoy the experience of working with our apps, we have some work to do.

One area which many developers have work to do is "Accessibility".

# What is accessibility?

Put simply, accessibility is the idea that your apps should be usable and enjoyable to as many people as possible. For some, this means that your app is easy to think through - there aren't three buttons that all have the same icon and do different things.

For others, however, it means supporting keyboard-only usage of your app for those that cannot use the mouse, supporting screen-readers for blind users, and enabling other forms of assistive tech.

> What's a screen-reader? What's "assistive tech"?

A screen reader is a form of assistive technologies that allow users with a myriad of capabilities to use their computers.

Consider; If you can't see the screen many use to access their emails, how can you still do so?

The answer? A screen-reader, which reads the contents of the screen out loud, and a keyboard to navigate through the page using <kbd>Tab</kbd>.

---

Consider the following button:

<button>Go home</button>

This button might be read by a screen-reader as "Button, Go home". Meanwhile, this list of items:

- Ice Cream
- Pizza

Might read out as "List of 2 items." when the user has the list focused. Then, upon pressing <kbd>Tab</kbd>, it might read "Item one, Ice Cream".

---

A screen reader is one of many examples of assistive technologies, but is far from alone in a wide array of assistive technologies. A small list of assistive tech might include:

- [Braille displays](https://en.wikipedia.org/wiki/Refreshable_braille_display)
- [Screen readers](https://en.wikipedia.org/wiki/Screen_reader)
- [Closed captioning](https://en.wikipedia.org/wiki/Closed_captioning)
- [Text-to-Speech](https://en.wikipedia.org/wiki/Speech_synthesis)
- Vibration motors, for non-visual alerts
- Buttons, for those with limited mobility ([one such workflow is demonstrated by this Apple ad](https://www.youtube.com/watch?v=XB4cjbYywqg))



## Why you should make your apps accessible

> Why would I spend time supporting devices like screen readers? How many of my users are blind or hard of sight?

Well, there's some major points I'd like to speak to:

1) There's likely more users than you're aware of.
2) Users are still users - leading to more cash flow.
3) It enhances the user experience for everyone.
4) There may be legal requirements to do so.
5) It's the right thing to do.



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