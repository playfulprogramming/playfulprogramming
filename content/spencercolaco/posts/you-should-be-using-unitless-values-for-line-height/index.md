---
{
  title: "You should be using unitless values for line-height",
  description: "I've seen every value in the book used to set line-height values in CSS. This is why you should just use unitless.",
  published: '2025-06-24',
  tags: ["css", "frontend", "typography"],
  license: 'cc-by-4'
}
---

Back when I was a designer, I was curious why Adobe programs defaulted to a specific line height when selecting “auto” for leading (fancy designer word for line-height). The default seemed to be 120% of the font size, a value that aligns with common typographic standards, including those referenced in some ISO guidelines (e.g., ISO 215 for document layout, though not a direct specification for software defaults). These standards often suggest values around 120% for 'single-spaced' lines, 150% for 'line and a half,' and 200% for 'double-spaced' lines. I’m sure this brings you back to your years as a student when teachers asked you for double spaced papers so they could use their evil red pen to tell you how bad your essay was (lulz). Well, this was the convention used in MS Word when you selected that option! Apparently, Word uses some [”secret sauce formula”](https://community.adobe.com/t5/indesign-discussions/line-spacing-in-indesign/m-p/11577973#M402898) for calculating this, while other software is more straightforward, but we won’t get into that.

What does this mean to me if I’m a developer? It means that you have a baked-in, very simple way to adhere to this standard: unitless values. In CSS, when you use a unitless value for `line-height` you are dynamically calculating the line height based on the element’s font size. So, when you set `line-height: 1.2` you are setting the line height to 120% of the font size, which is the standard for single spaced lines!

## Unexpected behavior of using rem and em

You may already know rem values for font sizes are preferred so your app’s font size will scale with the `user agent`’s font size. I believe this leads to the notion that you should be using rem with line height as well. This is not always the case. Using rem units may lead to unexpected behavior:

```html
<style>
	html {
		font-size: 16px;
	}
	
	body {
		font-size: 1rem; /* 16px */
		line-height: 1.5rem; /* computed height: 24px (1.5 * 16px) */
	}
	
	h1 {
		font-size: 4rem; /* computed height: 24px (inherited) */
	}
	
	p {
		font-size: 2rem; /* computed height: 24px (inherited) */
	}
</style>

<body>
	<h1 class="heading">This ackshully is not a long heading at all</h1>
  <p class="text">
    Lorem Ipsum is simply dummy text of the printing and typesetting
    industry. Lorem Ipsum has been the industry's standard dummy text ever
    since the 1500s, when an unknown printer took a galley of type and
    scrambled it to make a type specimen book. It has survived not only five
    centuries, but also the leap into electronic typesetting, remaining
    essentially unchanged. It was popularised in the 1960s with the release
    of Letraset sheets containing Lorem Ipsum passages, and more recently
    with desktop publishing software like Aldus PageMaker including versions
    of Lorem Ipsum.
  </p>
</body>
```

[rendered example output of the code snippet above]

As you can see, the computed line height for the `p` and `h1` is inherited from `body` which is calculated based on the `user agent` font size therefore too small and an accessibility violation. If you change `line-height: 1.5rem` to `line-height: 1.5` you’re all good!

The obvious downside of using `px` values is that line height will not be dynamic, but what about `em` values? Wouldn’t that work since they are not tied to the root html styles? [Just don’t do it](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height#prefer_unitless_numbers_for_line-height_values).

Ah, much better:

```jsx
<style>
	html {
		font-size: 16px;
	}
	
	body {
		font-size: 1rem; /* 16px */
		line-height: 1.5; /* computed height: 24px (1.5 * 16px) */
	}
	
	h1 {
		font-size: 4rem; /* computed height: 96px (1.5 * 64px) */
	}
	
	p {
		font-size: 2rem; /* computed height: 48px (1.5 * 32px) */
	}
</style>

<body>
	<h1 class="heading">This ackshully is not a long heading at all</h1>
  <p class="text">
    Lorem Ipsum is simply dummy text of the printing and typesetting
    industry. Lorem Ipsum has been the industry's standard dummy text ever
    since the 1500s, when an unknown printer took a galley of type and
    scrambled it to make a type specimen book. It has survived not only five
    centuries, but also the leap into electronic typesetting, remaining
    essentially unchanged. It was popularised in the 1960s with the release
    of Letraset sheets containing Lorem Ipsum passages, and more recently
    with desktop publishing software like Aldus PageMaker including versions
    of Lorem Ipsum.
  </p>
</body>
```

[rendered example output of the code snippet above]

The only thing we changed was `line-height: 1.5rem` to `line-height: 1.5`

## Accessibility

Does this have anything to do with accessibility? It most certainly does! Using unitless values will scale the line height not only with an increase in user agent font size, but also with zoom. This is huge, as one of the most common techniques used to better read web pages is to zoom the browser in. Go ahead and try it in your browser.

WCAG provides us with an advisory technique for line spacing (if you don’t know the difference between sufficient and advisory or what they mean, read about them [here](https://www.w3.org/WAI/WCAG21/Understanding/understanding-techniques)) that says:

”Many people with cognitive disabilities have trouble tracking lines of text when a block of text is single spaced. Providing spacing between 1.5 to 2 allows them to start a new line more easily once they have finished the previous one.”

After reading this, I updated a site I was working on to use 1.5 (line and a half) and *hated* it. It felt like it changed my whole site and all the body text had way too much spacing. Not really knowing how to feel I closed my laptop and thought I’d ponder the idea for a day. When I came back I hated it much less**—**in fact I even liked it. I feel like sometimes when we get used to doing something less than ideal, or even get used to things that aren’t considered a best practice, we set ourselves up for failure in the long run when we discover there’s a better way of doing things—or even a correct way! I really think this outlines the importance of good foundational knowledge not only regarding something as simple as line-height, but literally in everything that we do. Moving forward, I think I will set all my body text’s line height to at least 1.5 and take the W on a solid WCAG advisory technique. Just one small step closer to that AAA accessibility rating. 

All in all, the most important thing here is that we are not overlapping or overflowing text, making it unreadable. This would be a failure of [F104](https://www.w3.org/WAI/WCAG22/Techniques/failures/F104).

Further reading: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing

## Sum it all up

This is not fancy. This is not super smart. This is a very simple and straightforward methodology to handle a facet of what should be a very simple and straightforward thing: Displaying text. I hope all of you reading this understand it and will go out there and feel confident that the text on your site is readable for all viewers!

[A line height theme template for unitless values for TW including font-sizes]