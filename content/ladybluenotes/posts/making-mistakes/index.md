---
{
    title: "Making Mistakes in Public Isn’t a Failure",
    summary: 'Working in public means being visible while learning. That isn’t a weakness—it’s how real software gets built.',
    published: '2026-01-14',
    tags: ['open source', 'opinion'],
    originalLink: 'https://sarahgerrard.me/posts/making-mistakes'
}
---

There’s an unspoken rule many of us learn early:

**Don’t be wrong where people can see it.**

Once your work is public—open source contributions, pull requests, design docs, blog posts—there’s an expectation, whether real or imagined, that you already know the answer. That you ask the *right* questions. That your commits are clean. That confusion, if it exists at all, happens privately.

That pressure is real. And it shapes how people participate.

## Code Has Memory (and That Changes Behavior)

Code remembers everything.

Every commit, review comment, and revert outlives the context that produced it. A mistaken assumption doesn’t disappear once it’s corrected; it lives on in the diff. An early idea that didn’t work can resurface months later, stripped of the constraints that once made it reasonable.

That permanence changes behavior. People hesitate to touch unfamiliar code, ask clarifying questions, or admit they don’t fully understand an abstraction. Being wrong in code feels worse than being wrong in conversation because it looks *objective*. There’s evidence. A line number. A commit hash.

It can feel like the mistake says something permanent about your competence instead of something temporary about your understanding.

But a codebase isn’t a record of who was good or bad.  
It’s a record of how understanding evolved.

## Most “Mistakes” Are Just the Work

Most mistakes aren’t failures. They’re **intermediate states**.

A refactor exposes an edge case. A performance tweak fails under real traffic. A type definition breaks when a new consumer shows up. A cleanup PR reveals how tangled the dependency graph really is. That isn’t incompetence. It’s feedback.

Complex systems don’t reveal themselves upfront. They reveal themselves through use: by being changed, stressed, and corrected. If you never see mistakes, it usually means the learning happened privately, or the system isn’t being meaningfully challenged.

Neither scales.

This is true everywhere, but open source makes it louder. Your work isn’t just visible to teammates; it’s visible to maintainers you respect, contributors you’ve never met, and employers you didn’t know were watching. Feedback happens in public. Corrections are permanent.

It’s easy to mistake that visibility for judgment. But most experienced maintainers aren’t looking for perfection. They’re looking for clear intent, engagement with feedback, and follow-through. Some of the best contributions don’t start strong; they get there through discussion. They show how someone thinks, not just what they ship.

Avoiding contribution to protect your image helps no one.

The same pattern holds at scale. Large organizations ship regressions constantly. They inherit legacy systems, split ownership across teams, and operate with incomplete mental models. The difference isn’t whether mistakes happen; it’s how teams respond. Healthy teams treat incidents as system feedback, not personal failure. Error isn’t a moral failing. It’s a property of complex systems.

## Correction Is Not a Verdict

Code review often *feels* personal.

Comments can be blunt. Context can be missing. Tone doesn’t always carry. And when you’ve invested time in a solution, even neutral feedback can sting. But code review isn’t a verdict. It’s collaborative reasoning to stress-testing assumptions, surface edge cases, and make decisions more explicit.

Being corrected doesn’t mean you failed. It means the system worked. Someone else saw something you didn’t.

The real damage happens when correction is treated as proof of incompetence instead of part of the process.

There’s also a limit to how much you can reason your way to the right answer in advance. Some lessons only appear once code exists in the world: real performance characteristics, how APIs feel to consumers, where abstractions collapse under maintenance.

No amount of private perfectionism replaces that feedback loop. Shipping something imperfect, learning from it, and improving it is how software gets better. Avoiding visibility to preserve an image of correctness doesn’t make you stronger, it just slows learning and shifts risk downstream.

## How I’m Choosing to Work

I’m choosing to work more openly, but more importantly, I’m choosing to reframe how I interpret my own work.

When something doesn’t land, I don’t want my first reaction to be judgment. I want it to be curiosity. What did I assume? What constraint changed? What did the system reveal that I couldn’t have known in advance?

That means opening PRs before everything is resolved, leaving context instead of hiding uncertainty, and being explicit when an approach didn’t work. Not as a confession, but as part of the process.

This isn’t carelessness. It’s an open mind applied consistently.

Code isn’t a moral test.  
It’s an evolving artifact shaped by incomplete information and real constraints.

The people who grow fastest aren’t the ones who never get corrected.  
They’re the ones who stay engaged long enough to learn from it.