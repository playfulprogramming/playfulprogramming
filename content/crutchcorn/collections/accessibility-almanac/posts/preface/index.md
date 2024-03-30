---
{
    title: "Preface",
    description: "",
    published: '2025-01-01T22:12:03.284Z',
    tags: ['webdev', 'accessibility'],
    attached: [],
    order: 1,
    collection: "accessibility-almanac"
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

## 1. Accessibility leads to more users, and even more funds

If you build something, isn't there a certain draw to having as many people engage with it as possible?

There's an appeal to having your work appreciated by an audience, especially for side projects.

Worried about the bottom line? Accessibility helps here, too.

Keep in mind, any user is potentially a paying user. By widening the pool of users that are able to utilize your application, you're enabling the ability for these users to pay for your services.

If I, the end user, aren't able to make the most of your services, why would I pay for them?

Likewise, word of mouth can make a massive impact to custom success and growth. I'm much more likely to use a product that has universally glowing reviews as opposed to one that has a range of usability issues.

Given all of this; It's no surprise that the classic verbiage of a product's success isn't "Gate away as many users as you can". Rather, a wise business person will make their doors as open as possible to new customers.

## 2. Accessibility enhances the user experience for everyone

Are you sighted? Have you ever stepped outside from a dark interior to the bright outdoors and been unable to see momentarily?

Maybe you're able to hear, but have been in a loud club where you were unable to hear your phone ring?

If so, you've experienced a situational disability; one that an applications with considerations for accessibility could have helped with.

That bar example? A vibration motor could help you notice receiving a phone call.

As [Microsoft's Inclusive Toolkit](https://download.microsoft.com/download/b/0/d/b0d4bf87-09ce-4417-8f28-d60703d672ed/inclusive_toolkit_manual_final.pdf) points out, there are a myriad of these scenarios that could lead someone to use assistive technologies. Here's a few they were able to mention in the toolkit specifically:

<table>
	<tr>
	  <th></th>
		<th scope="col">Permanent</th>
		<th scope="col">Temporary</th>
		<th scope="col">Situational</th>
	</tr>
	<tr>
		<th scope="row">Touch</th>
		<td><img src="./one_arm.png" style="height: 200px"/><br/>One arm</td>
		<td><img src="./arm_injury.png" style="height: 200px"/><br/>Arm injury</td>
		<td><img src="./new_parent.png" style="height: 200px"/><br/>New parent</td>
	</tr>
	<tr>
		<th scope="row">Sight</th>
		<td><img src="./blind.png" style="height: 200px"/><br/>Blind</td>
		<td><img src="./cataract.png" style="height: 200px"/><br/>Cataract</td>
		<td><img src="./distracted_driver.png" style="height: 200px"/><br/>Distracted driver</td>
	</tr>
	<tr>
		<th scope="row">Hearing</th>
		<td><img src="./deaf.png" style="height: 200px"/><br/>Deaf</td>
		<td><img src="./ear_infection.png" style="height: 200px"/><br/>Ear infection</td>
		<td><img src="./bartender.png" style="height: 200px"/><br/>Bartender</td>
	</tr>
	<tr>
		<th scope="row">Speaking</th>
		<td><img src="./non_verbal.png" style="height: 200px"/><br/>Non-verbal</td>
		<td><img src="./laryngitis.png" style="height: 200px"/><br/>Laryngitis</td>
		<td><img src="./heavy_accent.png" style="height: 200px"/><br/>Heavy accent</td>
	</tr>
</table>

Similarly, even if you're not disabled in any way, you may still take advantage of accessibility features. Take keyboard navigation, for example; many power users of their machines don't take their fingers off of their keyboard row for many reasons.

By making sure that your apps are accessible, you're making sure your users are being respected and taken care of, regardless of scenario.

## 3. You may have a legal requirement to be accessible

Not only do you make money by making your tools accessible, but you may likely save money by dodging legal action against your company.

See, there are a wide range of businesses that have a legal obligation to be accessible. 

Do government contracts? If those government contracts are in the U.S, they're often subject to [Section 508](https://www.section508.gov/manage/laws-and-policies/) compliance. 

Maybe you're in the United Kingdom? You may have to comply with [The Equality Act of 2010](https://www.legislation.gov.uk/ukpga/2010/15/contents).

These laws are regulations are not only applicable in English speaking countries, either; [there is a wide range of countries that have legal requirements for applications to be accessible.](https://www.w3.org/WAI/policies/)

### Legal Repercussions

It may be easy to hear about some of these rules and assume they're not enforced; dead wrong.

In the U.S. alone, there have been a wide range of cases where these laws have been enforced.

From [Hilton being forced to pay a civil penalty of $50,000](https://www.justice.gov/opa/pr/justice-department-reaches-agreement-hilton-worldwide-inc-over-ada-violations-hilton-hotels), to [H&R Block paying a combined $145,000 to plaintiffs and civil penalties](https://www.justice.gov/opa/pr/justice-department-enters-consent-decree-national-tax-preparer-hr-block-requiring), to [a case brought against Target yielding $3.7 million dollars awarded to the plaintiffs](https://www.courtlistener.com/docket/4165835/214/national-federation-of-the-blind-v-target-corporation/), there are a swath of cases that have come forth in favor of ensuring an accessible web for all.

## 4. Accessibility is the right thing to do

While the other points make for good business sense, ensuring our tools and products are accessible for as many people as possible is a moral imperative. 

Unfair challenges against a specific group of people - intentional or not - impose frustration, heartache, and pain for those users. Even small pitfalls in their experience, which others may not have to deal with, add up to an immense mental toll, as users go from application to application and face similar difficulties. 

Building products for human beings requires empathy, something best shown by fixing issues and enabling inclusion; all of which is within our capabilities as engineers.
