---
{
title: "Gemini CLI Skills - Teaching Your Terminal Agent How to Think",
published: "2026-05-26" ,
tags: ["ai", "tools", "google", "gemini"],
description: "Gemini CLI Skills is a powerful tool that allows you to teach your terminal agent how to think, enabling it to perform complex tasks and automate workflows with ease.",
originalLink: "https://domenicotenace.dev/blog/gemini-cli-skills/",
coverImg: "./cover.webp",
socialImg: "./cover.webp"
}
---

## Overview

Hey everyone

If you've been using Gemini CLI for a while, you've probably noticed that the agent is great at general tasks but sometimes needs guidance for specific workflows. That's exactly what **Skills** are for.

Skills are one of the most underrated features of Gemini CLI, and once you start using them, you'll wonder how you ever managed without. Today I'll walk you through what they are, how to create them, and a real-world example you can steal immediately.

Let's start!

---

## Quick Note Before We Start

Google has announced that Gemini CLI will transition to **Antigravity CLI** on June 18th for free tier and Google One users. The good news? Skills work the same way in both tools, so everything you learn here applies directly to Antigravity CLI. If you're already in the migration window, just replace "Gemini CLI" with "Antigravity CLI" in your head.

---

## What Are Skills?

Think about the difference between a generalist and a specialist. A generalist knows a bit of everything but lacks deep expertise in any one area. A specialist has deep knowledge in their domain and knows exactly how to approach problems in that field.

By default, Gemini CLI is a generalist. It knows a lot, but it doesn't know your specific project, your team's conventions, or the exact steps your deployment pipeline requires.

**Skills turn the generalist into a specialist.**

A Skill is a self-contained directory that packages specialized instructions and context into a discoverable capability. Unlike `GEMINI.md` files that are always loaded into context, Skills are loaded **on demand**, only when the agent determines they're relevant to your current task.

This distinction matters a lot. If you put everything into `GEMINI.md`, you quickly saturate the model's context window with information that's irrelevant to most tasks. Skills solve this with Progressive Disclosure, the agent sees a brief description of every skill, and only loads the full instructions when the skill is actually needed.

The result: the right knowledge, at the right time, without cluttering the context.

---

## The Anatomy of a Skill

A Skill is just a folder with a specific structure:

```
.gemini/skills/
└── my-skill/
    ├── SKILL.md          # The main definition file (required)
    ├── examples/         # Reference implementations (optional)
    ├── resources/        # Templates and assets (optional)
    └── scripts/          # Helper scripts (optional)
```

The only required file is `SKILL.md`. Everything else is supporting material that the agent can reference when the skill is activated.

### The SKILL.md File

This is the heart of every skill. It has two parts: a frontmatter header and a body with instructions.

```markdown
---
name: your-skill-name
description: What this skill does. Use when you need to...
---

# Skill Title

Your instructions here.
```

The frontmatter is crucial. The `description` field is what the agent reads at the start of every session to decide whether to load this skill. Write it clearly and specifically, a vague description will cause the skill to be activated at the wrong times (or never).

Good description:

> "Reviews code changes for security vulnerabilities, performance issues, and adherence to project conventions. Use when reviewing PRs or checking code before merging."

Bad description:

> "Code review stuff."

---

## Where to Put Your Skills

Gemini CLI discovers skills from two locations, and which one you use depends on scope:

**Project Skills** (`.gemini/skills/` in your repo):
These are tied to a specific project. Commit them to version control and your whole team gets the same specialized behavior. Perfect for project-specific workflows like deployment steps, framework conventions, or codebase-specific review guidelines.

**Global Skills** (`~/.gemini/skills/` in your home directory):
These work across all your projects. Perfect for personal workflows, general coding standards, or tools you use everywhere.

The mental model: if a skill is useful for your team and the project, put it in the repo. If it's personal productivity, put it globally.

---

## Creating Your First Skill: Step by Step

Let's create a practical skill for code review. Here's the full process:

### Step 1: Create the Directory

For a project skill:

```bash
mkdir -p .gemini/skills/code-review
```

For a global skill:

```bash
mkdir -p ~/.gemini/skills/code-review
```

### Step 2: Write the SKILL.md

Create `.gemini/skills/code-review/SKILL.md`:

