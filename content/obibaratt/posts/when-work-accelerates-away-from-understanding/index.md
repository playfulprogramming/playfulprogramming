---
{ 
    title: "When Work Accelerates Away from Understanding", 
    description: "AI increases engineering speed, but it also increases the cost of poor context. The best teams will not be the ones that generate the most code; they will be the ones that preserve enough understanding to review, operate, and own what they ship. Context stewardship is what keeps AI-assisted work from accelerating away from human judgment.", 
    published: "2026-06-06T00:00:00.000Z", 
    tags: ["ai", "software-engineering", "leadership", "opinion"], 
    license: "publicdomain-zero-1" 
}
---

# Preface

In my last piece, [*How AI Impacts Your Growth*](https://playfulprogramming.com/posts/how-ai-impacts-your-growth/), I wrote about how AI can make individuals temporarily more productive while quietly weakening the process that makes them better. This is the team version of that same problem.

The risk is not just that one engineer ships code they do not understand. The larger risk is that an entire team starts producing change faster than it can preserve context, judgment, and ownership.

# Introduction

AI makes engineering faster. Code output is increasing, tickets move through the system in days instead of weeks or months, prototypes become cheaper, and refactors appear easy to attempt. You can ask an agent for a plan, implementation, tests, migration notes, and a pull request before a human has finished reading through the surrounding files. Small teams leveraging modern tooling can punch far above their weight class.

The real question is whether the team can still understand, review, and own the work they produce.

Engineering isn't just code. It is making changes inside a system that already has assumptions, constraints, tradeoffs, customer expectations, security concerns, and operational behavior all while accounting for decisions that may or may not be written down. AI can accelerate implementation, but doesn't solve that problem. Often, it makes those things more important because it lets us create more change before we have fully caught up to what changed. A small error in direction does not matter much when you are walking from your living room to the kitchen. When you're going to the Moon, you could miss it entirely.

This is a failure mode I think teams need to watch for: the work accelerating away from understanding.

A pull request can look reasonable and still make the system harder to reason about. A migration can pass tests and still violate an assumption that was never documented. An agent can follow the local pattern perfectly and still miss architectural reasons that pattern should not be used here. Humans make the same mistakes. The difference is that AI lowers the cost of producing work, which means the cost of missing context shows up faster.

If your team can generate changes faster than it can review them, you have not automatically increased engineering capacity.

# Optimized for What?

A lot of AI adoption gets framed around productivity. How much faster can engineers move? How many more tickets can we close? How many agents can we run in parallel? How many tokens can we burn (please don't do this)?

Those are reasonable questions, but incomplete.

More output is not automatically better output. More completed tickets do not necessarily mean the system is healthier. If you optimize purely for implementation speed, you will probably get more implementation. That does not mean you will get better engineering.

The better question is: what are we optimizing for?

If the goal is to produce more code, AI is great at that. But engineering teams shouldn't be judged by how much they add to a repository. They should be judged by whether the system keeps improving. We don't need more code that nobody understands. We need useful work that can be reviewed, operated, debugged, extended, and owned.

That changes how we should think about AI-assisted development. Some friction exists because the system is poorly designed. Remove that. Make local setup faster. Make tests easier to run. Make the code easier to navigate. Automate repeated work. Let AI take the tedious parts that do not add much learning or require judgment.

Reading the code matters. Understanding why a constraint exists matters. Knowing which parts of the system are fragile matters. Knowing what not to change matters. AI can reduce the mechanical cost of implementation, but it cannot remove the need for judgment. In practice, it often increases the number of judgment calls the team has to make.

That is why "AI makes us faster" is the least interesting version of the conversation. Faster at what? Faster while building capability, or faster while slowly losing ownership of the system?

# Context Is Still the Bottleneck

An AI's context window can be large, and it can load information quickly, but it still has to load the right information. It still has to know which files matter, which patterns are real conventions, which constraints are load-bearing, and which decisions are just historical accidents. Over time it will "learn" the same things repeatedly.

A human engineer has a different problem. They onboard slowly, but that context sticks. They remember the production issue from six months ago. They remember why the obvious refactor was avoided. They remember that one table has support-access restrictions because of a customer incident nobody wants to repeat. They build intuition and domain expertise over time, and that becomes a key asset for the team.

An agent can become useful much faster, but it isn't as good at building that holistic understanding. To approximate that, AI needs a carefully cultivated garden of docs, skills, and structure, and all of that consumes context too.

How long it takes to onboard someone has always mattered. Now the time to spin up a new agent matters too. The answer depends less on the model than people want to admit. It depends on the system around it: clear code, useful docs, strong tests, real review, and decisions that are not trapped in someone's head.

This is why `AGENTS.md` and skills matter, but the idea is not new. They are closer to `CONTRIBUTING.md` and traditional onboarding docs than AI magic. We have always needed ways to tell new workers how the system should be changed, or how to do specific processes. The worker just might be an agent now, and unlike a person, it may forget nearly everything between tasks.

AI didn't create the need for structured context, but it does expose the flaws in poorly structured systems a lot faster.

# Understanding Debt

Technical debt is what happens when the system becomes harder to change than it needs to be. Understanding debt is what happens when the system changes faster than the team's mental model of it.

This can happen quietly. AI-generated changes pass tests, with undocumented tradeoffs. A reviewer approves a reasonable-looking diff but it starts to clog the system. Tasks get completed, but tickets, documentation, and code become desynced. A new pattern appears because an agent copied something that looked similar, but was only appropriate in one narrow case.

These are well-understood failure points. AI increases the rate at which we run into them.

Before AI, changes carried obvious costs in time, effort, and money. That did not guarantee good judgment, but it created natural pressure to think before acting. With AI, the cost of attempting something drops. It lets teams explore more options, cheaper prototypes, and automates tedious work… but it also means a team can create a large amount of change before anyone can internalize what changed.

The workflow looks efficient. Tickets are closing. Demos look better. Pull requests are bigger and faster. Everyone feels like they are doing more. Meanwhile, bugs linger longer because fewer people understand the system deeply enough to trace them. UI quality starts to degrade because the agent can copy patterns but not necessarily understand product intent. Architecture drifts because local changes make sense in isolation, but fall apart when exposed to the broader system. Eventually the team is moving quickly, but it is less capable of explaining the system it now owns.

That's output without ownership, not leverage.

# Context Stewardship

Context stewardship is about making sure the next person, or the next agent, can load the right parts of the system before changing it.

Sometimes that means documentation, a better architecture overview, tests that encode important assumptions, code comments, or making the right path the easy one. The point is to make context loadable, not create docs for their own sake.

Good teams make the right path easier to follow than the wrong one. They keep code paths clear enough that humans and agents are not constantly rediscovering the system from local examples. They preserve decisions when the reasoning matters more than the outcome. They write task briefs that explain the goal, constraints, non-goals, expected behavior, risks, and verification plan.

Most importantly, they treat review as part of the work, not a rubber stamp after the work is generated. Review cannot depend on the author, human or agent, having perfect judgment. It needs to catch predictable mistakes.

Automated testing can help here. Tests aren't a substitute for understanding, but they are context that pushes back. A good test suite tells future workers what must remain true. A weak test suite lets plausible changes move through the system with very little resistance. When AI modifies tests, warning bells should start ringing.

If context is missing, stale, or scattered across Slack threads and old pull requests, workers start guessing. The difference is that AI makes a lot more guesses and is a lot more confident.

Good context management is what keeps speed safe.

# Conclusion

AI increases the ROI of good context management. It amplifies the edges of your team's structure, good and bad. If your team has strong context, clear ownership, good review methodology, and a culture that values understanding, AI amplifies that. If your team relies on tribal knowledge, weak tests, unclear architecture, and incentives built entirely around output, AI amplifies that too.

The goal is not to use less AI. The goal is to create environments where AI makes people and teams more capable instead of more dependent.

Sometimes that means moving fast. Sometimes it means slowing down, tracing the system, asking why, and making sure you understand what you are approving. That balance is going to matter more as the tools get better.

Use AI to go further. Just don't let the work accelerate away from your understanding.
