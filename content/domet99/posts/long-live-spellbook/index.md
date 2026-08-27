---
{
title: "Daily Prompt Is Out. Long Live Spellbook of Prompt",
published: "2026-07-06" ,
tags: ["ai", "documentation", "open source", "astro"],
description: "Spellbook of Prompt is a new open-source project that aims to provide a comprehensive and well-documented collection of prompts for AI models. It is designed to be a valuable resource for developers, researchers, and enthusiasts who want to explore the capabilities of AI models and learn how to use them effectively.",
originalLink: "https://domenicotenace.dev/blog/long-live-spellbook/",
coverImg: "./cover.webp",
socialImg: "./cover.webp"
}
---

## Overview

Hey everyone

Some projects start as a quick idea and slowly grow into something you actually want to take seriously. That's exactly what happened with Daily Prompt, a small collection of prompts I put together for personal use that at some point became messy, inconsistent, and honestly a bit embarrassing to share.

So I restarted from scratch. New name, new structure, new look. Meet [**Spellbook of Prompt**](https://github.com/Domenico-Tenace-Open-Labs/spellbook-of-prompt).

Let's dive in!

---

## What Was Daily Prompt?

Daily Prompt was exactly what the name suggests: a daily collection of prompts. The idea was fine, a place to gather useful prompt templates to use with ChatGPT, Claude, Gemini, and whatever else was around. But the execution had problems.

The prompts were scattered with no real organization. There was no clear logic behind the categories. The visual side was the default Starlight theme with zero customization. It felt like a dumping ground more than an actual project.

And the name itself was limiting. "Daily" implied a frequency I couldn't keep up with. It set the wrong expectations.

At some point I looked at it and thought: this doesn't represent what I actually want it to be.

---

## Why Rebrand?

Renaming a project isn't something I do lightly. It breaks URLs, confuses people who already know it, and requires updating everything.

But sometimes a fresh start is the right call.

The rebrand to **Spellbook of Prompt** came from a simple realization: a spellbook is a perfect metaphor for what this is. It's a collection of incantations, each one carefully crafted, tested, and documented. You open it, find what you need, cast the spell (run the prompt), and get a result.

It fits. And more importantly, it gives the project an identity worth building around.

---

## What Changed: The Structure

The biggest improvement is the organization. Daily Prompt was a flat list of prompts with loose labels. Spellbook of Prompt organizes everything by use case, so you can actually find what you need without scrolling forever.

The categories cover the most common real-world scenarios:

- **Content Creation**: scripts, posts, articles, newsletters
- **Code Generation and Debugging**: boilerplate, reviews, refactoring
- **Data Analysis and Reporting**: summaries, structured output, comparisons
- **Writing and Copywriting**: tone adjustments, persuasive copy, editing
- **Design and Creative Direction**: briefs, feedback loops, mood boards
- **Learning and Education**: explanations, quizzes, study guides

Each prompt comes with a clear description, at least one input and output example, and notes on edge cases. The goal was to make every entry actually usable, not just a template you have to figure out yourself.

The documentation is built with Astro and Starlight, which makes browsing fast and the content easy to read. MDX gives us enough flexibility to add interactive examples down the line without switching tools.

---

## What Changed: The Look

This is where I spent more time than I expected.

The old project was visually generic. Default colors, default fonts, nothing that connected it to anything else I build. It could have belonged to anyone.

For Spellbook of Prompt I brought in my brand colors and made it feel like part of the same ecosystem as my personal site and other projects under Domenico Tenace Open Labs. It's a small thing, but it matters. When you open the docs, you immediately get a sense that someone cared about this, not just about the content but about how it looks.

Consistency across projects builds trust. And building trust was part of the point.

---

## Model-Agnostic by Design

One thing I wanted to be clear about from the start: Spellbook of Prompt is not tied to any specific AI model.

Most prompts here work across ChatGPT, Claude, Gemini, and any other LLM you're using. Where there are differences in behavior across models, the documentation mentions it. The collection is validated across at least two different models before anything gets merged.

This matters because the AI landscape changes fast. Tying a prompt collection to a specific model would make half of it obsolete every few months.

---

## It's Open Source and You Can Contribute

Spellbook of Prompt is fully open source under MIT, and contributions are very welcome.

If you have a prompt that works well and you've tested it properly, opening a PR is straightforward. The guidelines are in CONTRIBUTING.md and they're simple: keep prompts concise, include at least one example, validate across multiple models, and don't include sensitive data.

The bar isn't high. The point is quality over quantity. I'd rather have 50 excellent prompts than 500 mediocre ones.

---

## What's Next

There's still a lot to add. The categories are in place but some of them are thin. The live documentation site is up and running at [spellbook-of-prompt.netlify.app](https://spellbook-of-prompt.netlify.app), and I'll keep adding prompts regularly.

A few things on the roadmap:

- Interactive prompt examples directly in the docs
- A tagging system for filtering by LLM compatibility
- More prompts for developer workflows (CI/CD explanations, commit messages, PR descriptions)
- Better search across the full collection

---

## Final Thoughts

Sometimes a project needs to die to become something better. Daily Prompt served its purpose, but it had hit a ceiling. Spellbook of Prompt is what it should have been from the beginning, cleaner, more organized, and actually worth sharing.

If you work with AI tools regularly and you keep writing the same prompts from scratch every time, this might save you some time. Go browse the collection, grab what's useful, and if you have something good to add, open a PR.

The spellbook is open.

Happy coding!
