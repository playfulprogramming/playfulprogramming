---
{
title: "A Better Way To Code: Documentation Driven Development",
description: "Test Driven Development is often taught to improve a your workflow; I present Documentation Driven Development as an alternative approach.",
published: '2022-01-18T22:12:03.284Z',
authors: ['crutchcorn'],
tags: ['documentation', 'testing', 'opinion'],
attached: [],
license: 'cc-by-nc-sa-4',
}
---

If you've spent much time in software development, you've undoubtedly heard the expression “test-driven development” or "TDD" for short.

The idea behind TDD is that you should write tests before programming an implementation. For example, say you want to implement a function called `calculateUserScore` based on a user's K/D in a video game. According to TDD, you should start by writing unit or integration tests to validate the input to an expected set of outputs.

Starting with tests can be a great help to ensure that your program runs the way it's intended when all is said and done. One downside, however, is that tests are still a form of coding; Yes, even when you follow good testing practices by [hardcoding values and avoiding complex logic](https://unicorn-utterances.com/posts/five-suggestions-for-simpler-tests/#dont-include-logic). It's still software development, and your tests still need to pass at the end of the day.

Making sure tests pass can be challenging to handle with the unknowns of implementation detail. After all, if you expect `parseInt` to act one way and it behaves another, you will likely have to rewrite all tests that worked off that assumption.

As a result, many choose to start implementing a function as a proof-of-concept, then adding tests incrementally alongside implementation: A TDD-lite, so to speak.

The problem is that, by doing so, you lose one of the most significant benefits of test-driven development: Its ability to force you to confront your API ahead of time.

# APIs are hard

