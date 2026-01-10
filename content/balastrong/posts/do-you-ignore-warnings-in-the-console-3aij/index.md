---
{
title: "You shouldn't ignore warnings in the console",
published: "2024-01-09T13:36:49Z",
edited: "2024-01-09T13:37:10Z",
tags: [],
description: "How often when you run your build command you see a bunch of warnings in the console? I mean, they've...",
originalLink: "https://leonardomontini.dev/broken-windows-warnings",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "21771",
order: 1
}
---

How often when you run your build command you see a bunch of warnings in the console? I mean, they've always been there so why even bother fixing them if the app works awnyway?

I talk about that in today's video, you can watch it here or read the transcript below.

{% youtube -ydEWqNjPSw %}

## The Broken Window Theory

Let's tackle this topic from a different perspective, have you ever heard of the Broken Window Theory? Let me explain: you're strolling through a neighborhood with a lot of buildings, but one of them has one broken window.

In criminology, this theory suggests that visible signs of disorder and neglect in an environment can lead to even more disorder and problems. It's like a code of conduct for buildings—a broken window invites more broken windows.

On the other hand, if a building still has all its windows intact, it's less likely to attract vandalism and other crimes.

Now, let's apply this theory to software development, why you should care and how can you avoid potential disasters.

## The problem with warnings

First of all, too many warnings can lead to what we call "warning fatigue". It's when we get so used to seeing warnings that we start ignoring them, thinking they're just noise in the system.

Besides, if our new changes introduce new warnings on top of the many that are already there, we might not care or don't notice at all! One more broken window won't make a difference, right?

Well, it does make a difference.

Warning messages can inform you about potential bugs in your code, performance losses, or even security vulnerabilities. Ignoring them might have tremendous consequences in the long run.

## Potential solutions

So, what can we do to avoid this situation? Well, before talking about some tools you might use, the very first system to put in place is requiring a cultural change in your team.

Caring about the quality of what you deliver is one of those required aspects when transitioning from a junior to a mid or senior developer. It's not just about writing code that works, producing quality software is one of the many nuances that make a developer a good developer.

Whatever tool you're going to adopt, it's not gonna work unless your company culture cares about code quality. Otherwise, you'll probably end up ignoring the warnings anyway or finding ways to bypass the system.

Speaking about the tools, I think the two easiest options are having a CI pipeline that fails if there are warnings or if your project cannot have it, you can always set up git hooks preventing commit or push.

I'm not going to go into details about how to set up these tools as you can find in my channel a video specifically on that, but if you want to know more about it, let me know in the comments below.

## Closing

So, the next time you find yourself surrounded by a cascade of warnings, ask yourself: are we fixing the broken windows in our code, or are we just getting used to the cracks? Let's build software that stands strong, one fixed window—or warning—at a time.

If you found this video interesting, make sure to subscribe to my channel so that my new videos will show up in your homepage. If you also leave a like, it's free for you and it will help this video reach more people.

With that said, thanks for watching and see you in the next video!

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
