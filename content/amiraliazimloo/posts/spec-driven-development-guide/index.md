---
{
    title: "Spec-Driven Development in the Age of AI: What Actually Works in Real Projects",
    description: "A practical look at spec-driven development with AI coding agents: what it is, what real teams found when they tried it, and a lightweight workflow you can use on Monday.",
    published: '2026-11-19T10:00:00.000Z',
    tags: ['ai', 'architecture', 'productivity', 'testing', 'webdev'],
    license: 'cc-by-nc-sa-4',
}
---

AI coding agents changed what the hard part of building software is.

Typing code used to be a real cost. Today, an agent can write a CRUD module, a form and its tests in a few minutes. But anyone who has shipped real features with Claude Code, Cursor, Copilot or Codex knows the new problem: **the agent builds exactly what you said, not what you meant.** It forgets decisions you made an hour ago. It invents a second retry mechanism next to the one you already have. It "fixes" a bug by changing the behavior someone else depends on.

Spec-driven development (SDD) is the industry's answer to that problem. In this article we'll look at what SDD actually is, what happened when real teams tried it, where it fails, and a lightweight version you can use in a Next.js or NestJS codebase without drowning in markdown.

> **The short version:** heavy, tool-generated spec pipelines often cost more than they save, especially on small tasks. What works is a lean set of project rules, a one-page spec that makes the risky decisions explicit, and tests that turn that spec into a gate the code has to pass.

## What is spec-driven development?

The idea is simple: **before you ask an AI agent to write code, you write down what the software should do, and that written spec becomes the source of truth for both you and the agent.**

That's it. The spec is a structured description of intent: who the feature is for, how it should behave, what the edge cases are, and what constraints the implementation must respect. The agent builds against the spec, and you review the result against the spec.

[Birgitta Böckeler from Thoughtworks](https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) did one of the best breakdowns of the term. She describes three levels of SDD, each one going further than the last:

1. **Spec-first:** You write a spec before coding a task, use it to guide the agent, and then it's mostly done with.
2. **Spec-anchored:** The spec lives on after the task. When the feature changes later, you update the spec first and evolve the code from it.
3. **Spec-as-source:** Humans only edit the spec. The code is a generated artifact you never touch by hand.

Keep these three levels in mind, because most of the arguments online about whether SDD "works" are really people talking about different levels.

## Why this idea came back now

Writing specs before code isn't new. Amazon has used its "Working Backwards" process for years, where teams write a press release and FAQ for a product *before* building it. API teams have been doing design-first development with OpenAPI for a long time. Rust and Python evolve through RFCs and PEPs. Engineers have always known that thinking before typing saves time.

What changed is **who reads the spec.**

In June 2025, Sean Grove from OpenAI gave a talk at the AI Engineer World's Fair called ["The New Code"](https://www.ai.engineer/talks/8rABwKRsec4-specifications-are-the-new-code). His argument: the valuable thing engineers produce isn't code but structured communication about what a system should do, and code is a *lossy projection* of that intent. When a model writes the code, the spec becomes the most durable artifact you have.

He used OpenAI's own [Model Spec](https://model-spec.openai.com/) as the example, and the story behind it shows why specs matter in practice. In April 2025, OpenAI shipped a GPT-4o update that made ChatGPT noticeably sycophantic: overly flattering and agreeable. [They rolled it back within days](https://openai.com/index/sycophancy-in-gpt-4o/). The Model Spec already said the model shouldn't behave that way, so the problem wasn't missing intent. In [their follow-up postmortem](https://openai.com/index/expanding-on-sycophancy/), OpenAI explained that they had no deployment evaluations specifically tracking sycophancy.

That's the most important lesson in this whole article, and we'll come back to it: **a spec that nothing checks is just a wish.**

## The tools that made SDD a buzzword

In the second half of 2025, three tools turned SDD from an idea into a workflow:

