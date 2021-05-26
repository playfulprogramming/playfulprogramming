# Friendly Foundations

If you're coming across this article and haven't heard about "accessability" (often shortened to "A11Y") before, that's okay. We're all learning at different speeds and come across new things all the time. That said, accessability is a critial component to any frontend engineer's responsibilities. We emplore you to explore what that means, not just in this blog post but beyond with your teams and communities.

First, let's define what "accessibility" is. Accessability in engineering is ["the process of creating products that are usable by people with the widest possible range of abilities"](https://dl.acm.org/doi/10.1145/2596695.2596719). 

Your may have vision-impaired or blind users of your app. These users may rely on [screen readers](https://www.afb.org/blindness-and-low-vision/using-technology/assistive-technology-products/screen-readers), which allows users to navigate their computer with their sense of hearing. These methods may be used in tandum with the visual experience for some users or used independantly to navigate their computer auditorily.

You may also have have users with limited mobility, who utilizes buttons to trigger different behaviors on their machine.

> If you're a visual learner who would like to see some short-and-quick workflows from users like this, [one of Apple's ads](https://www.youtube.com/watch?v=XB4cjbYywqg) displays a few usescases that proper accessability support can enable.

Something to keep in mind is that these disabilities may not be perminant. For example, if you fall and break your arm, you may be only using one arm while healing. Likewise, there's sitauational impairments as well. A new parent may have to hold their child while trying to do things. Here's a chart that outlines a few more of these examples:

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

Creating an application that's accessible means that you're making a better experience for _all_ of your users, ready for any context they might be using your app in,



There are different scales of accessability as well. 

---



Mention what WCAG is, what AA is, and what AAA is



----






Accessability isn't a pure science, however. If you're sighted, this may be an abstract idea at first. However, think of it like this: the colors an app uses or a button's placement visually may convey different messages and meaning depending on their context. This same problem applies to users of screen-readers and other accessibile tech as well, just with different constraints. Having the screen visually cluttered, making content difficult to read, might be a similar experience to having a site where the footer's contents are inexplicably read before the main page's content.

# Smartly using Semantic HTML Tags

One of the easiest things you can do for your application's accessability is to use semantic HTML tags. 






Not only will this enhance the experience of your screen-reader using users, but because search engine crawlers rely on HTML tags to inform what's what, your site will rank better in search engine queries as well! This is a massive boon to your site's SEO score.

# Contrast is Cool

While screen-readers are imperative to consider for front-end work, a site's visuals can help provide a good experience for many users. While a certain color palette may be aesthetically pleasing, it may be difficult to read for a colorblind user. Colorblind users aren't the only ones impacted, however.

While there are various reasons a user might not be able to see weakly contrasted color, everyone is different. See if you can distinguish the text from the background in the displayed image with poor contrast:

<img alt="Dark gray text on a black background" src="./color_fail.png" style="max-width: 600px; width: 100%"/>

Now, compare that to highly contrasted colors: 

<img alt="White text on a black background" src="./color_pass.png" style="max-width: 600px; width: 100%"/>


The contents are not only easier to distinguish from the background, but even for those that _can_ see the contents it's made easier to focus on as a result of the increased contrast. 



# Fanstastic Fonts

`1rem`



Not only do you have these settings on mobile devices, but they're available on desktop as well. 



Using Chrome, go to [your settings page](chrome://settings/?search=font+size), and you should be able to set your font size.

![Font settings in Chrome](./chrome_font_size.png)

You can do the same in Firefox in [your preferences](about:preferences#general).

![Font settings in Firefox](./firefox_font_size.png)

# Keyboard is King

While the average of users might utilize your application with a mouse


This impacts not only people that are using screen readers on your site, but enables power users of your application to be more efficient as well.

# Understand `aria-` properties

# Humans Can’t Be Automated



# Test, Test, Test Again



# Fanstatic Features

While there is plenty you can do to make existing functionality accessibility friendly, it's often forgotten that a strongly accessible app may opt to add specific functionality for it's users with disabilities.



Some great examples of things like this are sites with lots of user-generated content. For example, Twitter allows its users to [add "alt" text to their uploaded images and GIFs](https://help.twitter.com/en/using-twitter/picture-descriptions). Likewise, YouTube has the ability to [add subtitles and captions](https://support.google.com/youtube/answer/2734796?hl=en) to uploaded videos on their platform. 



# Conclusion

We hope you've enjoyed learning from our accolade-worthy alliterative headlines.

While this article outlines many basics of web accessability, it's far from a complete guide. Remember that accessability is as much UX as visual design. To get it in a great place for your users takes active effort like any other part of your app. 