---
{
title: "Planning vs Fast Mode in Google Antigravity: When and How to Use Each",
published: "2026-02-03" ,
tags: ["ai", "tools", "google", "gemini"],
description: "If you've started exploring Google Antigravity, you've probably noticed those two options sitting right there in the agent panel: Planning and Fast modes. At first glance, they might seem like just different speeds for getting stuff done, but trust me understanding when to use each one is the difference between feeling like a productivity wizard and wondering why the agent just did something completely unexpected.",
originalLink: "https://domenicotenace.dev/blog/planning-vs-fast-mode/",
coverImg: "./cover.webp",
socialImg: "./cover.webp"
}
---

## Overview

Hey everyone

If you've started exploring Google Antigravity, you've probably noticed those two options sitting right there in the agent panel: **Planning** and **Fast** modes. At first glance, they might seem like just different speeds for getting stuff done, but trust me understanding when to use each one is the difference between feeling like a productivity wizard and wondering why the agent just did something completely unexpected.

After spending significant time with Antigravity across various projects (from quick bug fixes to complex refactoring), I've learned that these modes represent fundamentally different approaches to problem solving. Choosing the right one can make or break your workflow.

Today I want to dive deep into both modes: what makes them different, when to use each, how to get the most out of them, and the gotchas you need to watch out for. By the end, you'll know exactly which mode to reach for in any situation.

Let's start!

---

## The Core Philosophy: Two Ways to Think

Before we get into the technical details, let's understand the philosophical difference between these modes, because it affects everything about how they work.

### Planning Mode: The Architect's Approach

Planning mode is all about **thinking before doing**. When you give the agent a task in Planning mode, it doesn't immediately start writing code. Instead, it takes a step back and asks itself:

- What exactly are we trying to achieve?
- What are the different components involved?
- What's the best approach to solve this?
- What files will need to be created or modified?
- What dependencies or technologies should we use?
- What are the potential challenges or edge cases?

Only after answering these questions does it create a detailed implementation plan. This plan is a tangible artifact a document you can read, review, comment on, and approve before any code is written.

Think of it like an architect creating blueprints before construction begins. You get to see the entire vision, suggest changes, and ensure everyone's on the same page before the first line of code is touched.

### Fast Mode: The Builder's Approach

Fast mode is the opposite philosophy: **just do it**. When you give the agent a task in Fast mode, it immediately starts executing. No plans, no artifacts, no waiting for approval. It interprets your request and takes action right away.

This isn't carelessness, it's confidence. Fast mode assumes the task is straightforward enough that the agent can handle it without needing to draft a comprehensive plan first. It's like asking a skilled carpenter to fix a wobbly table leg, they don't need to draw blueprints; they just grab their tools and fix it.

**The key insight**: Planning mode prioritizes clarity and control. Fast mode prioritizes speed and efficiency. Neither is "better", they solve different problems.

---

## Planning Mode Deep Dive

Let's start with Planning mode since it's the more complex (and often more powerful) of the two.

### How Planning Mode Works

When you initiate a task in Planning mode, here's what happens behind the scenes:

**Step 1: Initial Analysis**

The agent reads your prompt and analyzes the scope. It examines your current workspace, identifies relevant files, and understands the context of what you're asking for.

**Step 2: Plan Creation**

The agent generates an **Implementation Plan** artifact. This document typically includes:

- **Goal**: A clear statement of what the task aims to achieve
- **Tech Stack**: The technologies, frameworks, and libraries it plans to use
- **High-Level Approach**: The overall strategy for solving the problem
- **Detailed Steps**: A breakdown of specific actions it will take
- **File Changes**: Which files will be created, modified, or deleted
- **Testing Strategy**: How it will verify the implementation works

This plan appears as an artifact in your workspace that you can read, comment on, and interact with.

**Step 3: Your Review and Feedback**

Here's where the magic happens: you can provide feedback directly on the plan. You can:

- Highlight specific sections and add comments
- Suggest alternative approaches
- Ask clarifying questions
- Request changes before any code is written
- Approve the plan as-is

The agent reads your feedback and incorporates it into its understanding before proceeding.

**Step 4: Execution**

