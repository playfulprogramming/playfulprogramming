---
{
title: "Animation Inspector: How DevTools can help when Creating Animations",
published: "2021-10-14T11:25:36Z",
tags: ["animations", "devtools"],
description: "Different browsers come with a different set of dev tools to help developers. When it comes to...",
originalLink: "https://williamjuan.dev/blog/how-dev-tools-can-help-when-creating-animations",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Different browsers come with a different set of dev tools to help developers. When it comes to animations, Chrome and Firefox have an animation inspector in their dev tools specifically for debugging animations. The animation inspector lets you modify the animation on the fly, allowing you to slow down, replay, and inspect and modify the source code of your animation.

Before we dive deeper into what we can do with these tools, let me show you where you can find them. Chrome has the animation inspector option under the more tools submenu option.

![Chrome's Animation Inspector](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gird7yhwe7si60nojkb9.png)

Firefox, on the other hand, has the animation inspector under the "Inspector" option, under a tab called "Animations"

![Firefox's Animation Inspector](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tap1hd9fuigw6owdekmu.png)

> At the time this post is written, Chrome only supports CSS animations, CSS transitions, and web animations. You wouldn’t be able to use this if you are using requestAnimationFrame for your animation.

## Inspecting your Animation

If you have the animations tab open on your dev tools, you should be seeing blocks of animation groups added to the top as your animation gets triggered on your application. Clicking on the block will open up a more detailed view of the actual animations that are being executed as shown in the images below (Chrome's followed by Firefox's).

![Chrome's Animation Inspector](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/di9j7a6fhc32r2bwqym0.png)

![Firefox's Animation Inspector](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6kdnl8aab1wy840cwh4s.png)

Let’s break down the animations tab view further and discuss some of the key features:

- Controls - lets you play, pause and modify the speed of the animation
- Animation groups - shows the different groups of animations that were executed. The animation inspector groups the animations based on start time (excluding delays) predicting which animations are related to each other. From a code perspective, animations that are triggered in the same script block are grouped.
- Scrubber - you can drag the red vertical bar left and right to display the state of the animation at that time in the timeline
- Timeline - shows a breakdown of the elements in the DOM that are being animated in the animation group and the timeline for each element’s animation
- 2 solid circles - these 2 circles mark the beginning and end of the animation. It’s possible to see multiple instances of these for cases where the animation runs for multiple iterations, where these solid circles will mark the start and end of each iteration
- Highlighted section - the animation duration
- Hollow circle - timing of keyframe rules if the animation defines any

All the components in the timeline for each element can be modified by dragging them horizontally. We can modify the duration by moving the start and end solid circles, add delays by moving the highlighted section and modify keyframe timings by moving the hollow circle. We can then view the updated animation changes by clicking on the replay button to rerun the animation group.

## Tweak your Animation's Timing Function using the Bezier Curve Editor

If you are using CSS keyframes in your animation, both Chrome and Firefox's dev tools also have a tool to edit the curves of your animation dynamically using Lea Verou’s [cubic-bezier](https://cubic-bezier.com/) visualization.

This ability to modify the curves dynamically straight in the browser is extremely helpful as you no longer have to go back and forth between your editor and your browser to tweak the bezier curves to get the right timing. After modifying the bezier curve, you can then use the replay button on the animations tab to replay the animation with the updated bezier curve. Access this feature by clicking on the squiggly line icon on the animation property of your element. Below is an image of how to access the bezier curve from your animation (Chrome's followed by Firefox's).

![Chrome's Bezier Curve Editor](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nn4cjcuifhfu53338w3g.png)

![Firefox's Bezier Curve Editor](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wsetsgaehcncga0l8pdt.png)

The purple circles attached to the purple lines on the bezier curve editor are draggable vertically and horizontally to edit the curve of the line which in turn will update the cubic-bezier function. You can see a quick visualization of what the timing function looks like from the purple circle towards the top of the popup, showing how the animation will accelerate/decelerate over time.

## Wrapping Up

The animation inspector is a powerful tool that can help you when you are creating animations. I oftentimes find myself doing some fine-tuning of animations through the dev tools and copying the code over to my project.

I hope you enjoyed this short post about using Chrome and Firefox's animation inspector. If you are interested in more content like this or have any questions let me know in the comments or tweet me at [@williamjuan27](https://twitter.com/williamjuan27)