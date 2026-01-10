---
{
title: "100% Code Coverage is a Lie 🎯",
published: "2023-02-09T18:20:00Z",
tags: ["postgres", "sql", "howto"],
description: "On a project I finally hit 100% Code Coverage 🎯 what could go wrong now? I tested ALL lines of my...",
originalLink: "https://leonardomontini.dev/code-coverage-is-a-lie/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "21771",
order: 1
}
---

On a project I finally hit 100% Code Coverage 🎯 what could go wrong now? I tested ALL lines of my code, there are no bugs! Well... not really.

If your only goal is having high coverage, you're probably doing more harm than good, wasting time on near-to-useless tests just to see the green coverage report. And bugs might still be there.

Imagine adding tests for simple getters and setters or an empty constructor with no logic. Do they increase the coverage? Yes. Do they add value? Nope.

The goal of tests is to ensure that the code works as expected, not to increase the coverage. If you're not testing the business logic, you're not testing the code. Many projects have to meet certain coverage thresholds, which might make sense if you see it as an enforcement tool to ensure tests are written, but it doesn't have to be the goal or the only thing that matters.

Sure, if you validate that certain lines are tested it's better than not having them tested at all, but as long as edge cases are not covered, that coverage metric isn't worth much.

Those reports should be used instead as a metric to indicate which parts of the code might need more testing. Once identified, forget about the % and write robust tests on the business logic, including possible edge cases.

Beware: **Code Coverage is a tool, not a goal**.

---

If you're curious to hear more about my opinion on Code Coverage, I recorded a video and you can find it on YouTube!

{% youtube WxoSoxVgyUw %}

---

As a bonus content, to further explain the concept, there's a joke on this tweet that makes it really easy to understand:

![Tweet](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uqxis2kvcg9lle0z4chp.png)


Code coverage is not enough and edge cases are not enough still. You need to test the business logic, not the code. Coverage will come naturally.

---

What do you think about code coverage? Do you like having coverage thresholds in projects? How high? Let's discuss in the comments!

---


Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}