Once you approve (explicitly or implicitly by letting it proceed), the agent executes the plan step by step. It follows the roadmap it created, implementing each component methodically.

**Step 5: Walkthrough Generation**

After completing the task, the agent generates a **Walkthrough** artifact documenting what it did, what files changed, what features were added, and recommended next steps.

### When to Use Planning Mode

Planning mode shines in specific scenarios. Here's when you should reach for it:

#### Complex, Multi-Step Tasks

If the task requires multiple components working together, Planning mode is your friend. Examples:

- "Build a todo list app with user authentication, database storage, and responsive design"
- "Refactor the entire authentication system to use OAuth 2.0"
- "Create a CI/CD pipeline with automated testing and deployment"

These tasks have many moving parts. The planning phase ensures everything is coordinated correctly.

#### When You Need Oversight

If you want to understand the agent's approach before it starts making changes, Planning mode gives you that visibility. This is crucial when:

- Working on production code
- Making changes to critical systems
- Learning how the agent solves problems
- Ensuring the solution aligns with your architecture

#### Unfamiliar Domains

When you're asking the agent to work with technologies or frameworks you're less familiar with, Planning mode lets you review the approach and learn from the plan before implementation.

For example, if you're new to React and ask the agent to build a component, the plan will show you the React patterns and best practices it intends to use. You can learn from this before any code is written.

#### Large-Scale Refactoring

Refactoring across many files is risky without a plan. Planning mode ensures the agent has thought through all the implications and will make consistent changes throughout the codebase.

I used this extensively [when refactoring Easy Kit Utils](/blog/how-i-refactored-easy-kit-utils-with-ai-agents/), the planning phase showed exactly which files would be touched and how the changes would maintain consistency.

#### Collaborative Development

If you're working on a team project or pair programming with the agent, Planning mode enables better collaboration. Your teammates can review the plan, provide input, and ensure the implementation aligns with team standards.

#### When You're Not Sure What You Want

Sometimes you have a vague idea but haven't fully crystallized the requirements. Planning mode can help you think through the problem by generating a plan you can then refine.

For example: "I need some kind of data visualization for user analytics" → the agent creates a plan proposing a specific approach → you review and say "actually, I want interactive charts, not static ones" → the plan updates before any coding happens.

### How to Use Planning Mode Effectively

To get the most out of Planning mode, follow these practices:

**Be Clear About the Goal, Not the Implementation**

Good prompt:

> "Create a user authentication system with email/password login, password reset functionality, and session management."

Less effective prompt:

> "Use bcrypt to hash passwords in the users table and create a sessions table with JWT tokens and..."

Planning mode works best when you describe _WHAT_ you want, not _HOW_ to build it. Let the agent figure out the implementation details—that's what the planning phase is for.

**Read the Plan Thoroughly**

Don't just skim and approve. Actually read the implementation plan. Look for:

- Does the tech stack make sense?
- Are there parts of the problem the agent missed?
- Are there simpler approaches?
- Does this align with your project's architecture?

**Use Inline Comments**

Antigravity supports Google Docs-style commenting directly on plan artifacts. Highlight a section of the plan and add a comment like:

> "Instead of using PostgreSQL, can we use SQLite for this prototype?"

or

> "Don't forget to handle the edge case where the user's email isn't verified."

The agent reads these comments and adjusts its approach accordingly.

**Iterate on the Plan**

Don't feel pressured to approve immediately. It's okay to go back and forth:

- Agent creates initial plan
- You comment with changes
- Agent updates the plan
- You review again
- Approve when satisfied

This iteration happens _before_ any code is written, which is much more efficient than fixing issues after implementation.

**Approve Explicitly**

When you're satisfied with the plan, explicitly approve it by saying something like:

> "Looks good, proceed with implementation"

or

> "Approved, let's build this"

This signals to the agent that it should move from planning to execution.

### Common Planning Mode Pitfalls

Even with the best intentions, there are traps to avoid:

**Over-Planning Small Tasks**

Planning mode has overhead. For tiny tasks like "fix the typo in line 42," the planning phase is overkill. Use Fast mode instead.

**Analysis Paralysis**

