---
{
    title: "The Art of Accessibility: Preface",
    description: "When building a product, your users will come from many walks of life. How do you support them all? Answer: Accessibility. Let's dive in and learn more.",
    published: '2025-04-02T22:12:03.284Z',
    tags: ['webdev', 'accessibility'],
    attached: [],
    order: 1
}
---

As application developers, our job is to make sure that people have a good experience with the apps we build. While performance and stability make up part of that story, a user's experience (or, UX) is made up of multiple different aspects of their interactions with the app. 

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

This button is more rounded, has a drop shadow, and matches Google's design language.

Between the three buttons, which one do you want to use on your page?

The first button is clearly not a good contender, since it's invisible to the end user. That said; between the last two buttons, I think a reasonable argument could be made for either of them. There's few "objectively" correct guidelines for what a button _should_ look like.

It's important, however, to acknowledge that your decisions on the UX can impact your users long into their usage. We should be sure to test our behaviors and verify with those users that they enjoy using your app.

> Why are you talking about this now? How does it matter?

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

This button might be read by a screen-reader as "Button, Go home". 

Meanwhile, this list of items:

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
- Buttons, for those with limited mobility ([one such workflow is demonstrated by this Apple ad](https://archive.org/details/accessibility-feature-cc-us-20161018_1920x1080h))

> How does accessibility pertain to React, Angular, and Vue?

Like every other aspect of application development; you don't get perfect results without putting in the effort to making sure that aspect of your app works well.

To ensure your app is accessible, you need to:

- Learn what makes an app accessible
- Make programming considerations in your markup and styling
- Build out dedicated features to make your apps more accessible
- Test your app using assistive technologies

This _can_ be a lot of work, which may lead some to ask: "Why?"

# Why you should make your apps accessible

> Why would I spend time supporting devices like screen readers? How many of my users are blind or hard of sight?

Well, there's some major points I'd like to speak to:

1) Accessibility leads to more users, and even more funds.
2) Accessibility enhances the user experience for everyone.
3) You may have a legal requirement to be accessible.
4) Being accessible is the right thing to do.

## Accessibility leads to more users, and even more funds

If you build something, isn't there a certain draw to having as many people engage with it as possible?

There's an appeal to having your work appreciated by an audience, especially for side projects.

Worried about the bottom line? Accessibility helps here, too.