You're working at an indie game company. A small top-down shooter that you've written [in JavaScript with Phaser](https://phaser.io/). Your bass has asked you to implement a user score.

> "No problem, `calculateUserScore` is going to be super simple - no need to overthink it."

You think, typing out a basic implementation:

```javascript
function calculateUserScore({kills, deaths}) {
    return parseInt(kills / deaths, 10)
}
```

But wait! What about assists? Do those count? Surely they should. Let's treat them as half of a kill.

```javascript
function calculateUserScore({kills, deaths, assists}) {
    const totalKills = kills + (assists / 2);
    return parseInt(totalKills / deaths, 10)
}
```

Oh, but some kills should give bonus points. After all, who doesn't love a good 360 no-scope? While `kills` was simply a number before, let's change it to an array of objects like so:

```javascript
const killsArr = [
     {
          additionalPoints: 3
     }
]
```

Now we can change out the function implementation for this:

```javascript
function calculateUserScore({killsArr, deaths, assists}) {
    const kills = killsArr.length;
    const additionalPoints = killsArr.reduce((prev, k) => k.additionalPoints, 0);
    const totalKills = kills + (assists / 2);
    return parseInt((totalKills / deaths) + additionalPoints, 10);
}
```

While we've seen the function change, remember that your game may be making this calculation in multiple parts of the codebase. On top of this, maybe your API _still_ isn't perfect for this function. What if you want to display the special kills with additional points after a match?

These drastic refactors mean that each iteration requires additional refactor work, likely delaying the time to ticket completion. This can impact releases dates or other scheduled launches.

Let's take a step back. Why did this happen?

These problems tend to happen because of miscommunication of scope. This miscommunication can be introduced between teams, from individual to individual, or even simply within your internal monolog.

# Testing is hard

One way that many suggest working around this problem is by following TDD. TDD can help force you to address your API ahead of time by adding in a feedback loop.

For example, before implementing the `calculateUserScore` function into your codebase, you might test against the first implementation, add a `test.todo` to add in assists, and realize you should update your API before moving forward.

However, while TDD forces you to address your API, it doesn't help you distinguish scope. This limitation of understanding of your scope may then, in turn, impact your API.

Let me explain:

Let's say that the ability to track special kills after the fact isn't possible to display on the match end until later in the development cycle. You know this and have decided to stop at the second implementation where `kills` is still a number. However, because the function is used repeatedly in the codebase, you'll need to do a larger refactor at a later date.

Had you spoken with other engineers, you may have realized that developments in the match-end screen were completed sooner than expected. Unfortunately, it's only caught now in code review after you've made the implementation, forcing a refactor immediately.

# Getting to the point

Okay, okay, I'll get to the point: There's a better way to address this "API shift" problem better than TDD. This "better way" is "Documentation driven development."

![Drake looking away from "Test Driven Development" but a thumbs up for "Documentation Driven Development"](./drake.png)

Writing docs first can help you iron out implementation details ahead of time before making tough calls about implementing a design. Even reference APIs can help you make a lot of designs.

Let's loop back to the older example of `calculateUserScore`. Just like before, you called a short meeting to gather the requirements from the team. This time though, you start by writing documentation instead of starting with the code.

You include a mention of what the API should look like based on these requirements:

```javascript
/**
 * This function should calculate the user score based on the K/D of the
 * player.
 *
 * Assists should count as half of a kill
 *
 * TODO: Add specialty kills with bonus points
 */
function calculateUserScore(props: {kills: number, deaths: number, assists: number}): number;
```

You also decide to showcase some usages in your docs:

```javascript
caluculateUserScore({kills: 12, deaths: 9, assists: 3});
```

While working through these docs, you decide to quickly sketch out what the future API might look like when bonus points are added.

```javascript
/*
 * TODO: In the future, it might look something like this to accommodate
 * bonus points
 */
calculateUserScore({kills: [{killedUser: 'user1', bonusPoints: 1}], deaths: 0, assists: 0});
```

After writing this, you realize you should utilize an array for the kills property first rather than later on. You don't have to have bonus points, but instead, you can simply track an `unknown` user for each kill and change it in the future.

```javascript
calculateUserScore({kills: [{killedUser: 'unknown'}], deaths: 0, assists: 0});
```

While this might seem obvious to us now, it may not be so clear at the moment. This is the benefit of Documentation-Driven Development: It forces you to go through a self-feedback cycle on your APIs and the scope of your work.

# Refining the process

OK, I get it. Documentation is seen as a chore. While I could go on about "your medicine is good for you," I've got good news for you: Documentation doesn't mean what you think it means.

Documentation can be found in many forms: design mockups, API reference docs, well-formed tickets, future plan writeups, and more.

Essentially, anything that can be used to communicate your thoughts on a topic is documentation.

In fact, this _includes_ tests. 😱 Tests are a good way of conveying API examples for your usage. TDD itself may be enough on its own to convey that information for future you, while other times, it may be a good companion alongside other forms of documentation.

In particular, if you're good about [writing primarily integration tests](https://kentcdodds.com/blog/write-tests), you're actually writing out usage API docs while writing testing code.

This is particularly true when writing developer tooling or libraries. Seeing a usage example of how to do something is extremely helpful, especially with a test to validate its behavior alongside it.

---

Another thing "documentation-driven development" does not prescribe is "write once and done." This idea is a myth and may be harmful to your scope and budgets - time or otherwise.

As we showed with the `calculateUserScore` example, you may need to modify your designs before moving forward for the final release: that's okay. Docs influence code influence docs. The same is true for TDD.

---

DDD isn't just useful for developing code for production, either. In interviews, some good advice to communicate your development workflow is to write code comments and **then** write the solution. This allows you to make mistakes in the documentation phase (of writing comments) that will be less time-costly than if you'd made a mistake in implementation.

By doing this, you can communicate with your interviewer that you know how to work in a team and find well-defined goals. These will allow you to work towards an edgecase-free\* implementation with those understandings.

# Bring it back now y'all

I realize this article already has more twists than an M. Night Shyamalan film, but here’s one more; documentation driven development, as we’ve explored today, is an established concept. It’s simply called by other names:

- [Behavioral Driven Development (BDD)](https://en.wikipedia.org/wiki/Behavior-driven_development)
- [Acceptance Test-Driven Development (ATDD)](https://en.wikipedia.org/wiki/Acceptance_test%E2%80%93driven_development)

Each of these refers to a form of validating the functionality of code behind user behavior. Each encourages a stronger communication method that often includes documentation in the process. "DDD" is just another form of this type of logic.

# Conclusion

I've been using documentation-driven development as a concept to drive my coding on some projects. Among them was my project [`CLI Testing Library`](https://github.com/crutchcorn/cli-testing-library), which allowed me to write a [myriad of documentation pages](https://github.com/crutchcorn/cli-testing-library/tree/main/docs) as well as [verbose GitHub issues](https://github.com/crutchcorn/cli-testing-library/issues/2).

Both of these forced me to better refine my goals and what I was looking for. The end-product, I believe, is better as a result.

What do you think? Is "DDD" a good idea? Will you be using it for your next project?

Let us know what you think, and [join our Discord](https://discord.gg/FMcvc6T) to talk to us more about it!
