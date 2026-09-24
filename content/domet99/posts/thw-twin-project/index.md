---
{
title: "Spellbook of Skill: The Twin Project Nobody Asked For, But I Built Anyway",
published: "2026-09-21" ,
tags: ["ai", "tools", "astro"],
description: "Where Spellbook of Prompt gives you the incantation, Spellbook of Skill teaches you the magic behind it. It's structured, practical guides organized by category and difficulty, each one built to save time and actually get you somewhere, not just another wall of theory.",
originalLink: "https://domenicotenace.dev/blog/the-twin-project/",
coverImg: "./cover.webp",
socialImg: "./cover.webp"
}
---

## Overview

Hey everyone

A while back I launched Spellbook of Prompt, my curated collection of prompts organized by use case. It's been out there growing steadily, and at some point while adding new entries I kept thinking: prompts are only half the story. Knowing _how_ to build something matters just as much as knowing what to ask an AI to do.

So I built the twin project. Meet [**Spellbook of Skill**](https://github.com/Domenico-Tenace-Open-Labs/spellbook-of-skill), a curated collection of development skills, tutorials, and guides to help you level up your craft from fundamentals to advanced techniques.

Let's dive in!

---

## What It Actually Is

Where Spellbook of Prompt gives you the incantation, Spellbook of Skill teaches you the magic behind it. It's structured, practical guides organized by category and difficulty, each one built to save time and actually get you somewhere, not just another wall of theory.

Every guide follows the same shape: a clear learning objective, a working code example, prerequisites listed upfront, and a troubleshooting section for when things inevitably don't work on the first try. The concepts are language and framework agnostic where possible, so what you learn actually transfers instead of being locked to one stack.

The whole thing runs on Astro with Starlight, same setup as Spellbook of Prompt, so browsing is fast and the docs feel consistent across both projects. It's a genuine sibling project, same philosophy, different content.

---

## Built Entirely with OpenCode + OpenRouter + DeepSeek V4 Pro

Here's the part that ties back to everything I've been writing about lately. I built Spellbook of Skill end to end using OpenCode wired through OpenRouter, running on DeepSeek V4 Pro 0813.

No manual scaffolding, no switching to a pricier model halfway through. The project structure, the Astro and Starlight configuration, the content schema, the initial category setup, all of it came out of that same combo I've been using as my daily driver. If you've read my previous pieces on DeepSeek's cost-to-quality ratio or on wiring OpenRouter into OpenCode, this is that setup doing real, shippable work again.

It's honestly become my proof of concept for "can a budget model stack actually ship a complete open source project." So far the answer keeps being yes.

---

## What's In There Right Now

The structure is organized by category, starting with:

**Content Creation**, structured prompts and guides for writing clear technical articles, the same kind of workflow I use for these posts.

More categories are marked as coming soon: coding and development workflows, DevOps and deployment, system design and architecture, design and creative development, career and professional growth.

It's early. I'd rather be upfront about that than oversell it. The foundation, the docs site, the contribution flow, the conventions, is all solid and ready. The content library is what needs to grow now, and that's exactly where the community comes in.

---

## This Is Where You Come In

Spellbook of Skill is MIT licensed and genuinely open to contributions. Whether you want to add a new guide, improve an existing one, or just fix something that's broken, there's a clear path to do it.

The process is simple: search existing guides first to avoid duplicates, add or update a guide in the right category folder, include a clear title, description, and at least one complete working example, then open a pull request with a short summary. Guides should stay concise and actionable, list prerequisites and learning objectives, include a troubleshooting section, and obviously never contain real secrets or sensitive data.

Full details are in the CONTRIBUTING.md file if you want the complete picture before jumping in.

If you've got a skill you wish someone had written down clearly when you were learning it, that's exactly the kind of guide this project needs. Beginner content is just as valuable as advanced content here.

---

## Try It Out

The live docs are up at [spellbook-of-skill.netlify.app](https://spellbook-of-skill.netlify.app/), or clone it and run it locally:

```bash
git clone https://github.com/Domenico-Tenace-Open-Labs/spellbook-of-skill.git
cd spellbook-of-skill
pnpm install
pnpm dev
```

Then open localhost:4321 and start browsing.

---

## Final Thoughts

Spellbook of Prompt and Spellbook of Skill now sit side by side under Domenico Tenace Open Labs, one teaching you what to ask, the other teaching you how to actually do it. Together they cover more ground than either could alone.

If you're curious about the project, go star it, and if you've got something worth teaching, open a PR. This is exactly the kind of thing that gets better the more people show up.

The spellbook grows.

Happy coding!