[It is estimated that 1.3 billion people worldwide are disabled.](https://www.who.int/news-room/fact-sheets/detail/disability-and-health) This results in a 16% estimation of the worlds population. This means that 1 in 6 people worldwide have a disability.

Any of these users are potential customers for you. By widening the pool of users that are able to utilize your application, you're enabling the ability for these users to pay for your services.

The disabled community will spend money if your product/brand is accessible. That, in turn, will cause for word of your product, app, or brand to be spread throughout the disabled community.

## Accessibility enhances the user experience for everyone

Are you sighted? Have you ever stepped outside from a dark interior to the bright outdoors and been unable to see momentarily?

Maybe you're able to hear, but have been in a loud club where you were unable to hear your phone ring?

If so, you've experienced a situational disability; one that an application with considerations for accessibility could have helped with.

That club example? A vibration motor could help you notice receiving a phone call.

As [Microsoft's Inclusive Design group](https://inclusive.microsoft.design/) points out, there are a myriad of these scenarios that could lead someone to use assistive technologies. Here's a few they were able to mention in the toolkit specifically:

<table>
	<tr>
	  <th></th>
		<th scope="col">Permanent</th>
		<th scope="col">Temporary</th>
		<th scope="col">Situational</th>
	</tr>
	<tr>
		<th scope="row">Touch</th>
		<td><img role="img" alt="Someone with one arm" src="./one_arm.svg" style="height: 200px; filter: var(--invertOnDarkOnly);"/><br/>One arm</td>
		<td><img role="img" alt="Someone with an arm in a sling" src="./arm_injury.svg" style="height: 200px; filter: var(--invertOnDarkOnly);"/><br/>Arm injury</td>
		<td><img role="img" alt="Someone holding a baby" src="./new_parent.svg" style="height: 200px; filter: var(--invertOnDarkOnly);"/><br/>New parent</td>
	</tr>
	<tr>
		<th scope="row">Sight</th>
		<td><img role="img" alt="Someone wearing dark eyewear with a dog and a cane" src="./blind.svg" style="height: 200px; filter: var(--invertOnDarkOnly);"/><br/>Blind</td>
		<td><img role="img" alt="Someone with eye protection and a cane" src="./cataract.svg" style="height: 200px; filter: var(--invertOnDarkOnly);"/><br/>Cataract</td>
		<td><img role="img" alt="Someone driving a car with their head turned" src="./distracted_driver.svg" style="height: 200px; filter: var(--invertOnDarkOnly);"/><br/>Distracted driver</td>
	</tr>
	<tr>
		<th scope="row">Hearing</th>
		<td><img role="img" alt="Someone standing" src="./deaf.svg" style="height: 200px; filter: var(--invertOnDarkOnly);"/><br/>Deaf</td>
		<td><img role="img" alt="Someone standing with their ear highlighted" src="./ear_infection.svg" style="height: 200px; filter: var(--invertOnDarkOnly);"/><br/>Ear infection</td>
		<td><img role="img" alt="Someone with a drink shaker and sound waves aimed at their head" src="./bartender.svg" style="height: 200px; filter: var(--invertOnDarkOnly);"/><br/>Bartender</td>
	</tr>
	<tr>
		<th scope="row">Speaking</th>
		<td><img role="img" alt="Someone standing" src="./non_verbal.svg" style="height: 200px; filter: var(--invertOnDarkOnly);"/><br/>Non-verbal</td>
		<td><img role="img" alt="Someone standing" src="./laryngitis.svg" style="height: 200px; filter: var(--invertOnDarkOnly);"/><br/>Laryngitis</td>
		<td><img role="img" alt="Someone standing in viking gear" src="./heavy_accent.svg" style="height: 200px; filter: var(--invertOnDarkOnly);"/><br/>Heavy accent</td>
	</tr>
</table>

> [Graphics courtesy of Microsoft via their Inclusive Toolkit PDF](https://download.microsoft.com/download/b/0/d/b0d4bf87-09ce-4417-8f28-d60703d672ed/inclusive_toolkit_manual_final.pdf).

Similarly, even if you're not disabled in any way, you may still take advantage of accessibility features. Take keyboard navigation, for example: many power users of their machines don't take their fingers off of their keyboard row for many reasons.

By making sure that your apps are accessible, you're making sure your users are being respected and taken care of, regardless of scenario.

## You may have a legal requirement to be accessible

Not only do you make money by making your tools accessible, but you may likely save money by dodging legal action against your company.

See, there are a wide range of businesses that have a legal obligation to be accessible. 

Do government contracts? If those government contracts are in the U.S, they're often subject to [Section 508](https://www.section508.gov/manage/laws-and-policies/) compliance. 

Maybe you're in the United Kingdom? You may have to comply with [The Equality Act of 2010](https://www.legislation.gov.uk/ukpga/2010/15/contents).

These laws are regulations are not only applicable in English speaking countries, either; [there is a wide range of countries that have legal requirements for applications to be accessible.](https://www.w3.org/WAI/policies/)

### Legal Repercussions

It may be easy to hear about some of these rules and assume they're not enforced; dead wrong.

In the U.S. alone, there have been a wide range of cases where these laws have been enforced.

From [Hilton being forced to pay a civil penalty of $50,000](https://www.justice.gov/opa/pr/justice-department-reaches-agreement-hilton-worldwide-inc-over-ada-violations-hilton-hotels), to [H&R Block paying a combined $145,000 to plaintiffs and civil penalties](https://www.justice.gov/opa/pr/justice-department-enters-consent-decree-national-tax-preparer-hr-block-requiring), to [a case brought against Target yielding $3.7 million dollars awarded to the plaintiffs](https://www.courtlistener.com/docket/4165835/214/national-federation-of-the-blind-v-target-corporation/), there are a swath of cases that have come forth in favor of ensuring an accessible web for all.

# Who determines what's accessible?

Accessibility is an component of user experience (UX) design. While some avenues of UX feel standardized today, ask 30 people how they want their interfaces to behave and you might get 30 different answers.

This isn't to say that it's a _total_ free-for-all, however. Even visual elements of apps can be tested to demonstrate better or worse outcomes consistently through user research.

While larger organizations may host their own user research at broad scales to figure out what's optimal, this is often too expensive for smaller teams to perform.

Luckily for all of us, there's a standards body that aims to bring much of this user research to a generalized consensus via the **["Web Accessibility Initiative" (WAI)](https://www.w3.org/WAI/)** from **["The World Wide Web Consortium" (W3C)](https://www.w3.org/)**.

You may know the work of the W3C as the stewards of the HTML and CSS standards through the HTML Working Group (HTMLWG) and CSS Working Group (CSSWG) respectively.

However, you may not be familiar with their work in the accessibility space which is conducted through the WIA group. WIA is comprised of accessibility experts and professionals, organizations representing people with disabilities, policy makers, and more. Together, they publish the **"Web Content Accessibility Guidelines" (WCAG)**, which acts as the de-facto guidelines for what makes a project more or less accessible.

The WCAG guidelines may see revisions and improvements through different version numbers; for example, this book aims to conform to the guidance of WCAG 2.2, but the general goal remains consistent: Help developers and organizations figure out what the best practices are for their apps' UX.

## Different levels of compliance

Humans come in many shapes and sizes, both literally as well as metaphorically. This diversity allows us to have fresh perspectives and ideas that innovate in every facet of life, but it also introduces a high level of permutations in which a user is able to interact with our software.

Similarly, this variation of engagement allows all walks of life to interface with their machines; from newcomers who might hover over every icon to see its meaning, to skilled hackers skipping entire interaction types by never lifting their fingers from their keyboard.

But this variety doesn't come for free. For each unique combination of user behavior, we need to:

- Implement the baseline functionality's needs
- Test our software against it
- Edge-case against and fix bugs

And more.

How can we prioritize which features of accessibility we should start on? How can we balance effort against the impact a set of functionality will provide?

Intro: **WCAG Conformance Levels**.

WCAG Conformance Levels are broken into three different categories:

- **A**: The most basic level of WCAG conformance comprising of a set of guidelines to follow. Without these guidelines met, many of your users may face a barrier preventing them from interacting with your work.
  - EG: Descriptive text for images for non-sighted users, keyboard navigation, and accessible forms.
- **AA**: Includes all of "A" level rules. May impact the "look and feel" of the site, but provides additional value to all users.
  - EG: Basic color contrast for visually impaired users, text resizing support, headings level structure.
- **AAA**: The highest level of WCAG conformance which includes all of "A" and "AA" level rules as well as its own. May furtherly constrain the "look and feel" of the site, but provides the most value to many users.
  - EG: More rigorous contrast requirements, sign language for live video.

# How can I make my apps accessible?

Making apps more accessible isn't a one-size fits all solution. While some may sell one-click solutions, such as "accessibility overlays", I can confidently say that at best they're snake-oil and at worst they can do more harm than doing nothing at all.

> What am I to do instead?

As with any other aspect of engineering, making sites available to more users in more friendly ways requires us to learn a bit about the structure of applications, the underlying APIs, and how to leverage them best.

This resource aims to help you learn these tools and methods and apply them as you see fit.

## What we're not learning

Before we dive into the contents of this book, I'm a firm believer that it's just as important to know what we _won't_ be covering as it is what we _will_ be learning.

In "The Art of Accessibility", we _will not_ be learning the following:

- How to graphically design things
- How to navigate corporate systems to solve accessibility problems
- General programming guidance

While there is absolutely value to each of these, removing them from our prevue enables us to stay focused on the implementation details of common in-app accessibility patterns. There's one last thing:

**This book is far from everything there is to know about accessibility**. You should use this book as a jumping off point for further research and improvement, not as the de-facto guide of making a site or app accessible.

## Content outline

Let's refocus ourselves back onto **what we will be learning**:

- [What "Semantic markup" is](/posts/art-of-a11y-semantic-markup)
  - Why you shouldn't use `div`s everywhere
  - What "Accessible Rich Internet Applications" (ARIA) attributes are
  - How to use `roles` responsibly
- [How to manage text properly](/posts/art-of-a11y-text)
  - AA vs AAA contrast differences
  - Allow user-managed text scaling
  - Managing heading maps properly
- Making `input` labels more accessible
  - Implicit and explicit element association
  - Problems with placeholders
  - Using "Universally Unique Identifier"s (UUID)
- Handling keyboard input
  - Managing focus states
  - Styling focus behavior
  - Adding keyboard shortcuts
- Handling mouse input
  - Supporting different mouse events
  - Accessible scroll animations
  - Different cursor pointers
- Interacting with dynamic content
  - Animation support
  - How to read live events out loud
- Building interactive components
  - Popovers
  - Dialogs
- Utilizing tooling
  - Manual testing
  - Debugging
  - Automated testing

Let's dive in!
