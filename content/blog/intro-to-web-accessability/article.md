# Friendly Foundations

If you're coming across this article and haven't heard about "accessibility" (often shortened to "A11Y") before, that's okay. We're all learning at different speeds and come across new things all the time. That said, accessibility is a critical component to any frontend engineer's responsibilities. We implore you to explore what that means, not just in this blog post but beyond with your teams and communities.

First, let's define what "accessibility" is. Accessibility in engineering is ["the process of creating products that are usable by people with the widest possible range of abilities"](https://dl.acm.org/doi/10.1145/2596695.2596719). 

Your may have vision-impaired or blind users of your app. These users may rely on [screen readers](https://www.afb.org/blindness-and-low-vision/using-technology/assistive-technology-products/screen-readers), which allows users to navigate their computer with their sense of hearing. These methods may be used in tandem with the visual experience for some users or used independently to navigate their computer auditorily.

You may also have have users with limited mobility, who utilizes buttons to trigger different behaviors on their machine.

> If you're a visual learner who would like to see some short-and-quick workflows from users like this, [one of Apple's ads](https://www.youtube.com/watch?v=XB4cjbYywqg) displays a few uses cases that proper accessibility support can enable.

Something to keep in mind is that these disabilities may not be permanent. For example, if you fall and break your arm, you may be only using one arm while healing. Likewise, there's situational impairments as well. A new parent may have to hold their child while trying to do things. Here's a chart that outlines a few more of these examples:

<table>
	<tr>
	  <th></th>
		<th scope="col">Permanent</th>
		<th scope="col">Temporary</th>
		<th scope="col">Situational</th>
	</tr>
	<tr>
		<th scope="row">Touch</th>
		<td><img src="./one_arm.png" style="height: 200px" alt=""/><br/>One arm</td>
		<td><img src="./arm_injury.png" style="height: 200px" alt=""/><br/>Arm injury</td>
		<td><img src="./new_parent.png" style="height: 200px" alt=""/><br/>New parent</td>
	</tr>
	<tr>
		<th scope="row">See</th>
		<td><img src="./blind.png" style="height: 200px" alt=""/><br/>Blind</td>
		<td><img src="./cataract.png" style="height: 200px" alt=""/><br/>Cataract</td>
		<td><img src="./distracted_driver.png" style="height: 200px" alt=""/><br/>Distracted driver</td>
	</tr>
	<tr>
		<th scope="row">Hear</th>
		<td><img src="./deaf.png" style="height: 200px" alt=""/><br/>Deaf</td>
		<td><img src="./ear_infection.png" style="height: 200px" alt=""/><br/>Ear infection</td>
		<td><img src="./bartender.png" style="height: 200px" alt=""/><br/>Bartender</td>
	</tr>
	<tr>
		<th scope="row">Speak</th>
		<td><img src="./non_verbal.png" style="height: 200px" alt=""/><br/>Non-verbal</td>
		<td><img src="./laryngitis.png" style="height: 200px" alt=""/><br/>Laryngitis</td>
		<td><img src="./heavy_accent.png" style="height: 200px" alt=""/><br/>Heavy accent</td>
	</tr>
</table>

> This chart was originally created by Microsoft as part of their [Inclusive Toolkit](https://download.microsoft.com/download/b/0/d/b0d4bf87-09ce-4417-8f28-d60703d672ed/inclusive_toolkit_manual_final.pdf) manual

Creating an application that's accessible means that you're making a better experience for _all_ of your users, ready for any context they might be using your app in.

In addition to the moral and financial incentives (by opening the door to more users), many organizations have a legal requirement to meet accessibility. US government software is subject to [Section 508](https://www.section508.gov/manage/laws-and-policies), which requires compliance to [the WCAG guidelines (which we'll touch on later)](#wcag). Likewise, private US companies may be subject to compliance due to the "Americans with Disabilities Act" (shortened to "ADA"). The U.S. isn't the only country with these requirements, either. According to [WCAG's reference page for various legal laws](https://www.w3.org/WAI/policies/), there are at least 40 such laws in place around the world.  

> Please note that we are _not_ giving legal advice. This is simply meant for educational purposes for individuals. Consult legal authorities for the appropriate jurisdiction


Accessibility isn't a pure science, however. If you're sighted, this may be an abstract idea at first. However, think of it like this: the colors an app uses or a button's placement visually may convey different messages and meaning depending on their context. This same problem applies to users of screen-readers and other accessible tech as well, just with different constraints. Having the screen visually cluttered, making content difficult to read, might be a similar experience to having a site where the footer's contents are inexplicably read before the main page's content.

# Sensible Standards {#wcag}

While accessibility has some levels of subjectivity involved, it's important to note that there _are_ standards surrounding web application's accessibility support. ["Web Content Accessibility Guidelines"](https://www.w3.org/WAI/) (shortened to "WCAG") are guidelines to follow when considering your app's accessibility.  These guidelines are published by  a subgroup of the [World Wide Web Consortium](https://www.w3.org/) (shortened to "W3C"). W3C is the main international standards organization for the Internet. WCAG acts as the de-facto guidelines for A11Y.

There are different scales of accessibility as well. [WCAG includes three different levels of conformance](https://www.w3.org/WAI/WCAG2AA-Conformance):

> - Level A is the minimum level.
> - Level AA includes all Level A and AA requirements. Many organizations strive to meet Level AA.
> - Level AAA includes all Level A, AA, and AAA requirements.

Meeting AA requirements is typically seen as a good commitment to accessibility, but AAA will open more doors to your users and is the gold-standard for accessible UX. 

Far from a comprehensive list, AA covers things like:

- Screen reader experience
- [Minimum contrast guidelines](#contrast)
- [Text resize support](#font-resize)
- [Video captions](https://www.w3.org/TR/WCAG21/#captions-live)
- [Basic support for keyboard navigation](#keyboard)

Meanwhile, AAA includes support for:

- [High contrast mode](https://www.w3.org/TR/WCAG21/#contrast-enhanced)
- [Reduced/restricted animations](https://www.w3.org/TR/WCAG21/#animation-from-interactions)
- [Video sign language support](https://www.w3.org/TR/WCAG21/#sign-language-prerecorded)
- [Full website functionality with keyboard](#keyboard)

Among other things.

# Smartly using Semantic HTML Tags

One of the easiest things you can do for your application's accessibility is to use semantic HTML tags. 

Let's say we have HTML to display fruits in a list:

```html
<div>
    <div>Orange</div>
    <div>Banana</div>
    <div>Grapefruit</div>
</div>
```

While this will display the contents, and you may be able to use CSS to add styling to make this look like a list, the browser has no way of knowing that this is a list. This is reflected in how screen-readers read that HTML output.

--------- ADD VIDEO OF VOICEOVER READING THIS HTML ----------

Likewise, search engine crawlers won't know that this is a list. If you're only using `div` tags as far as Google's concerned, you have no lists, no headings, nothing. This makes the page significantly less engaging and therefore rank more poorly.

Let's compare that to using the correct HTML tags for a list.

```html
<ul aria-label="List of fruits">
    <li>Orange</li>
    <li>Banana</li>
    <li>Grapefruit</li>
</ul>
```

--------- ADD VIDEO OF VOICEOVER READING THIS HTML ----------

As you can hear, this screen-reader is now able to read out that it's a list. It makes navigation of that list easier for those users by allowing them to quickly skip to the next list item and hear the index of an item in the list.

Not only will this enhance the experience of your screen-reader using users, but because search engine crawlers rely on HTML tags to inform what's what, your site will rank better in search engine queries as well! This is a massive boon to your site's SEO score.

# Understand `aria-` properties

In our previous example, we used an HTML attribute [`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute) on our `ul`. [ARIA is collection of HTML attributes that allow you to enhance the accessibility in applications](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA). That said, _**it is highly encouraged to use the suggested HTML tags instead of `aria` attributes whenever possible**_. Think of `aria` as a complex low level API that can enhance your experience when done properly, but drastically harm user experience when unproperly utilized.

A small subsection of `aria-` attributes includes:

- [`aria-labelledby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-labelledby_attribute) - Associate the element with another element's text as the label 
- `aria-expanded` - A Boolean value meant to communicate when a dropdown is expanded
- `aria-valuemin` - The minimum allowed value in a numerical input
- `aria-valuemax` - The maximum allowed value of a numerical input

Additional to `aria` props, there's the `role` property that acts to have the browser see and read an element as a different one. Again, this is a highly advanced (and often incorrectly deployed) API for complex apps. To learn more, [read through Mozilla's ARIA basics article.](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/WAI-ARIA_basics)

# Contrast is Cool {#contrast}

While screen-readers are imperative to consider for front-end work, a site's visuals can help provide a good experience for many users. While a certain color palette may be aesthetically pleasing, it may be difficult to read for a colorblind user. Colorblind users aren't the only ones impacted, however.

While there are various reasons a user might not be able to see weakly contrasted color, everyone is different. See if you can distinguish the text from the background in the displayed image with poor contrast:

<img alt="Dark gray text on a black background" src="./color_fail.png" style="max-width: 600px; width: 100%"/>

Now, compare that to highly contrasted colors: 

<img alt="White text on a black background" src="./color_pass.png" style="max-width: 600px; width: 100%"/>

The contents are not only easier to distinguish from the background, but even for those that _can_ see the contents it's made easier to focus on as a result of the increased contrast.

This said, not all contrasts are the same. Per [WCAG guidelines](#wcag), you may have a different ratio of contrast for different compliance levels. These contrast ratios depend on both font size as well as compliance level.

![Light grey text passing AA for large text, but not small text](./pass_aa_large.png)

In this example you can see that the text passes the WCAG AA requirements for large text, but fails the same requirements for small text.

# Fantastic Fonts {#font-resize}









`1rem`

<div style="display: flex; justify-content: space-around">
<img src="./ios_text_size.png" style="height: 300px" alt="iOS font size settings screen"/>
<img src="./android_text_size.png" style="height: 300px" alt="Android font size settings screen"/>
</div>






Not only do you have these settings on mobile devices, but they're available on desktop as well. 



Using Chrome, go to [your settings page](chrome://settings/?search=font+size), and you should be able to set your font size.

![Font settings in Chrome](./chrome_font_size.png)

You can do the same in Firefox in [your preferences](about:preferences#general).

![Font settings in Firefox](./firefox_font_size.png)

# Keyboard is King

While the average of users might utilize your application with a mouse

This impacts not only people that are using screen readers on your site, but enables power users of your application to be more efficient as well.



https://www.w3.org/TR/WCAG21/#keyboard-no-exception

# Humans Can’t Be Automated

If anyone is ever advertising to you that your project can be made accessible without any changes to your codebase: they're either lying to you or don't understand accessibility properly.

# Test, Test, Test Again



# Fantastic Features

While there is plenty you can do to make existing functionality accessibility friendly, it's often forgotten that a strongly accessible app may opt to add specific functionality for it's users with disabilities.



Some great examples of things like this are sites with lots of user-generated content. For example, Twitter allows its users to [add "alt" text to their uploaded images and GIFs](https://help.twitter.com/en/using-twitter/picture-descriptions). Likewise, YouTube has the ability to [add subtitles and captions](https://support.google.com/youtube/answer/2734796?hl=en) to uploaded videos on their platform. 



# Conclusion

We hope you've enjoyed learning from our accolade-worthy alliterative headlines.

While this article outlines many basics of web accessibility, it's far from a complete guide. Remember that accessibility is as much UX as visual design. To get it in a great place for your users takes active effort like any other part of your app. 