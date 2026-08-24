---
{
title: "Performance: Choosing The Right Tools...",
published: "2022-04-14T07:04:20Z",
edited: "2022-04-17T06:49:37Z",
tags: ["webdev", "javascript", "typescript", "performance"],
description: "Before I wrote this, I was in the middle of writing a Twitter thread about performance on the web and...",
originalLink: "https://mainawycliffe.dev/blog/performance-choosing-right-tools/",
coverImg: "cover-image.png",
socialImg: "social-image.png"
}
---

Before I wrote this, I was in the middle of writing a Twitter thread about performance on the web and the unintended impact tools developers choose to build their websites have on their users. As I was writing that, I realized that Twitter wasn't probably the most suitable medium to air my thoughts exactly, so I wrote this instead.

It's pretty common nowadays to find web developers specializing in a single framework. While there is nothing wrong with that, as long as you stick to its strengths, i.e., the right tool for the right job. The saying goes, "when you have a hammer, everything is a nail," and I have seen frontend developers who want to use the only Framework they know for everything, despite it not being the right fit for the task at hand.

## Some Background

Before I can go any further, let me give you some context. I am from Kenya, and most of my friends have $200 or lower smartphones, and about half of those have a $100 or lower smartphone; some don't even have smartphones. This means the devices most of my friends own are quite limited performance-wise. And this is one crucial area we as developers need to understand as we tend to have more powerful devices at our disposal.

The other thing to be aware of is the state of internet connectivity. It's pretty decent, maybe even good, in some areas, primarily Urban areas, but the speed and reliability fall off the cliff when you start heading to informal settlements and rural areas. This trend can be replicated all over Africa, and I believe in large parts of the world.

## Performance

![](./tenor.gif)

So, why am I telling you this? When it comes to performance, you need to approach it in two folds: First, the number of KBs the user has to download and the device's capability the user has. The internet speed is impacted by the device in question capabilities, not just the internet coverage. Users with low-end devices tend to also live in areas with poor internet coverage and connectivity.

The more the KBs your JS script is, the longer it will take to download the script before we can get to parsing, which will also be slower due to device capability limitations. As you can imagine, both of these can take a frustrating longer time on a low-end device on a slow network. When we develop poor-performing websites, i.e., takes longer to load, huge scrips that take a toll on the processor and battery life, we negatively impact our users, especially the already disadvantaged.

When I am using my iPhone 13 Pro Max (or whatever the latest model is as you are reading this) on the latest 5g network, I will probably notice slow performance, but it will be a minor inconvenience. However, for someone on a $100 or lower smartphone on a slow network, the impact on performance will be huge. We have all been there, trying to load a website that refuses to load or is laggy either due to poor network connection or the toll the website places on both memory and the process. This could mean the difference between someone getting life-saving information in time or not getting it.

### SPAs

One of the most popular ways of developing websites is using Single Page Applications (SPAs) frameworks popularized by React and Angular. These SPA frameworks have become a go-to for developers due to their excellent developer experience and ease of building websites, but this comes at a performance cost. SPA applications need to be bootstrapped, which means you ship your site in JavaScript for the browser to download, parse and render your website in what is known as Client-Side Rendering (CSR).

So, to recap, the user not only needs to download the Framework Code + your Application code, but they also need the browser to parse it before they can see content on your site. Depending on the size of the Framework and other libraries' sizes, this can quickly balloon to MBs of data.

Due to the above issues, we have come up with techniques to try and show the content as soon as possible such as Server-Side Rendering (SSR) and Static Site Generation (SSG). But these are not perfect solutions. They both need to put the Framework back into the rendered HTML after the initial content has been displayed for any interactivity, in a process called hydration.

This is okay (ish) if you are building a web app such as Facebook or YouTube (guess who is behind two of the most used SPA frameworks), where once the site loads, you can access a bazillion of content without having to load the site again. The examples I mentioned above behave more like apps than traditional websites.

In such instances, I may be okay paying the upfront tax, but subsequent navigations are faster, and requests and data exchange between the server and the client is more efficient. This, of course, is computationally expensive as the Framework in question has to update the DOM to create and removes nodes so that views can change.

But what if all I wanted to access was information on a single page? Think of a blog post or some instruction on applying for a government grant or social benefits. Do I have to download and run a whole web app to access this information?

As you can imagine, this can be very painful, especially for government sites, NGOs, and business services whose customer base has users with poor internet coverage and low-end devices or a combination of both.

To be honest, this should extend to everyone, no matter the internet connection speed or kind of device I have; I shouldn't have to download tons of JS code just to read your blog post.

![](./tenor-1.gif)

## In Conclusion

So, where am I going with this? The title of this article is "The Right Tool for the Right Job." I mean that as developers, we need to think about our users and the purpose of what we are building before choosing the tools to use. Whatever tools and frameworks we use, we need to emphasize more on the user experience we are providing. This means that we need to learn to have more than one tool in our toolkit and be open to learning more. Lately, we have seen an uptick in frameworks and libraries geared towards 0KB Javascript without sacrificing developer experience. I believe every front-end developer should know at least one.

We have a lot of tools at our disposal from SPAs frameworks such as Angular, React, Vue, etc., which have their use cases but should not be used for everything. On the other hand, we have frameworks and tools for building Multi-Page Applications (MPAs) and Static Sites, such as Astro, Hugo, Jekyll, etc., that are designed for shipping as little Javascript as possible while providing incredible speeds most SPAs frameworks can only dream off.

![](./tenor-2.gif)

My point is as a developer; you should make sure you have a few of these tools in your tool kit; this will ensure that whenever you are choosing, you choose the right tool for the job.