Don't get stuck endlessly iterating on the plan. At some point, you need to commit and see the implementation. Perfect plans rarely survive contact with reality anyway.

**Ignoring the Plan**

Some developers approve plans without reading them, defeating the whole purpose of Planning mode. If you're going to skip the plan review, just use Fast mode.

**Assuming the Plan Is Perfect**

The plan is a guide, not gospel. As the agent executes, it might discover issues or better approaches. Be flexible and let it adapt if needed.

---

## Fast Mode Deep Dive

Now let's talk about Fast mode—the quick-and-dirty, get-it-done-now approach.

### How Fast Mode Works

Fast mode is beautifully simple:

**Step 1: Interpret the Request**

The agent reads your prompt and immediately understands what action to take.

**Step 2: Execute**

It performs the task right away. No plans, no artifacts, no waiting. It makes the changes or writes the code directly.

**Step 3: Report Back**

The agent confirms what it did and shows you the results.

That's it. Three steps, minimal overhead, maximum speed.

### When to Use Fast Mode

Fast mode is perfect for specific scenarios:

#### Quick Edits and Fixes

Simple, localized changes are Fast mode's bread and butter:

- "Fix the typo on line 23"
- "Rename this variable to be more descriptive"
- "Add a console.log statement to debug this function"
- "Change the button color to blue"
- "Update the heading text to 'Welcome to Our App'"

These tasks are so straightforward that planning would just slow things down.

#### Obvious Solutions

When there's only one reasonable way to solve a problem, Fast mode is efficient:

- "Center this div horizontally"
- "Add error handling to this API call"
- "Convert this callback to async/await"
- "Sort this array alphabetically"

The implementation is obvious, so just do it.

#### Iterative Development

When you're rapidly prototyping and trying things out, Fast mode keeps you in flow:

- "Try making the sidebar wider"
- "Add another field to this form"
- "Change the API endpoint to /v2/users"

You can make quick changes, see the results, and iterate without the overhead of planning each tiny adjustment.

#### Familiar Patterns

If you're working with code patterns you know well and you're confident in the approach, Fast mode gets you there faster:

- "Add a new route for /profile"
- "Create a simple React component for displaying user info"
- "Write a unit test for this function"

You know what good looks like, so you don't need to review a plan first.

#### Following Up on Existing Work

When the agent has already done the heavy lifting and you just need small adjustments:

- "Make the font slightly larger"
- "Add a bit more padding"
- "Fix that bug we just discovered"

These follow-up tasks build on existing context and don't need new plans.

#### Exploratory Tasks

When you're just trying something to see if it works:

- "Can you add syntax highlighting to this code block?"
- "Try implementing this feature and let's see how it looks"

If it doesn't work, you'll ask for something different. No need for upfront planning.

### How to Use Fast Mode Effectively

Fast mode is simple, but there are still best practices:

**Be Specific and Clear**

Since there's no planning phase to clarify ambiguity, your prompt needs to be precise:

Good:

> "Change the primary button background color from blue to green"

Less effective:

> "Make the button look better"

The second prompt might work, but you're leaving too much to interpretation.

**One Task at a Time**

Fast mode works best with single, focused requests:

Good:

> "Add input validation for the email field"

Less effective:

> "Add input validation, fix the layout issues, and update the error messages"

If you have multiple tasks, either make separate requests in Fast mode or switch to Planning mode.

**Stay Engaged**

Since Fast mode executes immediately, watch what the agent does. If it goes in the wrong direction, you can course-correct quickly:

> "Wait, I meant center it vertically, not horizontally"

The fast feedback loop is part of Fast mode's advantage.

**Use It for Learning the Codebase**

Fast mode is great for quick explorations:

> "Show me all the places where this function is called"

> "Add comments explaining what this code does"

These quick tasks help you understand the code without major changes.

### Common Fast Mode Pitfalls

Fast mode's simplicity can also create problems:

**Using It for Complex Tasks**

The biggest mistake is using Fast mode for tasks that actually need planning:

Bad idea:

> "Rebuild the entire user authentication system to use OAuth"

The agent will try to do it, but without planning, it might make inconsistent changes, miss edge cases, or choose a suboptimal approach.

