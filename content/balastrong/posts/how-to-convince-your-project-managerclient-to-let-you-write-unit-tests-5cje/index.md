---
{
title: "How to Convince your Project Manager/Client to let you write Unit Tests",
published: "2023-05-24T20:23:40Z",
tags: ["testing", "webdev", "productivity", "coding"],
description: "I recently shared a video where I showed how Copilot Chat can write tests for you, a funny demo, but...",
originalLink: "https://leonardomontini.dev/save-time-with-automated-tests/",
coverImg: "cover-image.png",
socialImg: "social-image.png",
collection: "Web Development",
order: 7
}
---

I recently shared a video where I showed how [Copilot Chat can write tests for you](https://youtu.be/Psm86eIvmdc), a funny demo, but today's article will not be about AI. The thing is, it should not be a matter of time.

If you ship some code, you should consider automated tests as an actual part of the code. You wouldn't deliver half a feature, right?

Something that usually helps me put it in perspective in case a client or a project manager is not convinced is to try to visualize that tests are not necessarily something for today, but rather for tomorrow.

Let's make it simple, spending 20% more time today to save 80% of the time tomorrow should sound like a good deal.

> But we can't! Today we're in a hurry!

Ok cool, we can save 20% of time today... but what if we'll be in a hurry again tomorrow? Technical debt is a thing.

## Pros & Cons

I mean, writing tests is hard, and that's why it takes time. However, the more you write tests, the better and more testable will be your code, and the less time you'll spend the next time!

On this topic I recorded a video where I go through some pros and cons, in particular:

### Pros

- Find bugs early - no need to explain this one, rather than finding a bug in production, you find it while writing the code
- Tests are like documentation - if you're new to the project and you look at the test descriptions, you immediately get some insights into what some code does
- Fewer bugs on changes - everytime you change something you might break something else, tests will tell you if you did, as long as they're good ones
- Save time - as mentioned above, you'll spend more time today, but you'll save a lot of time tomorrow, in particular when a bug is found in production
- Write better code - this is a really convenient side effect, writing tests will actually force you to write better code, more modular and readable

### Cons

- Being overconfident - if you have 100% code coverage, you might think that your code is perfect, but that's not true. What about edge cases? Are those covered?
- Maintenance cost - tests are code, and as such they need to be maintained. If you change something in the code, you might need to change the tests as well
- Longer builds - if you have a lot of tests, your build will take longer. There are indeed some optimization, but at some point your tests will have to run
- Wrong usage of Code Coverage - code coverage is a metric, and as such it can be used in the wrong way. If you have 100% code coverage, it doesn't mean that your code is perfect, it just means that all the lines are executed at least once. You might have a lot of tests, but if they're not testing the right things, you're not really testing anything... I mean, once again I recorded an entire video on this topic, you can find it [here](https://youtu.be/WxoSoxVgyUw)

## More on this topic

This was just a highlight of what the video will be about, if you're interested in hearing about my take, you can watch it here:

<iframe src="https://www.youtube.com/watch?v=hrhblEwtAoU"></iframe>

---

Thanks for reading this article, I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)

<!-- ::user id="balastrong" -->
