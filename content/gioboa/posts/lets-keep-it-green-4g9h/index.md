---
{
title: "Let's keep it green ✅",
published: "2022-11-04T11:07:18Z",
edited: "2022-12-20T08:17:35Z",
tags: ["refactoring", "cleancode", "testing", "webdev"],
description: "Working as a consultant I often carry out refactoring activities. I want to talk about that in this...",
originalLink: "https://dev.to/this-is-learning/lets-keep-it-green-4g9h",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Working as a consultant I often carry out refactoring activities. I want to talk about that in this article. 

## Refactoring

Performing this type of activity is not easy at all because we have to incrementally refactor an application that already works and produces money.
Starting with a greenfield application is more affordable for everyone, be able to improve something is more challenging and then you can see the benefits with cleaner and more explicable code.

## Testing

But what does testing have to do with it now?
In my opinion, at the basis of a successful refactoring there must be a battery of tests that certify the operation of the application. It is like a contract that guarantees that everything is working as we expect.
If the code base we are going to refactor does not contain tests, the first thing to do is to create new ones to have a good starting base to work on.

## A real example

I take as an example a case that recently happened to me. The project I was working on had bundle size problems and among other things, I decided to replace the [Moment.js](https://github.com/moment/moment/#project-status) library because is legacy and not very suitable for tree shaking.

> In computing, tree shaking is a dead code elimination technique that is applied when optimizing code.
[wikipedia](https://en.wikipedia.org/wiki/Tree_shaking)

Here are the refactoring steps:

#### Step 1

I centralized all the calls to the library in a single file to have everything under control and avoid having to touch too many parts of the application.

> 💡 Collect third-party libraries into specific files is always a good practice
 
#### Step 2 

I went to cover the methods that communicate with the external library with the tests, this allowed me to guarantee, even after my refactoring, the same behavior.

#### Step 3 

With a working test suite I replaced Moment.js with [Day.js](https://day.js.org/), a very similar library, but with the advantage of being modular and therefore suitable for the tree shaking operation.

## Results 🚀

I analysed the bundle with [rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer)

Before (Moment.js)

![Moment.js](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yiilmzbdpydzjjkth50h.png)

After (Day.js)

![Day.js](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8rlontfziz6axtar8e96.png)

---

This is just one of the operations I've done to improve the application and with this small and useful refactoring we have a leaner and more tested application.

---

You can [follow me on Twitter](https://twitter.com/giorgio_boa), where I'm posting or retweeting interesting articles.

I hope you enjoyed this article, don't forget to give ❤️.
Bye 👋

{% embed https://dev.to/gioboa %}
