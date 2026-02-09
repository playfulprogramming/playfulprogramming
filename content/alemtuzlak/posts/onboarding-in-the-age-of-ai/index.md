---
  title: "Onboarding in the Ever-Changing World of AI",
  description: "I’ve recently joined a new company, and I wanted to share my experience from my first week, what onboarding used to look like, and how AI is changing the game.",
  published: '2026-02-09',
  tags: ["experience", "opinion", "AI", "onboarding", "productivity", "developer experience", "software development", "programming"],
  license: 'cc-by-4' 
---

# Onboarding in the Ever-Changing World of AI

I’ve recently joined a new company, and I wanted to share my experience from my
first week- what onboarding looked like in a world that’s changing fast thanks
to AI.

## The company (and the scale shock)

The company I joined is very popular in the AI and open-source world, over 30k
GitHub stars. It’s growing in popularity, it’s taking names, and it’s moving
rapidly. It still feels like a startup, it's all about moving fast, delivering
value and making the customers happy without too much overhead and bureaucracy.
They have a lot of products spanning a wide horizontal space: 50+ example apps
and integrations spread across 3 huge monorepos, around 20 open-source packages,
and growing. By no means is the codebase a joke.

## Day 1: the part that will never change

The last time I was onboarding was 3 years ago, and the initial process hasn’t
changed much:

- Spend your first day going through boring docs
- Learn about procedures and workflows
- Get familiar with the tech, the assistants, and the company goals

The first day in any company has been written in stone and probably won’t change
even if we reach AGI.

## Day 2: where it gets interesting

That being said, the second day is where it gets really interesting. I was
always fast at adapting. If you’ve watched anime and JJK, I’m like Mahoraga. If
not, you’ll leave this article confused as to what I mean.

Normally, I’d start being productive in the first 3-5 days, depending on the
project. But this was one of the most complex codebases I’ve encountered, and
yet I was productive on **day two**.

I went into the codebase, saw quick wins, and I got to keep what I kill.

In the first 3 days, I added things like _pkg.pr.new_, migrated the monorepo
from _Jest_ to _Vitest_, and a couple of other improvements. That was pretty
mind-blowing. And of course, it was heavily AI-assisted.

Here’s the weird part: I had no real intimate knowledge of the codebase. If you
asked me where some functionality lived or how to change a specific thing, I
couldn’t tell you. And yet the value was still real, just the *Jest* → *Vitest*
migration sped up the testing part of CI by ~35%. I still haven’t fully caught
up, but AI lets me bring value despite that, which is kind of amazing.

## Reality: Productivity isn’t the same as understanding

But let’s have a real talk here. Even though I’m much more productive much
sooner, I’m still completely useless at adding business logic into the codebase
without actually understanding the system. I got a task to implement a feature
across two monorepos, and I had a lot of trouble with it. The first part (in the
first monorepo) was easy: the Linear ticket was very detailed, I could fully
explain to Claude what it needed to do, and once it did, I iterated over it and
got it working rather quickly.

The issues came after.

It was time to move into the neighboring repo and carry the changes over. The
other monorepo is much more complex, and I ran into problems that AI can’t
really solve for you:

- Missing *.env* setup Cryptic build issues due to using *Windows* (yes I know,
  Windows and I both suck for this)
- Five intertwined packages I don’t fully understand yet

I implemented everything the way I thought it should work… and it didn’t.

I used AI to try to debug it, and it didn’t help too much. In the end, I went
back to the good ol’ reliable method: console logging everything. I’m still deep
in it, keep your fingers crossed for me.

So what am I trying to say with all of this?

Onboarding has changed a lot!!

You can move faster, you can “fly” sooner, and you can deliver early wins
without full context. But without deep understanding, you still can’t go far.
Onboarding looks easier, but if you don’t go through the motions, if you don’t
really learn the architecture, the workflows, and the shape of the system,
you’re not going to contribute significant, impactful changes. I keep saying
that knowledge and understanding of architecture, codebases, and workflows is
more crucial than ever, and this week just proved it for me again.

AI helps me implement things faster, especially universal improvements like
devtool usage, CI speedups, and general maintenance. But to bring true value to
a company, the human is still as important as ever.

We ain’t going nowhere… at least for the next 3 months until a new model drops
and we get replaced on LinkedIn again. Keep being awesome and keep delivering
value. Improve yourself, and everything will grow around you as a side effect.