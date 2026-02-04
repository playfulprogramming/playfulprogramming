---
{
  title: "Why I’m Building My Own Home Server",
  description: "Exploring the motivation behind why I'm building a home server.",
  date: "2026-01-30",
  tags: ['home server', 'cloud computing', 'opinion'],
  originalLink: 'https://sarahgerrard.me/posts/why-a-home-server'
}
---

My current setup looks a lot like most people's: cloud storage, cloud DNS, cloud everything. It works well, it's incredibly convenient, and I don't have to think much about it.

And to be honest, I feel like that's a big problem for me.

Over time, my daily workflow has quietly become dependent on services I don't control—file storage, authentication, backups, even basic network behaviour. Nothing was (or is) broken, but the assumptions keep stacking up. Things such as the internet always being available, accounts are always secure and accessible, and policies are never changing are becoming increasingly harder to reason about.

Building a home server is me pushing back on that a bit.

## Convenience has a cost

The biggest difference isn’t uptime—it’s control over tradeoffs.

Cloud services aren’t inherently bad. In many cases, they’re the right choice. They’re reliable, well-maintained, and remove a lot of operational overhead. For a long time, they let me move quickly without thinking about infrastructure at all.

The problem is what happens when something changes. Accounts lock, regions go down, policies shift, or a service quietly moves in a new direction—and the impact often extends further than I expect. When everything is outsourced, even small changes can feel disproportionately disruptive.

With a home server, those tradeoffs become explicit:

- What works offline
- What’s backed up, and how
- What’s acceptable to lose

These are the things I want to be predictable, not clever. If something breaks, I want to know where and why.

### When your data stops being just your data

Another shift has been harder to ignore: how my data is treated by default.

More and more services now reserve the right to use user content to train or improve AI systems—sometimes opt-in, sometimes opt-out, often buried in terms that change over time. At the same time, AI features are being integrated into nearly every platform I use, frequently in ways that are challenging to avoid.

I’m not opposed to AI as a tool. I use it selectively in my own work. But I’m uncomfortable with my own files, media, and long-term data being treated as raw material for systems I didn’t explicitly choose to participate in. The line between “stored data” and “training data” has become increasingly unclear.

What started to bother me wasn’t uptime so much as **transparency**.

When I took a step back, I realized how much of my day-to-day workflow depended on services I don’t fully understand and those I have very little leverage over. I can’t say which parts of my setup would break if a service disappeared, changed its terms, or quietly redefined how my data could be used.

A home server doesn’t solve all of this—but it does force me to be more aware. It makes dependencies visible, tradeoffs intentional, and boundaries clearer.

## Where I'm starting

I’m not trying to replace everything at once. That would be brittle, expensive, and unnecessary.

I’m starting with the parts of my setup that are high-leverage and low-risk—things that I benefit immediately from being local, and that I’m comfortable owning myself.

The goal isn’t total independence. It’s reducing passive dependence.

I’m starting with foundational pieces that sit underneath everything else, where small changes have an outsized impact and failure modes are easier to understand.

### Network-Level Control

From here, the easiest win is regaining control over my network traffic.

I want ad and tracker blocking that work everywhere—phones, tablets, TVs, random devices—without relying on per-app extensions or browser configs.

One place to manage it. One set of rules. Less noise, better performance, and fewer things phoning home by default.

This, alone, has been the biggest motivator for me.

### Self-hosting the boring stuff

I'm not looking to own my own cloud provider. I'm hosting the things that are critical (to me) but uninteresting:

- File storage
- Backups
- Internal tools
- Media
- Services that don't need hyperscale reliability

These are the things I want to be **predictable,** not clever. If something breaks, I'll be able to understand why and fix it.

### A media server that works the way I want it

Streaming services are convenient, but they come with a growing set of assumptions.

Their catalogues rotate, access changes, price increases. Ads are getting included to plans that used to be ad-free, and, in some cases, pushed into parts of the experience that weren't interrupted before. At a certain point, it starts to feel like I'm paying more for something that behaves less predictably—and offers fewer guarantees—than traditional TV ever did.

A local media server sidesteps most of that for me. It gives me one library, available on all my devices, without ads, without tracking, and without content disappearing because a licence changed. If I've chosen to keep something, I can trust it to be available.

I'm not opposed to streaming services outright, I just want to move towards stability and predictability. If I'm going to invest time or money on something, I want it to work the same way tomorrow as it does today.

And, frankly, why pay for 10 services when I can invest that into one?

## I'm drawing clearer boundaries

For me this isn't about rejecting the cloud entirely and running everything myself. It's about being more deliberate with the systems I depend on and the data I'm responsible for.

A home server gives me clearer boundaries.

It lets me decide what I want to stay local, what I'm willing to outsource, and where automation and AI does and does _not_ belong. The goal for me isn't perfection or total independence—it’s understanding the tradeoffs I’m making and choosing them intentionally.

I don’t expect this setup to stay static. I’ll change things, move things back, and discover what isn’t worth the effort. But even that feels better than inheriting decisions by default.