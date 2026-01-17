---
{
title: "Why you should be using it Test Driven Development (TDD)",
published: "2022-07-26T11:21:00Z",
edited: "2022-07-27T06:59:10Z",
tags: ["tooling", "testing", "devops", "beginners"],
description: "This post is an extract from my new newsletter The Pragmatic Dev focused on covering developer tools,...",
originalLink: "https://newsletter.pragmaticdevx.dev/p/why-you-should-be-using-it-test-driven",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

***This post is an extract from my new newsletter [The Pragmatic Dev focused](https://newsletter.pragmaticdevx.dev/) on covering developer tools, tips, tricks, and related resources. Please subscribe.***

I want to start by apologizing to my subscribers for not posting an issue until now. I was planning to do it at the beginning of this month, but my life was knocked off balance by being laid off, and it took a while to re-focus my life in the middle of Job hunting. That being said, I intend to publish this newsletter weekly, preferably on Tuesdays. So, without further ado, let’s get into this issue.

This issue was inspired by a response to a tweet I posted this week:

{% embed https://x.com/mwycliffe_dev/status/1549753973627822080 %}

And the response I got from [Dominic Frei](https://twitter.com/dominicfrei), which I completely agree with, is what inspired this post.

{% embed https://x.com/dominicfrei/status/1549754583253139456 %}

#### So, why TDD?

I usually think that writing tests is something we can all agree that it’s is a good thing, especially when you combine them with automated checks. Unfortunately, whenever I share these sentiments with developers, I encounter more resistance than I usually anticipate. I have come across sentiments such as:

- Clients pay me to write code, not tests.
- I don’t have the time to write tests and so on.

But this assumes two things, you and your client can afford regressions in their project. We have all been there, made a small change, and everything stopped working. And secondly, you will have enough time to track down your changes' impact or fix any bugs and regressions. We have all heard the mantra, don’t push on a Friday, as you might not realize that a change broke something until it’s too late.

**Good** tests help alleviate some of the abovementioned problems; they can prevent a regression from hitting production and taking everything down. They also make it easy to refactor your code.

Good tests should test expected behavior rather than the internal workings of the code, meaning you should be able to re-write your code, and your tests should still pass. This means you can make changes to your code with higher confidence.

Another advantage of tests is that they act as documentation in themself, but in testing different cases, a particular piece of code may be used; it can help others who come after you understand your intention and how to use it themselves.

I hope I have made a good case for why you should always write tests. The next question is why you should write them before, not after the code. Many of us don’t like to write tests because we view writing them as a chore; however, if we re-arrange our workflow to write them upfront, they become an important asset.

Have you ever gone to write tests for a function, only to realize you don’t know what to test or how to test your function? You jumped into writing the code, which we have all done, and forgot to think about the contract for your code, i.e., your inputs and outputs. Another thing that happens very often when you jump into writing code without thinking is that, in most cases, you end up re-writing most of your code afterward to make it easier to test.

When you write tests upfront, you have to answer these questions before you can do anything else. Before writing tests, you must first clearly spell out your code's contract- the code's behavior, inputs, and outputs. Secondly, have a written plan on what the intention of the code you are about to write is, i.e., what it does and doesn’t do. And lastly, how it fits within the context of everything else, i.e., the project and other code that use it.

Are you enjoying the post so far? Subscribe for free to receive new posts and support my work.

So, to recap, by writing your tests upfront, you get the following advantages:

- You write code faster; you already made your intention clear, and it’s a matter of implementation.
- You get a faster feedback cycle; with the tests in place, you can know when your function is moving in the correct direction. This surely beats manual testing. With tools such as watch mode in jest and other test runners in different languages, you can automate the tests to run on change, rather than running the test manually.
- You have your tests - the tests you write before aren’t going anywhere, so you can use them in the future when refactoring and making changes and for automated checks before deployment in a CI environment. This will leave you with better code quality overall compared to not having tests.
- It’s not a chore - tests become an integral way of your development workflow, and instead of feeling like a chore, they start feeling like an asset that makes you more productive.
