---
{
title: "Why I Switched to pnpm and Never Looked Back",
published: "2026-03-19" ,
tags: ["npm", "tools"],
description: "For years, I used npm without questioning it. It's the default, it comes with Node.js, everyone uses it, why change? But after switching to pnpm a few months ago, I genuinely can't imagine going back.",
originalLink: "https://domenicotenace.dev/blog/i-switched-to-pnpm/",
coverImg: "./cover.webp",
socialImg: "./cover.webp"
}
---

## Overview

Hey everyone

For years, I used npm without questioning it. It's the default, it comes with Node.js, everyone uses it, why change? But after switching to pnpm a few months ago, I genuinely can't imagine going back.

This isn't about being trendy or jumping on the latest bandwagon. pnpm solves real problems I didn't even realize I had with npm. Let me explain why making the switch was one of the best development decisions I've made this year.

Let's start!

---

## What's the Actual Difference?

Before we get into why pnpm is better, let's understand what makes it fundamentally different from npm.

### npm's Approach: Flat and Duplicated

When you run `npm install`, npm creates a flat `node_modules` structure. This means all your dependencies and their dependencies end up in the same folder, flattened out. While this solved some earlier problems with nested dependencies, it created new ones:

**Phantom Dependencies:**
You can import packages that aren't listed in your `package.json` because they happen to be installed as someone else's dependency. This works until that dependency changes, and suddenly your code breaks.

**Disk Space Waste:**
If you have 10 projects on your machine and they all use Express, npm downloads and stores Express 10 times. Same for React, Lodash, or any other common package.

**Slow Installations:**
Every project needs its own copy of everything, which means longer install times and more network usage.

### pnpm's Approach: Smart and Efficient

pnpm takes a completely different approach using something called a **content-addressable storage** system. Here's how it works:

**Single Global Store:**
pnpm keeps one copy of each package version in a global store (usually `~/.pnpm-store`). When you install a package, pnpm creates hard links from this store to your project's `node_modules`.

**Strict Dependency Tree:**
Instead of flattening everything, pnpm maintains a proper nested structure using symlinks. You can only import packages that are explicitly listed in your `package.json` or their dependencies.

**Shared Across Projects:**
If 10 projects use Express version 4.18.0, pnpm stores it once and creates 10 hard links. No duplication, massive disk space savings.

This isn't just a minor optimization, it's a fundamentally better architecture.

---

## Why pnpm Wins: The Real Benefits

Let me share the concrete improvements I've experienced since switching.

### Speed That Actually Matters

pnpm is noticeably faster than npm. We're not talking marginal gains, we're talking "wait, it's already done?" levels of speed.

**Cold Installs:**
When installing a package for the first time, pnpm downloads it once to the global store. Every subsequent project that uses it just creates a hard link, which is nearly instantaneous.

**Warm Installs:**
If you've already got the packages in your global store (which you probably do if you work on multiple projects), installations are blazingly fast. What took npm 2-3 minutes might take pnpm 10-20 seconds.

**In Practice:**
Running `pnpm install` on a fresh clone of a project feels almost magical. The speed difference is real and noticeable every single day.

### Disk Space Savings Are Huge

This one surprised me the most. After switching my entire workspace to pnpm, I freed up over 15GB of disk space. That's not a typo, **15 gigabytes**.

Here's why: with npm, if you have 20 projects and 15 of them use React, you have 15 copies of React sitting on your disk. With pnpm, you have one copy with 15 hard links pointing to it.

For common dependencies like:

- React and React DOM
- Lodash
- TypeScript
- ESLint and Prettier
- Testing libraries

The savings add up fast. And this isn't just about disk space, it's about principle. Why should my machine store the same exact files hundreds of times?

### Strict Dependencies Prevent Bugs

This is the feature I didn't know I needed until I had it.

With npm, you can accidentally import packages that aren't in your `package.json` because they're installed as transitive dependencies. This creates hidden coupling that breaks when those dependencies update.

pnpm's strict mode prevents this entirely. If it's not in your `package.json`, you can't import it. Period.

**Real Example:**
I had a project using a utility function from Lodash, but Lodash wasn't in my `package.json`. It worked because another package happened to depend on Lodash. When that package updated and removed Lodash, my build broke.

With pnpm, this would have failed immediately, forcing me to add Lodash explicitly. The error is caught early instead of in production.

### Monorepo Support Is First-Class