If the task touches multiple files or has significant complexity, use Planning mode.

**Vague Instructions**

In Planning mode, vague instructions get clarified during the planning phase. In Fast mode, vague instructions lead to unexpected results:

> "Make this component better"

Better is subjective. The agent might optimize for performance when you wanted visual improvements, or vice versa.

**Chaining Too Many Fast Requests**

Making dozens of sequential Fast mode requests can lead to inconsistency:

> "Add field A"

> "Add field B"

> "Add field C"

> "Now style them all"

> "Actually, use a different layout"

At this point, you've essentially created a complex task piecemeal. Would've been better to use Planning mode from the start.

**Assuming It'll Get Everything Right**

Fast mode trades thoroughness for speed. Always review the results, especially for code that'll go to production.

---

## The Practical Comparison: Side by Side

Let's look at how the same task would play out in each mode.

### Example Task: "Create a Contact Form"

**Planning Mode Approach:**

1. You submit: "Create a contact form with name, email, message fields, and submit functionality"
2. Agent creates an implementation plan:

   ```
   Goal: Build a functional contact form

   Tech Stack:
   - HTML5 for structure
   - CSS3 for styling
   - Vanilla JavaScript for validation
   - FormSubmit.co for backend handling

   Steps:
   1. Create contact.html with semantic form structure
   2. Implement validation for required fields and email format
   3. Add CSS for responsive design
   4. Include client-side validation with clear error messages
   5. Set up form submission handling
   6. Test across different screen sizes

   Files to create:
   - contact.html
   - contact.css
   - contact.js
   ```

3. You review the plan, notice it's using an external service, comment: "Actually, let's handle the form submission ourselves with a simple PHP backend"
4. Agent updates the plan to include a PHP handler
5. You approve
6. Agent implements everything according to the revised plan
7. Agent generates a walkthrough showing what was built and how to test it

Total time: ~5-10 minutes, most of which is execution
Your involvement: Reading plan, commenting, approving

**Fast Mode Approach:**

1. You submit: "Create a contact form with name, email, message fields, and submit functionality"
2. Agent immediately creates the form with sensible defaults
3. You see the result, realize you wanted it styled differently
4. You request: "Make it look more modern with better spacing"
5. Agent updates the CSS
6. You notice validation is missing
7. You request: "Add form validation"
8. Agent adds validation
9. You realize you need a backend
10. You request: "Add a PHP handler for form submission"
11. Agent creates the handler

Total time: Similar overall, but broken into many small requests
Your involvement: Constant back-and-forth adjustments

**The Difference:**

Planning mode gave you visibility and control upfront, leading to a more coherent result in one go. Fast mode required iteration to arrive at the same place.

For a task like this, Planning mode is better. But if you just wanted to add one field to an existing form? Fast mode wins every time.

---

## Switching Between Modes: When to Change Your Approach

Here's something important: you're not locked into one mode for your entire session. You can (and should) switch based on the task at hand.

### How to Switch Modes

It's simple. In the agent panel, you'll see a toggle between "Planning" and "Fast" modes. Click the one you want, or use the keyboard shortcut **Cmd/Ctrl + .**

The current mode is always displayed in the chat interface, usually in the lower left of the input box.

### Strategic Mode Switching

Here's how experienced Antigravity users flow between modes:

**Start Big, Then Get Small**

Use Planning mode to build the initial feature or system, then switch to Fast mode for tweaks and refinements:

1. Planning: "Build a blog system with posts, comments, and user authentication"
2. [Implementation happens]
3. Fast: "Make the comment form slightly wider"
4. Fast: "Add a character count to the comment field"
5. Fast: "Change the submit button text to 'Post Comment'"

**Use Planning for Unknowns, Fast for Knowns**

When you're unsure of the best approach, use Planning to get the agent's thoughts. Once the pattern is established, use Fast for similar tasks:

1. Planning: "Create a reusable card component with image, title, and description"
2. [Review plan, approve, implementation happens]
3. Fast: "Create another card component for product listings using the same pattern"

**Complex Then Simple**

After completing a complex task in Planning mode, use Fast mode to handle the inevitable small issues:

1. Planning: "Refactor the API layer to use async/await throughout"
2. [Implementation happens]
3. Fast: "Fix the error handling in the /users endpoint we just refactored"
4. Fast: "Add a TODO comment about the deprecated method we're still using"

### When Work in Progress, Mode Sticks

Important note: if you switch modes while a task is running, the current task continues in its original mode. The mode switch only affects _new_ tasks.

So if you start a complex task in Planning mode, then realize you want to make a quick fix and switch to Fast mode, the Planning task will continue with its plan-based approach while new requests use Fast mode.

---

## Advanced Tips: Getting More from Both Modes

Now that you understand the basics, here are some advanced techniques:

### For Planning Mode:

**Use Sub-Plans for Massive Projects**

For truly large projects, break them into phases and use Planning mode for each phase:

Phase 1 Planning: "Plan the database schema and authentication system"
Phase 2 Planning: "Plan the API endpoints based on the schema we just created"
Phase 3 Planning: "Plan the frontend components consuming the API"

This keeps plans focused and manageable.

**Combine with Knowledge Items**

Antigravity's Knowledge Items system captures important patterns and decisions. In Planning mode, reference these:

> "Create a new API endpoint following the patterns in Knowledge Item #12"

The plan will incorporate your established patterns automatically.

**Ask for Multiple Approaches**

You can request the agent to propose different strategies:

> "Create a plan for the image upload feature, but give me two different approaches: one optimized for performance, one optimized for simplicity"

Then pick the approach you prefer.

**Use Plans as Documentation**

Save the implementation plans as project documentation. They serve as a record of architectural decisions and can help future contributors understand why things were built a certain way.

### For Fast Mode:

**Chain Simple Tasks**

While I said not to chain too many, you _can_ chain a few simple, related tasks efficiently:

> "Add a loading spinner" → [done] → "Make it blue" → [done] → "Position it in the center"

Three Fast mode requests in quick succession can be faster than one Planning mode task for these micro-adjustments.

**Use It for Code Exploration**

Fast mode excels at helping you understand code:

> "Add console.log statements showing the data flow through this function"

> "Add comments explaining each regex group in this pattern"

These exploratory tasks don't need planning.

**Rapid Prototyping Loop**

When experimenting with UI/UX:

> "Try a card-based layout" → [see result] → "Actually, try a list layout" → [see result] → "Go back to cards but make them smaller"

Fast mode's immediacy supports this exploratory workflow.

---

## The Mental Model: Choosing Between Modes

After all this information, you might still wonder: "How do I actually decide in the moment?"

Here's the mental model I use:

**Ask yourself:**

1. **"If this goes wrong, how bad is it?"**
   - High stakes → Planning mode
   - Low stakes → Fast mode

2. **"Do I know exactly what I want?"**
   - Yes → Fast mode
   - No, I need to see options → Planning mode

3. **"How many files will this touch?"**
   - 1-2 files → Fast mode
   - 3+ files → Planning mode

4. **"Will I learn something from seeing the plan?"**
   - Yes → Planning mode
   - No → Fast mode

5. **"Is this part of a bigger workflow?"**
   - Yes, it's the foundation → Planning mode
   - No, it's a quick fix → Fast mode

If you answer "Planning mode" to 2 or more of these questions, use Planning mode. Otherwise, Fast mode is probably fine.

---

## Real-World Examples from My Experience

Let me share some concrete examples from my own Antigravity usage:

### Example 1: Refactoring Easy Kit Utils (Planning Mode)

**Task:** Modernize the entire utility library

**Why Planning:** Multi-file changes, needed consistency, wanted to review approach first

**Result:** The agent created a comprehensive plan showing how it would refactor each utility category, update tests, and maintain backward compatibility. I reviewed it, suggested using specific ES6 features, and the execution was smooth.

### Example 2: Fixing a Typo in Documentation (Fast Mode)

**Task:** Correct a misspelling in README

**Why Fast:** Trivial change, obvious solution, not worth planning

**Result:** Done in 5 seconds. No overhead needed.

### Example 3: Adding a New Feature (Planning Mode → Fast Mode)

**Task:** Add user profile functionality

**Why Planning first:** Complex feature with multiple components