- **[Kiro](https://kiro.dev/docs/specs/concepts)** (AWS): An agentic IDE that turns a feature request into three markdown files in `.kiro/specs/`: `requirements.md` (user stories with acceptance criteria), `design.md` (architecture, sequence diagrams, data models) and `tasks.md` (a checklist of implementation steps). You approve each phase before the next one starts.
- **[GitHub Spec Kit](https://github.com/github/spec-kit)**: An open-source, agent-agnostic toolkit that adds slash commands to Copilot, Claude Code, Gemini CLI and others. Its workflow is *constitution → specify → plan → tasks → implement*. The **constitution** is a project-wide rulebook (architecture, conventions, non-negotiables) that every later step must respect.
- **[Tessl](https://tessl.io/)**: The most ambitious of the three. It explores spec-as-source, where generated files are marked as generated from a spec and not meant to be edited by hand.

At the same time, the humble rules file became a standard. Every tool had its own format (`CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`), until [AGENTS.md](https://agents.md/) emerged as a shared format. In December 2025, OpenAI, Anthropic and Block co-founded the [Agentic AI Foundation](https://openai.com/index/agentic-ai-foundation/) under the Linux Foundation, with AGENTS.md as one of its founding projects. A good AGENTS.md is basically a lightweight constitution: the part of the spec that applies to *every* task.

## What happened when real teams tried it

This is where it gets interesting. The marketing says SDD makes agents reliable. The field reports are more mixed, and more useful.

### Case 1: A go-kart tracker, ten times slower

Colin Eberhardt at Scott Logic [rebuilt a real feature with Spec Kit](https://blog.scottlogic.com/2025/11/26/putting-spec-kit-through-its-paces-radical-idea-or-reinvented-waterfall.html) in his app KartLog. To make the comparison fair, he first deleted an existing feature (managing race circuits as real entities with a CRUD UI, reverting them to a plain text field) and then rebuilt it, later adding GPS support.

He measured everything. Spec Kit produced about 2,500 lines of markdown for a feature of about 700 lines of code, and he spent about three and a half hours reviewing it. The same feature with his normal approach (prompt, review, iterate) took about 8 minutes of agent time and roughly 25 minutes of review and testing. His estimate: the plain approach was **about ten times faster**, and it didn't have the one bug that the Spec Kit version shipped.

### Case 2: A Thoughtworks engineer and a sledgehammer

Böckeler [tried all three tools herself](https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html). When she asked Kiro to fix a small bug, it generated **4 user stories with 16 acceptance criteria**. She called it using a sledgehammer to crack a nut. With Spec Kit, a medium-sized feature produced so many repetitive markdown files that she'd rather have reviewed code. Worse, the agent sometimes ignored the spec. In one case it treated research notes that *described existing classes* as a request to create new ones, and generated duplicates.

### Case 3: A four-year-old legacy app, twice as fast

XB Software ran Spec Kit on a [four-year-old production codebase](https://xbsoftware.com/blog/ai-in-legacy-systems-spec-driven-development/), on a feature estimated at about a week of work (new UI components, styling and API integration). Given just a Jira ticket through an MCP connection, the agent explored the codebase, and during planning it **flagged inconsistencies between the ticket and the existing implementation** before any code was written. The generated code reused existing components, passed lint and TypeScript checks, and the core business logic needed no changes. They report finishing in roughly half the time.

They also reported the limits: backend integration with external APIs still needed manual fixes, vague input like "make it look like the screenshot" produced bad output, and **for tasks under about two days, Spec Kit's overhead cost more than it saved.**

### Case 4: Several Thoughtworks teams on brownfield systems

The [Thoughtworks Technology Radar](https://www.thoughtworks.com/radar/languages-and-frameworks/github-spec-kit) summarized several teams using Spec Kit, mostly on existing systems. The constitution worked best when it captured scope, domain context, tech versions, coding standards and architecture. But as teams kept adding context, the instructions bloated until the agent started losing track ("context rot"). Their fix: keep the core instructions lean, move reusable guidance into skills and prompt files that load only when needed, and customize the templates to generate fewer markdown files. They also noted that most rework came from unclear intent and constraints discovered late, which is exactly the problem a good spec is supposed to catch.

### The pattern across all four

Read these reports side by side and a clear picture emerges:

| | Where SDD helped | Where SDD hurt |
| --- | --- | --- |
| **Task size** | Multi-day features | Small bugs and tasks under ~2 days |
| **Codebase** | Existing systems with established patterns | Small or greenfield code where the agent already does well |
| **Value** | Catching ambiguity *before* code exists | Generating markdown nobody needs |
| **Risk** | Agent drift across a long task | Review fatigue: thousands of lines of spec to read |

The value of SDD isn't the documents. **It's the thinking the documents force, and the questions they surface early.** The cost is that the tools happily generate far more documents than that thinking requires.

## Is this just waterfall again?

François Zaninotto at Marmelab wrote a sharp critique called ["Spec-Driven Development: The Waterfall Strikes Back"](https://marmelab.com/blog/2025/11/12/spec-driven-development-waterfall-strikes-back.html). His point: most coding agents already have a plan mode and a task list, agile killed the big upfront spec for good reasons, and when building is cheap, small increments converge on a good product faster than big documents do.

He's right about *heavy* SDD. But I think the comparison misses one thing. Waterfall was painful because specs were expensive to write, expensive to change, and handed off between people who never talked. With an agent, a spec for one feature takes minutes to draft, it lives in the same pull request as the code, and you can throw it away and regenerate it. The danger isn't upfront thinking. The danger is upfront *bureaucracy*.

So the useful question isn't "SDD or not?" It's **"what is the smallest spec that keeps the agent honest?"**

## A lightweight SDD workflow you can use on Monday

Here's a workflow based on what the field reports say works, with the heavy parts removed. I'll use a realistic example from a Next.js + NestJS stack: **adding promo codes to a checkout.**

### Step 1: A lean constitution (once per repo)

This is your `AGENTS.md` (or `CLAUDE.md`). It holds the rules that apply to every task, so you never repeat them in feature specs. Keep it short. Thoughtworks' "context rot" finding is real: every line here is read on every task.

```markdown
# AGENTS.md

## Stack
- Frontend: Next.js (App Router), TypeScript strict mode
- Backend: NestJS, PostgreSQL via Prisma
- Tests: Vitest (unit), Playwright (e2e)

## Architecture rules
- Business logic lives in NestJS services, never in controllers or React components.
- Money is always stored as integer cents. Never use floats for money.
- Reuse existing modules before creating new ones. Search first.

## Definition of done
- `pnpm lint` and `pnpm tsc --noEmit` pass.
- Every acceptance criterion in the feature spec has a test.
- Never edit an approved test to make it pass. Ask first.
```

Notice what's *not* in there: no long essays about code quality. Agents follow concrete, checkable rules much better than vague values.

### Step 2: A one-page feature spec

For each non-trivial feature, write a short spec in the repo, for example `specs/promo-codes.md`. The best format I've found for acceptance criteria is **EARS** (Easy Approach to Requirements Syntax), the same notation Kiro uses. It forces every requirement into a *trigger → expected behavior* shape that is hard to misread:

```markdown
# Promo codes at checkout

## Why
Marketing wants to run limited campaigns without engineering involvement.

## Out of scope
- Stacking multiple codes
- Admin UI for creating codes (codes are seeded via SQL for now)

## Acceptance criteria
1. WHEN a user applies a valid, active code
   THE SYSTEM SHALL show the discounted total before payment.
2. WHEN a code is expired or unknown
   THE SYSTEM SHALL reject it with the message "This code is not valid"
   and SHALL NOT reveal which of the two cases applies.
3. WHEN an order is placed with a code that has no remaining uses
   THE SYSTEM SHALL reject the order before payment,
   even if two orders take the last use at the same moment.
4. WHEN a discount is larger than the order total
   THE SYSTEM SHALL set the total to 0, never below.
5. WHEN an order with a code is placed
   THE SYSTEM SHALL reserve one use of the code,
   and SHALL release it if the payment fails or times out.

## Constraints
- Must work with the existing `OrdersService`; do not create a parallel pricing path.
```

Look at what writing this forced us to decide: the error message is the same for "expired" and "unknown" (so attackers can't probe which codes exist), a use is reserved when the order is placed and given back if payment fails, and concurrent use near the limit must be safe. **These are exactly the decisions an agent would otherwise make silently**, and you'd only discover them in code review, or in production.

Criteria 3 and 5 show this well. A natural first draft says "count a use only when payment succeeds" and "reject the code when the limit is reached, even if two users apply it at the same time." Written next to each other, those two rules contradict: if uses are only counted *after* payment, two buyers can both pass the check, both pay, and the code ends up used twice. Do you refund one of them? Charge one full price after the fact? Reserving the use when the order is placed removes the question entirely. Writing the spec surfaces that contradiction in minutes. Without it, an agent quietly picks an answer for you, and you find out from a support ticket.

The "Out of scope" section is just as important. It's the cheapest protection against an agent that helpfully builds an admin dashboard you never asked for.

### Step 3: Let the agent plan, and review the *plan*, not a novel

Ask the agent to read the spec and the codebase and propose a plan: which files change, what the data model looks like, how it will handle criterion 3 (the race condition). This is where XB Software got their biggest win: **the agent reading the code against the spec and asking questions before writing anything.**

Keep the plan short. If it's restating your spec in different words, it's noise. You're looking for one thing: does the agent's approach match the constraints? For example, does it handle the usage limit with an atomic database update, or does it plan to "read the count, then increment it" (which breaks criterion 3)? The safe version is a single conditional update, which the database runs atomically:

```sql
UPDATE promo_codes
SET used_count = used_count + 1
WHERE code = $1 AND used_count < max_uses AND expires_at > now();
-- 1 row updated: the use is reserved. 0 rows: reject the order.
```

If the plan says "check the count, then increment," that's your cue to push back before a single line of code exists.

### Step 4: Turn the spec into tests

This is the step most SDD tools underplay, and it's the lesson from the OpenAI sycophancy story: **the spec only has power if something checks it.** Each EARS criterion maps almost directly to a test:

```ts
describe("PromoCodeService.apply", () => {
  it("rejects expired and unknown codes with the same message", async () => {
    await expect(service.apply("EXPIRED10", order)).rejects.toThrow("This code is not valid");
    await expect(service.apply("DOES-NOT-EXIST", order)).rejects.toThrow("This code is not valid");
  });

  it("never makes the total negative", async () => {
    const result = await service.apply("HUGE-DISCOUNT", orderOf(500));
    expect(result.totalCents).toBe(0);
  });

  // Integration test: runs against a real PostgreSQL database, not a mock.
  // A mocked repository can't reproduce a race condition.
  it("never exceeds the usage limit when two orders race for the last use", async () => {
    await seedCode({ code: "LAST-ONE", maxUses: 1, usedCount: 0 });
    const results = await Promise.allSettled([
      service.reserveOnOrder("LAST-ONE", orderA),
      service.reserveOnOrder("LAST-ONE", orderB),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
  });
});
```

Have the agent write these tests *first*, review them (they're much shorter than the implementation), and then let it implement until they pass. One rule matters here: **once you've approved the tests, the agent may not edit them to make the code pass.** Put that line in your AGENTS.md. Otherwise an agent that's stuck will "fix" the failing test instead of the code, and your gate quietly disappears.

Now the spec isn't a document the agent might ignore. It's a gate the code has to pass.

### Step 5: Keep the spec alive (or delete it)

When the feature changes later ("now codes can be stacked"), update the spec and its tests first, then let the agent change the code. That's spec-anchored development, and it's where specs earn their keep over time: the next developer, or the next agent session, can read *why* the system behaves the way it does.

If you're not going to maintain a spec, delete it after the feature ships. An outdated spec is worse than none, because agents will happily follow it.

## When you should NOT use spec-driven development

Based on the field reports, skip the formal spec when:

- **The task is small.** A bug fix, a copy change or a one-file refactor doesn't need user stories. Remember Kiro's 16 acceptance criteria for a small bug.
- **You're exploring.** If you don't know what you want yet, prototype fast and write the spec *after* you've learned what works. A prototype is a great way to discover the spec.
- **The behavior is visual.** Layout and animation are better specified with a design or a screenshot and iterated on visually. "Make it look like this" in prose rarely works.
- **The review cost exceeds the risk.** If reviewing the spec takes longer than reviewing the code, as in the Scott Logic experiment, you're paying for ceremony.

And use it when the feature is multi-day, touches money, auth or data integrity, crosses frontend and backend, or will be maintained by people (or agents) who weren't in the room when the decisions were made.

## Practical tips from the trenches

- **Write the "why" and "out of scope" yourself.** Let the agent help with everything else, but intent and boundaries are your job. That's what you're there for.
- **Prefer criteria you can test.** "Handle edge cases gracefully" means nothing. "Total never goes below 0" is a test.
- **Limit the generated documents.** If your tool produces five files, customize the templates. Thoughtworks teams did exactly this.
- **Keep the constitution lean.** Move rare, detailed guidance into separate files or skills the agent loads only when needed.
- **Ask the agent to find contradictions.** "Read this spec and the existing code. What's ambiguous or conflicts with what's already there?" is one of the highest-value prompts in SDD.
- **Commit specs with the code.** The spec and the implementation should be reviewed in the same pull request, so reviewers can check one against the other.

## Conclusion

Spec-driven development isn't magic, and it isn't waterfall. It's an old engineering habit, *think before you build*, adapted for a world where the builder is a fast, literal and forgetful machine.

The real-world evidence so far points to one balanced conclusion: heavy, tool-generated spec pipelines often cost more than they save, especially on small tasks. But the core practice works: a lean set of project rules, a short spec that makes the important decisions explicit, and tests that turn the spec into something the code must actually satisfy.

AI made writing code cheap. It didn't make *knowing what to build* cheap. The spec is where that knowledge lives, so write the smallest one that keeps your agent honest, and make sure something checks it.