If you work with monorepos (and increasingly, who doesn't?), pnpm's workspace support is excellent.

**Built-in Workspaces:**
Define your workspace structure in `pnpm-workspace.yaml`, and pnpm handles linking between packages automatically.

**Efficient Sharing:**
Shared dependencies across workspace packages are stored once and linked everywhere they're needed.

**Better Than Alternatives:**
I've used npm workspaces and Yarn workspaces. pnpm's implementation feels cleaner and more efficient in practice.

### The Lock File Is Better

pnpm's `pnpm-lock.yaml` is more deterministic than npm's `package-lock.json`. It stores more information about dependency relationships and produces more consistent results across different environments.

I've had fewer "works on my machine" issues since switching to pnpm. The lock file format just seems more robust.

---

## The Migration: Easier Than You Think

I was worried about migrating, but it turned out to be trivial.

### How to Switch

For an existing project:

```bash
# Install pnpm globally
npm install -g pnpm

# Navigate to your project
cd my-project

# Import your package-lock.json
pnpm import

# Install dependencies
pnpm install
```

That's it. pnpm even converts your `package-lock.json` to `pnpm-lock.yaml` automatically.

### Commands Are Nearly Identical

If you know npm, you already know pnpm:

```bash
# npm commands
npm install package-name
npm uninstall package-name
npm run build
npm test

# pnpm equivalents
pnpm add package-name
pnpm remove package-name
pnpm run build
pnpm test
```

The only real difference is `add` instead of `install` and `remove` instead of `uninstall`. Everything else is identical.

### Create Aliases If Needed

If you want even less friction:

```bash
alias npm=pnpm
```

Though honestly, once you start using pnpm, you'll appreciate the distinct commands.

---

## The Gotchas (Yes, There Are Some)

Let's be honest, pnpm isn't perfect. Here are the issues I've encountered:

### Some Packages Don't Play Nice

Occasionally, you'll find a package that assumes npm's flat structure and breaks with pnpm's strict linking. This is rare, but it happens.

**The Fix:**
pnpm has a `.pnpmfile.cjs` where you can configure workarounds. Or you can use the `shamefully-hoist` flag to flatten dependencies like npm does (though this defeats some of pnpm's benefits).

In practice, I've only hit this issue twice in several months, and both times the package maintainers fixed it quickly.

### Smaller Community

While pnpm's adoption is growing rapidly (Vue, Vite, Astro, and other major projects use it), it's still smaller than npm's massive ecosystem.

This means:

- Fewer Stack Overflow answers
- Less extensive documentation for edge cases
- Occasional confusion when following tutorials that assume npm

That said, the community is active and helpful, and most npm knowledge transfers directly.

### Initial Learning Curve

Understanding hard links, symlinks, and the global store takes a minute. The first time you look at `node_modules` in a pnpm project, it looks weird.

But once you understand the model, it makes perfect sense and you appreciate the elegance.

---

## When npm Still Makes Sense

To be fair, there are scenarios where sticking with npm is reasonable:

**You're Brand New to JavaScript:**
If you're just learning, start with npm. It's the default, and you'll find more beginner-friendly resources. Switch to pnpm once you're comfortable.

**Company Policy:**
Some organizations have standardized on npm, and switching requires buy-in. Don't fight that battle unless the benefits are worth it for your specific situation.

**Compatibility Concerns:**
If you're working on legacy projects with lots of old dependencies that have quirks, npm's more permissive structure might save headaches.

**You Don't Care About Disk Space or Speed:**
If you have unlimited disk space and don't mind waiting for installations, npm works fine. Some people genuinely don't care about these optimizations.

But for most modern development, pnpm is simply better.

---

## Real-World Impact

Let me share some concrete numbers from my own experience:

**Before pnpm (npm):**

- `npm install` on a typical Next.js project: ~90 seconds
- Disk space for 20 active projects: ~42GB in node_modules
- Frequent phantom dependency issues
- Occasional lock file conflicts between team members

**After pnpm:**

- `pnpm install` on the same projects: ~15-20 seconds
- Disk space for the same 20 projects: ~27GB total
- Zero phantom dependency issues
- More consistent installations across the team

The time savings alone add up. If you run `install` 20 times a day (between switching branches, pulling updates, etc.), pnpm saves you about 20-25 minutes daily. That's over 2 hours per week.

---

## The Broader Ecosystem Is Adopting It

pnpm isn't just a niche tool anymore. Major projects have switched:

**Projects Using pnpm:**

- Vue 3 and the entire Vue ecosystem
- Vite (one of the fastest build tools)
- Astro (my personal site's framework)

When tools and frameworks this significant adopt pnpm, it's a strong signal that it's production-ready and worth considering.

---

## My Recommendation

If you're still using npm and any of these apply to you:

- You work on multiple projects
- You care about build speed
- Disk space is a concern
- You work with monorepos
- You want stricter dependency management

**Switch to pnpm.** The migration takes 5 minutes, and the benefits are immediate and ongoing.

Will you encounter the occasional quirk? Probably. Is it worth it? Absolutely.

The JavaScript ecosystem moves fast, and package managers are evolving. npm was great for its time, but pnpm represents a better approach to dependency management. It's faster, more efficient, and more correct.

---

## Conclusion

Here's my challenge: pick one project and try pnpm for a week. Just one week.

```bash
npm install -g pnpm

cd your-project

pnpm import

pnpm install
```

Use it like you'd use npm. Notice the speed. Check your disk space savings. Experience the strict dependency resolution.

After a week, if you genuinely prefer npm, switch back. But I'd bet that like me, you won't want to.

Sometimes the best tools are the ones that just work better in ways you didn't realize you needed. For me, pnpm is one of those tools.

Happy coding!
