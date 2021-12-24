# A Better Way To Code: Documentation Driven Development

If you've spent much time in software development you've undoubtedly heard the expression “test-driven development” or "TDD" for short.

The idea behind TDD is that you should write tests before programming an implementation. Say you want to implement a function called `calculateUserScore` based on a user's K/D in a video game. According to TDD, you should start by writing unit or integration tests to validate the input to an expected set of outputs.

This can be a great help to ensure that your program runs the way it's intended when all is said and done. One downside, however, is that tests are still a method of coding. While ideally, [your tests should not include much complex logic](https://unicorn-utterances.com/posts/five-suggestions-for-simpler-tests/#dont-include-logic) (which reduces the potential for tests breaking in odd ways), your tests still need to pass at the end of the day.

This can be difficult to handle with the unknowns of implementation detail. After all, if you expect `parseInt` to behave one way and it *actually* behaves another, you will likely have to rewrite any and all tests that made that assumption.

As a result, many choose to start implementing a function as a proof-of-concept, then adding tests incrementally alongside implementation: A TDD-lite so to speak.

The problem is that, by doing so, you lose one of the greatest benefits of test-driven development: Its ability to force you to confront your API ahead of time.

### APIs are Hard

You're working at an indie game company. A small top-down shooter that you've written [in JavaScript with Phaser](https://phaser.io/). Your bass has asked you to implement a user score.

> "No problem, `calculateUserScore` is going to be super simple - no need to overthink it"

You think, typing out a basic implementation:

```
function calculateUserScore({kills, deaths}) {
    return parseInt(kills / deaths, 10)
}
```

But wait! What about assists? Do those count? Surely they should. Let's treat them as half of a kill.

```
function calculateUserScore({kills, deaths, assists}) {
    const totalKills = kills + (assists / 2);
    return parseInt(totalKills / deaths, 10)
}
```

Oh, but some kills should give bonus points. After all, who doesn't love a good 360 no-scope? While `kills` was simply a number before, let's change it to an array of objects like so:

```
const killsArr = [
     {
          additionalPoints: 3
     }
]
```

Now we can change out the function implementation for this:

```
function calculateUserScore({killsArr, deaths, assists}) {
    const kills = killsArr.length;
    const additionalPoints = killsArr.reduce((prev, k) => k.additionalPoints, 0);
    const totalKills = kills + (assists / 2);
    return parseInt((totalKills / deaths) + additionalPoints, 10);
}
```

While we've seen the function change, remember that your game may be making this calculation in multiple parts of the codebase. On top of this, maybe your API *still* isn't perfect for this function. What if you want to display the special kills with additional points after a match?

These drastic refactors mean that each iteration requires additional refactor work, likely delaying the time to ticket completion. This can impact releases dates or other scheduled launches.

Let's take a step back. Why did this happen?

These problems tend to happen because of miscommunication of scope. This miscommunication can be introduced between teams, from individual to individual, or even just within your internal monolog.

## Testing is Hard

One way that many suggest working around this problem is by following TDD. TDD can help force you to address your API ahead of time by adding in a feedback loop.

For example, before implementing the `calculateUserScore` function into your codebase, you might test against the first implementation, add a `test.todo` to add in assists and realize you should update your API before moving forward.

However, while TDD forces you to address your API, what it doesn't do is help you distinguish scope. This limitation of understanding of your scope may then, in turn, impact your API.

Let me explain:

Let's say that the ability to track special kills after the fact isn't possible to display on the match end until later in the development cycle. You know this and have decided to stop at the second implementation where `kills` is still a number. However, because the function is used repeatedly in the codebase, you'll need to do a larger refactor at a later date.

Had you spoken with other engineers, you may have realized that there are developments in the match-end screen that were completed sooner than expected. It's only caught now in code review after you've made the implementation, forcing a refactor immediately.

### Getting to the point

OK OK, I'll get to the point: There's a better way to address this "API shift" problem better than TDD. This "better way" is "Documentation drive development".

![](./drake.png)Writing docs first can help you iron out implementation details ahead of time, before having to make tough calls about implementing a design. Even reference APIs can help you make a lot of designs

Let's loop back to the older example of `calculateUserScore`. Just like before, you called a short meeting to gather the requirements from the team. This time though, instead of starting with the code you start by writing documentation.

You include a mention of what the API should look like based on these requirements:

```
/**
 * This function should calculate the user score based on the K/D of the
 * player.
 *
 * Assists should count as half of a kill
 *
 * TODO: Add speciality kills with bonus points
 */
function calculateUserScore(props: {kills: number, deaths: number, assists: number}): number;
```

You also decide to showcase some usages in your docs:

```
caluculateUserScore({kills: 12, deaths: 9, assists: 3});
```

While working through these docs, you decide to quickly sketch out what the future API might look like when bonus points are added.

```
/*
 * TODO: In the future it might look something like this to accomidate
 * bonus points
 */
calculateUserScore({kills: [{killedUser: 'user1', bonusPoints: 1}], deaths: 0, assists: 0});
```

While working on the docs, you will likely realize that the `kills` array should be utilized in the first version of the API instead of later on. You don't have to have bonus points, but instead, you can simply track an `unknown` user for each kill and change it in the future.

```
calculateUserScore({kills: [{killedUser: 'unknown'}], deaths: 0, assists: 0});
```

While this might seem obvious to us, while in the moment it may not be so clear. This is the benifit of Documentation-Driven Development: It forces you to go through a self-feedback cycle on your APIs and the scope of your work.

As we showed with this example, you may need to modify your designs before moving forward for final release: that's okay. Docs influence code influence docs. The same is true for TDD.

Tests are part of that, you're writing your tests while writing API documentation

\
This is particularly true when writing developer tooling or libraries.

DDD isn't just useful for developing, either. In interviews, it can be huge to write code comments, then write the solution

## Refining the Process

Documentation can be found in many forms: mockups, API reference docs, well-formed tickets, future plans, and more.