```markdown
---
name: code-review
description: Reviews code changes for bugs, security issues, performance problems, and style consistency. Use when reviewing PRs, checking diffs, or auditing code quality before merging.
---

# Code Review Skill

You are an expert code reviewer. When reviewing code, follow this checklist systematically.

## Review Checklist

### Correctness

- Does the code do what it's supposed to do?
- Are there logic errors or off-by-one mistakes?
- Are all edge cases handled?

### Security

- Are inputs validated and sanitized?
- Are there potential injection vulnerabilities?
- Is sensitive data handled securely?

### Performance

- Are there unnecessary loops or redundant operations?
- Are database queries optimized?
- Are there memory leaks or heavy resource usage?

### Style and Conventions

- Does the code follow the project's naming conventions?
- Is the code readable and well-structured?
- Are functions small and single-responsibility?

## How to Provide Feedback

For each issue found:

1. Specify the exact location (file and line number)
2. Explain what the problem is and why it matters
3. Suggest a concrete fix with a code example when possible

End the review with a summary: overall assessment (Approve / Request Changes / Needs Discussion) and a brief explanation.
```

### Step 3: Verify the Skill Is Discovered

Start Gemini CLI in your project directory and run:

```
/skills
```

You should see your `code-review` skill listed. If it's not there, double-check the directory structure and file naming.

### Step 4: Use It

Just work normally. When you ask for a code review:

```
Review the changes in auth.js before I merge this PR
```

Gemini CLI sees the request, matches it against the skill description, loads the full `SKILL.md`, and follows your checklist systematically. You don't need to explicitly invoke the skill, it happens automatically.

---

## A Practical Example: Conventional Commits Skill

Let me share another skill I use constantly, one that enforces Conventional Commits format across all my projects.

Create `.gemini/skills/conventional-commits/SKILL.md`:

```markdown
---
name: conventional-commits
description: Generates commit messages following the Conventional Commits specification. Use when creating, reviewing, or suggesting git commit messages.
---

# Conventional Commits Skill

You are an expert at writing clear, structured commit messages following the Conventional Commits 1.0.0 specification.

## Format

<type>(<scope>): <description>

[optional body]

[optional footer(s)]

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes only
- **style**: Formatting changes (no code logic change)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

## Rules

1. Use the imperative mood in the description ("add feature" not "added feature")
2. Lowercase the entire first line
3. No period at the end of the description
4. Keep the description under 72 characters
5. The body explains "what" and "why", not "how"
6. Reference issue numbers in the footer: `Closes #123`

## Examples

- feat(auth): add JWT token refresh logic
- fix(api): handle null response from payment provider
- docs: update README with pnpm installation steps
- refactor(utils): extract string validation to dedicated module

When suggesting a commit message, always explain your reasoning for the chosen type and scope.
```

Now whenever you ask Gemini CLI to help with a commit:

```
Write a commit message for the changes I just made to the authentication module
```

The agent loads the skill, understands the full convention, and generates a properly formatted message with the right type, scope, and description style.

---

## Skills vs. GEMINI.md: When to Use What

A common question: when should you put something in a Skill vs. in `GEMINI.md`?

**Use GEMINI.md for:**

- Information the agent always needs (project name, tech stack, folder structure)
- General coding standards that apply to every task
- Critical context that should never be missing

**Use a Skill for:**

- Specialized workflows that only run sometimes (deployments, code review, testing)
- Deep expertise for a specific domain (security auditing, accessibility checking)
- Complex checklists that would waste context when not needed
- Anything you only need occasionally but need deeply when you do

The rule of thumb: if you'd be annoyed by the agent using this knowledge on unrelated tasks, it's a skill. If you'd be annoyed if the agent ever lacked this knowledge, it belongs in `GEMINI.md`.

---

## Tips for Writing Good Skills

After creating several skills, here's what actually works:

**Write narrow descriptions.** The description is how the agent decides whether to activate the skill. Narrow is better than broad. "Use when reviewing PRs or checking code quality" is better than "Use for coding tasks."

**Add explicit "do not use" hints when needed.** If your skill might be over-activated, add clarity: "Do not use for general coding questions or feature implementation."

**Keep SKILL.md focused.** Put detailed examples and templates in the `examples/` or `resources/` subdirectories. The core `SKILL.md` should be scannable and concise.

**One skill, one responsibility.** Don't create a "general development" mega-skill. Create separate skills for deployment, testing, code review, etc.

**Test activation.** After creating a skill, try prompts that should and shouldn't activate it. If it activates when it shouldn't, tighten the description.

---

## Final Thoughts

Skills are a small investment with a big return. You spend 10-15 minutes writing a `SKILL.md` once, and the agent follows your exact workflow consistently from that point on.

The bigger picture: Skills are how you transform Gemini CLI (or Antigravity CLI) from a generic AI assistant into a tool that understands your team, your conventions, and your processes. The more skills you build, the more the agent feels like a teammate rather than a tool.

Start small, maybe with a code review skill or a commit message skill, and build from there. You'll quickly start noticing the moments where the agent "just knows" what you need, and that's when it clicks.

Happy coding!
