---
{
  title: 'Ads as a Performance Budget Problem',
  description: 'Exploring how ads impact website performance and strategies to manage their effects.',
  published: '2026-01-07',
  tags: [ 'performance', 'webdev' ],
  license: 'cc-by-nc-sa-4',
  originalLink: 'https://sarahgerrard.me/posts/ads-and-performance'
}
---

Open source projects don’t run on good intentions.

Most large OSS ecosystems don’t have predictable or guaranteed income streams. There’s no steady subscription revenue, no enterprise contract you can rely on month over month, and yet, the work never stops: documentation needs to stay current, infrastructure needs maintenance, bugs need fixing, and releases need to keep shipping. There has to be a way to sustain regular updates and ongoing work, otherwise even the most successful projects can slowly stall out.

For many open source projects, ads end up being the least-bad option to make it possible.

That context matters because it fundamentally changes how performance conversations should be framed.

## Context: Joining TanStack

In September, I joined the [Tanstack](https://tanstack.com/) ecosystem to help with infrastructure and documentation.

Like many long-running open source sites, it’s grown organically over time. With billions of downloads across all its libraries, the site had accumulated the kind of technical debt that’s easy to miss in incremental changes but much more obvious in aggregate: unused code and libraries lingering in the bundle, CSS that no longer mapped to any UI, outdated linting rules (and packages), and performance regressions that can’t be attributed to a single commit or feature.

Performance wasn’t “broken” in obvious ways; it had degraded slowly through unused code paths, layered abstractions, and tooling that hadn’t been kept to pace with how the site actually behaved in the browser.

At the same time, Tanstack, like many OSS projects, [relies on ads as a form of revenue to keep the lights on](https://tanstack.com/ads). That means that ads aren’t an optional enhancement or a late-stage add-on, they’re a non-negotiable constraint that the front end has to be designed around.

This is where performance work gets… interesting.

## Ads don’t live outside your application

From the browser’s perspective, there is no meaningful distinction between “your code” and “third-party code.”

Ads are executed in the same JavaScript environment, compete for the same main thread, participate in the same layout and style calculations, and contend for the same network bandwidth and memory budget as your UI.

Treating ads as external, or something you “integrate” and then mentally exclude from the system, is how performance problems slip through code reviews unnoticed.

When regressions show up, they’re often attributed to vague causes (“the site just feels slower now”) instead of being traced back to **resource contention**. But browsers are schedulers. They don’t care _why_ work is happening, only when it happens and what it blocks.

That’s why ads can’t be reasoned about purely as an integration concern.

*They’re part of the system.*

## Performance budgets are about tradeoffs, not scores

Performance budgets are often reduced to numeric targets: a Lighthouse score to hit, a bundle size to stay under, a single metric to optimize. I'm guilty of this, and I'm sure many others can relate to it as well.

In practice, these quantitative values are more useful as **decision-making constraints** than as a primary source of truth.

Every ad slot introduces tradeoffs that force real questions:

- What work is allowed on the main thread during the initial render?
- Which scripts should be allowed before content is stable?
- How much layout instability is acceptable for a reading experience?
- What _must_ be guaranteed before monetization loads?

On documentation and content-heavy sites, these tradeoffs matter more than raw throughput. Reader intent is focused and task-driven. Small delays are more noticeable and layout shifts break trust quickly.

Ignoring these tradeoffs doesn’t make them disappear — it just means they’re paid for later, often in the form of compounding performance debt.

## The hidden costs of ads

The performance cost of ads isn’t just payload size.

It’s _when_ work executes and _what_ it blocks.

In practice, the issues tend to show up as:

- Long tasks delaying first interaction
- Network contention during critical render phases
- Layout shifts caused by late DOM insertion
- Cascading delays that affect hydration and interactivity
- Unpredictable execution timing from third-party scripts

These directly impact [Core Web Vitals](https://web.dev/articles/vitals) like [Largest Contentful Paint (LCP)](https://web.dev/articles/lcp), [Cumulative Layout Shift (CLS)](https://web.dev/articles/cls), and [Interaction to Next Paint (INP)](https://web.dev/articles/inp); metrics that are increasingly tied to SEO and perceived quality.

What makes ads especially tricky is that their cost is rarely isolated. A small delay in script execution can cascade into delayed rendering, blocked input, or unstable layouts. As sites grow, these effects compound.

## “Just Load it async” isn’t a strategy

A common response to third-party performance concerns (and one I’ve personally had to unlearn) is “just load it async.”

Async doesn’t mean “free.”

Deferred scripts still:

- Parse on the main thread
- Execute JavaScript
- Trigger layout and style recalculations
- Compete for scheduling time and memory

The difference is _when_ they do it, not whether they do it at all.

Without explicit constraints, deferred work has a habit of creeping earlier in the lifecycle as new features, analytics, or ad placements are added. Over time, what was once non-blocking quietly becomes part of the critical path.

This is how performance regressions accumulate: not through dramatic failures, but through quiet erosion.

## Treating ads as a budgeted system

Once ads are acknowledged as part of the performance budget, the conversation changes.

Instead of asking _“How do we add ads without hurting performance?”_, the question becomes:

**“What portion of our performance budget are we willing to allocate to ads and where do we intentionally claw that budget back elsewhere?”**

On content-heavy sites, that often means explicitly reserving a small but real slice of the budget for monetization. Not “whatever remains,” but a defined cost that informs the rest of the system.

In practice, that cost often gets offset by:

- Removing unused JavaScript paths
- Eliminating dead CSS
- Fixing or tightening linting rules to prevent regressions
- Simplifying component boundaries
- Delaying non-essential interactivity until after content is stable

This shifts performance work from reactive fixes to deliberate tradeoffs. Ads stop being something you “fit in” and start being a known constraint that shapes architecture decisions across the codebase.

The result isn’t a perfectly optimized site.

It’s a sustainable one.

## Why Docs and Content Sites Are Especially Sensitive

Documentation sites have a different tolerance profile than many applications.

Readers are scanning, reading, and comparing information. They notice when the text jumps, and they feel delays more acutely because the interaction model is simpler. There’s also less visual noise to hide any instability.

These sites are also tightly coupled to SEO. Crawlability, content stability, and load performance directly affect discoverability. Performance regressions don’t just hurt UX; they affect whether people can find the content at all.

This makes performance work on docs sites less about raw speed and more about **predictability and trust**.

## The real work is containment

Ads will exist. Monetization is not optional for most open-source projects that want to remain healthy.

The real engineering challenge isn’t adding ads.

It’s containing them.

Containment means ensuring that the system’s needs don’t silently degrade the rest of the experience. It means accepting constraints upfront instead of rediscovering them through regressions. It means designing for longevity, not just a launch-day success.

Good performance work often looks like nothing happened...

No flashy refactors.
No dramatic before-and-after screenshots.
Just a site that continues to feel fast, stable, and readable as it evolves.

That invisibility isn’t a failure.

It’s the point.

## Performance is a product promise

Performance isn’t just a technical concern. It’s a product promise and one that reflects how much a project values users’ time and attention.

For open source projects in particular, sustainability forces hard tradeoffs. Making those tradeoffs explicit — instead of pretending they don’t exist — is what allows systems to last.

And for systems that need to last, honesty matters more than perfect scores ever will.