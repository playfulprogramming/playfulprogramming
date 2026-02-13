---
{
    title: 'AI Context as Configuration, Not Prompts',
    description: "Stop repeating yourself in every prompt. Use files like agents.md to define project conventions, rules for universal constraints, and skills for optional capabilities. Prompts stay focused on the task, context lives where it belongs, and behaviour becomes predictable.",
    published: '2026-01-21',
    tags: ['AI', 'Agents']
}
---

Prompting is usually the first thing people reach for when they want better results from an AI system. If the output isn’t quite right, the fix feels obvious: add more detail, clarify expectations, repeat the important constraints so the model doesn’t miss them.

That works—up to a point.

Over time, prompts tend to grow: instructions accumulate, token usage creeps up, behaviour starts to vary depending on the tool, the model, or the order the instructions happen to appear. Nothing is obviously broken, but nothing feels stable either.

At some point, prompting stops being a way to guide behaviour and starts becoming the system itself.

## Why prompting breaks down

A single prompt has no real notion of scope.

Everything you put into it is treated as equally important and equally long-lived. Constraints, capabilities, role definition, formatting requirements, edge cases, task instructions—they all compete in the same space.

That leads to a few predictable problems:

- Constraints get repeated because there’s nowhere permanent for them to live.
- Capabilities are included “just in case,” even when they’re irrelevant.
- Expectations are restated defensively because you can’t rely on them otherwise.

Token usage increases not because tasks are complex, but because structure is missing.

More importantly, behaviour becomes harder to reason about. When something goes wrong, it’s unclear why. Was it the role description? A formatting rule? A task-specific instruction that leaked into everything else?

Prompting isn’t failing because people are bad at it. It’s failing because it’s being asked to do too much.

## When structure starts to matter

Modern AI tooling makes this harder to ignore.

When you move beyond a single text box, you have to decide where each piece of information belongs: what should persist, what is task-specific, what sets constraints, what defines the model’s capabilities, and what exists solely to assign responsibility.

These distinctions were always there. Tooling just exposes them.

That’s where concepts like rules, skills, and `agents.md` files start to become useful—not as new prompting tricks, but as ways to give different kinds of context a place to live.

## Different kinds of context

Not all contexts serve the same purpose, and treating it as if it does is where most inefficiency comes from.

### `agents.md` defines agent context

An `agents.md` file is a dedicated, predictable place to give AI agents the context they need to work effectively on a project. Think of it as a machine-readable companion to your human-focused documentation; it contains the project-specific guidance that AI systems don’t otherwise have.

It isn’t about style or personality. It’s about context the agent needs _before it ever sees a prompt_—setup steps, conventions, commands, and essential project information. Because it lives in one place and is automatically included, you don’t have to repeat the same expectations in every prompt.

Put simply:

- It tells agents **how your project works**.
- It gives them **project conventions** and **operational context**.
- It provides **guidance they would otherwise have to be told over and over again**.

A typical `agents.md` lives at the root of a repository and can cover:

- Build and setup commands
- Code style and architecture conventions
- Testing instructions and CI expectations
- Anything a new contributor would need to know to produce work that fits the project’s norms

Here’s how a minimal snippet might look:

```md
# agents.md

## Setup

- Install dependencies: `pnpm install`
- Run dev server: `pnpm dev`

## Testing

- Run tests: `pnpm test`

## Code style

- Use TypeScript's strict mode in tsconfig.json
- Single quotes, no semicolons
```