**Result:** Used Planning for the initial implementation (profile page, data storage, API endpoints). Then used Fast mode for tweaks like "add a character limit to the bio field" and "make the avatar circular instead of square."

### Example 4: Debugging (Fast Mode)

**Task:** Figure out why a function isn't working

**Why Fast:** Exploratory, trying different things quickly

**Result:** "Add logging to this function" → "Add error handling" → "Try calling it with different parameters", Fast mode's immediacy helped iterate quickly.

### Example 5: Learning a New Framework (Planning Mode)

**Task:** Build a component in a framework I'm not familiar with

**Why Planning:** Wanted to see best practices before code was written

**Result:** The plan showed me the framework patterns and conventions. I learned from the plan, made suggestions to align with project structure, then approved and watched the implementation to learn more.

---

## Common Questions and Misconceptions

Let me address some frequent confusion I've seen:

**Q: "Is Planning mode slower?"**

A: Yes and no. The planning phase adds time upfront, but often saves time overall by avoiding missteps and rework. For complex tasks, Planning mode can be faster end-to-end.

**Q: "Can I edit the plan before execution?"**

A: Yes! Use inline comments to request changes. The agent will update the plan based on your feedback.

**Q: "Does Fast mode mean lower quality?"**

A: Not necessarily. It means less deliberation, but for simple tasks, the quality is identical. For complex tasks, yes, Planning mode tends to produce better results.

**Q: "What if I start in the wrong mode?"**

A: You can cancel the current task and restart in a different mode, or just let it finish and switch modes for the next task.

**Q: "Does the agent 'remember' between modes?"**

A: Yes, the conversation context persists. You can use Planning for one task, Fast for the next, and the agent knows what happened previously.

**Q: "Why would I ever use Planning mode if Fast is quicker?"**

A: Because "quick" isn't always "best." Complex tasks need deliberation, oversight, and structured thinking, exactly what Planning provides.

---

## What I Want to Hear From You

Alright, now it's your turn! I've shared my experiences and understanding of Planning vs Fast modes, but I know I'm not the only one experimenting with Antigravity.

**If you've used either or both modes, I want to hear from you:**

- Which mode do you find yourself using more often?
- Have you discovered use cases where one mode clearly outperforms the other?
- What's your decision-making process for choosing between modes?
- Have you found any gotchas or unexpected behaviors?
- Do you have tips or workflows that leverage both modes effectively?
- How do these modes compare to other AI IDEs you've used?

**If you're new to Antigravity and considering trying it:**

- What questions do you have about these modes?
- What kinds of tasks are you hoping to use it for?
- Does the Planning vs Fast distinction make sense, or is it confusing?

**Drop a comment below!** Your experiences help everyone learn faster. Plus, I'm genuinely curious if my mental models align with how others use these tools, or if I'm missing something.

The community's collective wisdom is how we all get better at this new paradigm of development.

---

## Conclusion

Google Antigravity's dual-mode approach, Planning and Fast, represents a thoughtful design decision. Rather than forcing everyone into a single workflow, it acknowledges that different tasks require different levels of deliberation.

Planning mode is for when you want to understand the plan before execution, when complexity demands structure, when you're learning, or when stakes are high. It's the architect mode.

Fast mode is for when you know what you want, when the solution is obvious, when you're iterating rapidly, or when overhead would be counterproductive. It's the builder mode.

Neither mode is inherently superior. The skill is knowing which to use when.

As I've worked with Antigravity, I've found that my mode selection has become more intuitive. I don't consciously run through a checklist anymore, I just _feel_ which mode fits the task. That comes with practice.

My advice? Start with Planning mode for most things as you learn Antigravity. The plans teach you how the agent thinks. As you get comfortable, you'll naturally start using Fast mode more for the simple stuff.

And remember: you can always switch modes mid-session. If you realize you chose wrong, just switch and move on. It's a tool, not a commitment.

The future of development is agentic, and interfaces like Planning vs Fast modes are how we'll navigate this new paradigm. Learning to use them effectively is an investment in your future productivity.

So experiment, break things, try both modes extensively, and find the workflow that fits your style.

Happy coding!
