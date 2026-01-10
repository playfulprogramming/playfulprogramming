---
{
title: "A deep dive into new control flow syntax for Angular (17)",
published: "2023-11-20T15:18:19Z",
tags: ["angular", "webdev", "typescript", "javascript"],
description: "With the release of Angular 17, I wanted to explore the control flow syntax in Angular and...",
originalLink: "https://newsletter.unstacked.dev/p/a-deep-dive-into-new-control-flow",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

With the release of Angular 17, I wanted to explore the control flow syntax in Angular and demonstrate its benefits. The new syntax, which was part of the release for v17 of Angular, alongside a torn of other features we are going to look at in the future, is a big deal and a huge departure from how we accomplished control flow in Angular.

Control flow is the order in which statements are executed by the computer in a script. We can use conditions (`if…else, switch` statements) to determine which statements to execute and which to skip when certain conditions are met. We can even repeatedly execute statements using loops.

Subscribed

Angular is getting a new syntax for control flow, a major departure from what things were (I will refer to it as the old syntax), and still are, as the new control flow syntax is still in the developer preview.

First, let’s compare the new syntax with the old syntax.

#### If Conditions

Let’s say we want to show a section of our template if the conditions are true. With the old syntax, we would do it like this:

![](./https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3a1d9cea-32c8-474a-885f-a607a1169e2d_964x308.png)

Old if….else conditional syntax in Angular

But now, with the all-new syntax, this would look like this:

![](./https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb0cfc9a4-2cd2-4bae-a62d-5b353c0a4702_554x308.png)

New Angular if…else conditional syntax

Or can be further simplified to:

![](./https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc64f00f8-7da9-4d6e-ae25-64d9053bbe92_432x352.png)

#### For Loop

What about for loops:

**Old**

![Angular Old For Loop Syntax](./https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F71395fc2-04cc-41e6-9921-f2eb8c8fba32_538x308.png "Angular Old For Loop Syntax")

For Loop before V17

**New**

![](./https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9801c481-76fa-47d8-bad2-39eaf976e7c5_561x308.png)

New Angular For Loop Syntax

As you can see, we are also passing a tracking expression that yields a unique key that we can use to associate the array items and their place in the DOM for performance reasons. This is required in the new control flow syntax, while before with the old syntax, it was optional.

#### NgSwitch

Here is an example of the old syntax

![](./https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F804ffe54-2da4-433d-9b84-b0b54472837e_913x308.png)

And here is what that looks like now, with the new syntax

![](./https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F33caea68-983e-46d0-aecd-5769caa79566_690x379.png)

Notice something? The new syntax is more readable (I know, it’s subjective, but I think we can both subjectively agree) and familiar, it looks like the very familiar syntax you would come across while writing Typescript or Javascript (or most languages for that matter). If you are new to Angular, good luck understanding the old syntax without a few head scratches and squinting your eyes.

![](./https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F51cabae2-ba9a-4795-91dd-f690fad6bcb7_577x433.jpeg)

And then there is another huge benefit, **syntax highlighting and formatting**. In the old syntax, we didn’t have much in the syntax highlighting corner, as the structural directive we part of the HTML attribute. Since now the control flow isn’t part of the HTML tags, syntax highlighting is already available. On top of that, the prettier npm package (update to the latest version) now supports formatting of the new Angular syntax and it’s just glorious.

Combine these two, and you can now easily tell where one block ends and the other one starts and any nested blocks within the template are easy to identify. This should aid in code readability and improve it exponentially.

And did I mention there is no more unnecessary `ng-container` and `ng-template` for conditional HTML blocks? This leads to much cleaner code with less boilerplate.

![](./https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F479c685f-4841-4711-bfe5-ee85b737d077_620x455.jpeg)

I wish things were that simple

So far we have seen if and for syntaxes, what about the switch, here is an example.

### Improvements over the Old Syntax

#### → for loop: required track expression

With the new syntax, providing a track expression that yields a key to keep track of each item in the array to the view location in the DOM for improved performance, especially over large lists is required.

Trying to leave it out, you get the following error:

```
@for loop must have a "track" expression
```

On top of that, Angular is using a new optimized algorithm for the for loop so that it’s more performant by making DOM operations as a response to collection changes minimal and hence more efficient.

#### → for loop @empty Keyword

On top of that, we now have an `@empty` keyword that we can use to handle situations where the list is empty, which is kind of neat.

![](./https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F470caf3e-ce74-4684-8c9e-248d5f8134eb_1053x406.png)

### → readable else

As we saw earlier, doing else in the old control flow syntax in Angular was not really readable and required a lot of boilerplate code, however with the new control flow, it’s much more readable and more familiar, especially for developers just starting out in Angular.

![](./https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb0cfc9a4-2cd2-4bae-a62d-5b353c0a4702_554x308-1.png)

### What about the Async Pipe?

Just like before, we can still the async pipe to subscribe to observables just like before.

Within for loops, this is how we can achieve this:

![](./https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F17df9409-02a2-40da-a2ee-f7308c80cd64_1815x649.png)

The same can be done for the if blocks:

![](./https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F75b11243-a7f6-48c5-97d2-504388f7a6bd_1194x433.png)

### I am sold, how do I switch?

First, make sure you have updated your Angular project to v17 and then you can run the following schematic to convert existing control flow syntax to the new control flow syntax.

```
ng g @angular/core:control-flow-migration
```

When prompted for a path, enter the path to your project and that’s it.

A word of caution, which is a huge step forward in Angular, is that the control flow syntax is in the [developer preview](https://angular.io/guide/releases#developer-preview). This means some things may change under the hood without following semantic versioning, as it gives the Angular team flexibility to move first and fix issues and concerns that may arise before it’s generally available with the same [guarantees Angular](https://angular.io/guide/releases) provides for all its features.

### Next on Unstacked: The all-new @defer syntax

On top of that, Angular is getting a new `@defer` syntax that can be used to lazy load components, directives, and pipes in the template, until certain conditions are met. I am going to go over this in the next issue of Unstacked in the next couple of weeks as this post is becoming overly long for a newsletter.

### Conclusion

In this post, we took a look at the new control flow syntax for angular and the benefits it brings along as compared to the old syntax. We learned that the new control flow syntax is more familiar and subjectively more readable as compared to the old one, and requires less mental gymnastics to understand what’s going on, even for experienced Angular devs, let alone newbies. We also learned how the new syntax not only replaces the old syntax but improves upon it by bringing in extra helpers such as `@empty` and required track by expression for improved performance.

That’s it from me, and until next time, keep on learning.