For a real-world example, see [the examples on the agents.md site](https://agents.md/#examples).

### Rules are about invariants

Rules define what must always be true for an agent.

They aren’t task instructions, and they aren’t contextual like `agents.md` files are. Rules exist to set hard constraints that apply everywhere, regardless of what the agent is working on.

This is the information people tend to repeat in prompts: output requirements, boundaries around hallucination, expectations about asking questions instead of guessing. When those live in prompts, they get copied, reworded, and slowly drift out of sync.

That repetition doesn’t make rules safer. It just makes them expensive.

Rules work when they’re stable and automatically applied. Once defined, they shouldn’t need to be restated. Prompts shouldn’t be responsible for reasserting constraints.

The value here isn’t detail. It’s permanence.

If you’re pasting the same constraints into every prompt, that’s a placement problem, not a prompting problem.

### How to create and maintain good rules

The best rules emerge from repetition: when you notice yourself giving the same instruction multiple times, that's a signal it belongs in your rules, not your prompts.

#### Writing rules

Start with behaviour you want to enforce universally. Write rules as clear constraints, not suggestions. Good rules are:

- Specific enough to guide behaviour consistently
- General enough to apply across tasks
- Focused on outcomes, not implementation details

#### Maintaining rules

You have two approaches:

1. **Manual updates**: When an agent does something you don't like, add a rule that prevents it. Review your rules periodically to remove ones that are no longer relevant or that conflict with newer conventions.
2. **Agent-assisted**: Ask the agent to update your rules file when you notice a pattern. For instance: "Add a rule that you should always ask before creating new files." The agent can help refine wording and placement, but you should review the changes to ensure they match your intent.

Both approaches work. Manual editing gives you control; agent-assisted editing is faster. The important part is that you're capturing patterns as they emerge, not trying to anticipate everything upfront.

### Skills are about capability

Skills describe what an agent _can_ do, and _when_ it should do it.

They aren’t rules, and they aren’t task text. Skills are reusable capabilities: patterns of reasoning or action that can be applied when they’re relevant. Each skill encodes a way of thinking, not a single output.

The problem with treating skills like part of the prompt is that they quickly turn into noise. When every capability is loaded everywhere, the agent applies heuristics that don’t belong and outputs get verbose, behaviour becomes inconsistent, and token usage climbs for no real benefit.

Skills only work when they’re scoped.

A skill should be:

- A clearly defined capability
- Useful only when explicitly relevant
- Loadable on demand, not global by default

Here’s what a simple skill might look like:

```md
# skills/code-review.md

- Identify correctness issues first
- Call out performance concerns only when measurable
- Suggest alternatives with tradeoffs
```

This isn’t a task prompt. It’s a capability definition—a way of handling a class of requests when it’s intentionally selected.

There are many kinds of skills: analytical patterns, domain routines, transformation behaviours, even conversational strategies. What they have in common is that they’re _opt-in_. If a skill is always present, it’s probably misplaced.

Capabilities earn their keep by being optional—and relevant.

#### How to use skills in practice

The mechanics depend on your tooling. In systems like [OpenCode](https://opencode.ai), you can load skills on demand using slash commands (e.g., `/skill code-review`), which adds that skill's context to the current session. In other tools, you might manually include a skill file as an additional context when it's relevant. The key is that skills are _opt-in_: you include them when needed, not by default.

## What changes when you stop prompting defensively?

Once purpose separates context, prompting stops being defensive.

You no longer have to restate constraints “just in case” and you don’t have to drag every capability into every request. And, at the same time, you have the freedom to continue without explaining how the project works before you can ask the agent to do something useful.

With these changes, prompts can get smaller and more focused. You'll notice your token usage dropping as you remove constraints and capabilities. These savings don’t come from clever compression; they come from not having to repeat information that already has a place to live.

More importantly, behaviour becomes easier to reason about. When something goes wrong, you have fewer places to look. Is it a context issue? A constraint? A capability that shouldn’t have been loaded? The system has shape, and that makes failures legible.

This is what structure buys you: fewer surprises, less repetition, and prompts that focus on intent instead of control.

## Prompting still matters, though

None of this makes prompting irrelevant.

Prompts are still where you express intent. They’re how you describe _what_ you want done at this moment. What changes is that they’re no longer responsible for defining constraints, capabilities, or responsibility all at once.

When prompting is doing less, it works better.

Instead of carefully reasserting rules and expectations, you can describe the task directly. Instead of padding prompts defensively, you can assume the surrounding context is already in place.

Prompting doesn’t disappear. It just stops carrying weight it was never meant to bear.

Used this way, prompts become smaller, clearer, and easier to reason about—and the surrounding system does the heavy lifting instead.

If you're curious about how I'm putting this into practice, you can [`agent-infra`](https://github.com/LadyBluenotes/agent-infra), a repository where I maintain my own `agents.md`, rules, and skills files as I work through real projects. It's a living example of how these structures evolve as I discover what actually works _for me_. If you're experimenting with this approach, it might be useful as a reference for how to organize your own context.