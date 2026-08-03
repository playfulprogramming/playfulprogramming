---
{
title: "Building Plus Ultra: How Antigravity Helped Me Bring Material Design to Bulma CSS",
published: "2026-02-12" ,
tags: ["typescript", "css", "javascript", "ai"],
description: "Bulma is one of my favorite CSS frameworks. It's lightweight, pure CSS (no JavaScript), based on flexbox, and incredibly easy to use. The problem? Its default aesthetic is pretty basic. The components work great, but they look... well, vanilla.",
originalLink: "https://domenicotenace.dev/blog/building-plus-ultra/",
coverImg: "./cover.webp",
socialImg: "./cover.webp"
}
---

## Overview

Hey everyone

Today I want to share something I've been working on that combines two things I love: clean CSS frameworks and Material Design aesthetics. I just launched [**Plus Ultra**](https://github.com/Domenico-Tenace-Open-Labs/plus-ultra), an open-source CSS library that brings Material Design components to [Bulma CSS](https://bulma.io/) while keeping all the flexbox goodness that makes Bulma so powerful.

And here's the kicker: I built most of it using Google Antigravity, which turned out to be an absolute beast for frontend work. If you're wondering whether Antigravity is any good for UI development, let me tell you, it's incredible.

Let's start!

---

## What Is Plus Ultra?

First, let me explain what Plus Ultra actually is and why I built it.

### The Concept

Bulma is one of my favorite CSS frameworks. It's lightweight, pure CSS (no JavaScript), based on flexbox, and incredibly easy to use. The problem? Its default aesthetic is pretty basic. The components work great, but they look... well, vanilla.

Material Design, on the other hand, is gorgeous. Google's design system is polished, modern, and has that clean "premium" feel. But most Material Design implementations (like Material-UI) are tied to specific JavaScript frameworks, which defeats the purpose of Bulma's simplicity.

So I thought: what if we could have the best of both worlds? Bulma's flexbox power and simplicity, but with Material Design's visual polish?

That's Plus Ultra.

### What It Does

Plus Ultra takes Bulma's components and transforms them into Material Design equivalents using pure CSS/Sass:

- **Material buttons** with proper elevation, ripple effects (CSS-only), and Material color schemes
- **Material cards** with the signature shadow system and hover states
- **Material form inputs** with floating labels and Material-style validation
- **Material navigation** components following Material guidelines
- **Material modals and dialogs** with proper transitions and backdrops

The key is that it's built **on top of** Bulma, not instead of it. You still get all of Bulma's flexbox utilities, grid system, and helper classes. Plus Ultra just makes everything look like Material Design.

### Why "Plus Ultra"?

The name comes from one of my all-time favorite anime series: [_My Hero Academia_](https://en.wikipedia.org/wiki/My_Hero_Academia)
"Plus Ultra" is actually a Latin Phrase. It translates to "Further Beyond." In My Hero Academia, it has been adopted as the school motto of U.A. High.

---

## The Tech Stack

Let me break down what Plus Ultra is built with:

**Core:**

- **Bulma CSS** as the foundation (obviously)
- **Sass/SCSS** for all the Material Design styling
- Pure CSS for animations and transitions
- No JavaScript dependencies (keeping Bulma's philosophy)

**Build Tools:**

- pnpm for package management
- Sass compiler for building the final CSS

**Material Design System:**

- Following Google's Material Design 3 guidelines
- Custom color system matching Material palettes
- Elevation system with proper shadows
- Material motion and transitions

The beauty is that it's just CSS. No complicated build process, no JavaScript runtime, no framework lock-in. Install it, import it, and your Bulma components instantly look like Material Design.

---

## How Antigravity Changed Everything

Now here's where it gets interesting. I could have built Plus Ultra the old-fashioned way, manually writing Sass, testing in the browser, iterating on designs. But I decided to use Google Antigravity, and honestly, it transformed the entire development process.

### Frontend Is Antigravity's Sweet Spot

I've used Antigravity for various projects, but it absolutely shines for frontend work. Here's why:

**Visual Feedback Loop:**
Antigravity's integrated browser means the agent can actually see the components it's building. It's not just writing CSS blindly, it's rendering the results, evaluating the visual output, and iterating based on what it sees.

When I asked the agent to create a Material Design button, it would:

1. Write the initial Sass
2. Compile and render it in the browser
3. Visually compare it to Material Design specs
4. Adjust colors, shadows, and spacing until it matched
5. Show me the final result

This visual validation is huge for UI work. The agent isn't guessing, it's verifying.

**Material Design Knowledge:**
Gemini (which powers Antigravity) has deep knowledge of Material Design principles. When I asked for "Material Design elevation level 2," it knew exactly what shadow values to use. When I requested "Material ripple effect," it understood the animation timing and easing functions.

This saved me countless hours of referencing Material Design documentation.

**Rapid Iteration:**
Frontend work is all about iteration. Try a color, see how it looks, adjust. Try a shadow, see if it feels right, tweak. Antigravity excels at this:

Me: "Make the button shadow more subtle"
Agent: _adjusts shadow values, shows result_
Me: "Actually, go back to the original but reduce opacity"
Agent: _reverts and modifies, shows result_

This back-and-forth happened in seconds, not minutes.

### Specific Examples from Building Plus Ultra

Let me share some concrete examples of how Antigravity helped:

**Example 1: Material Cards**

Task: "Create a Material Design card component that works with Bulma's .card class"

What Antigravity did:

- Analyzed Bulma's existing card structure
- Added Material Design elevation (box-shadow) with proper values
- Implemented hover state with elevation increase
- Added proper border-radius matching Material specs
- Created transition animations for smooth hover effects
- Ensured responsive behavior on mobile

The agent created the entire component in one go, tested it visually, and the result was production-ready. I made minor tweaks to spacing, but 95% was perfect on first attempt.

**Example 2: Floating Label Inputs**

Task: "Implement Material Design floating labels for Bulma form inputs"

This is actually complex because floating labels require specific CSS logic:

- Label starts inside the input
- When focused or filled, label floats up and shrinks
- Smooth transitions between states
- Proper color changes
- Accessible implementation

Antigravity not only wrote the CSS but also created test cases showing:

- Empty input (label inside)
- Focused input (label floating)
- Filled input (label stays floating)
- Error state (red accent)
- Success state (green accent)

The agent validated each state visually before showing me the final component.

**Example 3: Material Color System**

Task: "Implement Material Design color palette with Sass variables compatible with Bulma's color system"

Antigravity:

- Created Sass maps for Material color palettes (primary, secondary, error, etc.)
- Integrated them with Bulma's existing color variables
- Generated utility classes (`.has-background-primary`, `.has-text-secondary`, etc.)
- Ensured proper contrast ratios for accessibility
- Created documentation showing all available colors

This would have taken me hours manually. The agent did it in minutes.

### Planning Mode Was Perfect for This

I used Planning mode extensively for Plus Ultra, and it was ideal for a project like this.

Before implementing each component, the agent would create a plan showing:

- Which Material Design specs it would follow
- How it would integrate with existing Bulma classes
- What Sass variables and mixins it would create
- What the final output would look like

I could review the plan, suggest adjustments (like "use Bulma's existing spacing variables instead of creating new ones"), and then approve. This ensured consistency across all components.

---

## What I Learned About Antigravity for Frontend

After building Plus Ultra with Antigravity, here are my takeaways:

**Antigravity is exceptionally strong for:**

- Component-based UI development
- Design system implementation
- CSS/Sass architecture
- Responsive design work
- Visual consistency across components
- Rapid prototyping and iteration

**The visual feedback loop is critical.**
For UI work, being able to see results immediately and iterate visually makes Antigravity far more effective than text-based coding assistants.

**Material Design knowledge is built-in.**
Having an AI that deeply understands design systems means less time reading specs and more time building.

**Planning mode prevents inconsistency.**
For a library like Plus Ultra where consistency is crucial, Planning mode's upfront architecture decisions were invaluable.

---

## The Current State and What's Next

Plus Ultra is currently in early development. The foundation is there, core Material components working on top of Bulma, but there's still work to do.

**What's working now:**

- Material buttons with elevation and states
- Material cards with proper shadows
- Basic floating label inputs
- Material color palette integration
- Foundation Sass architecture

**What's coming:**

- Complete form component library
- Material navigation components
- Modal and dialog components
- Material tables and lists
- Comprehensive documentation
- Live demo site
- npm package for easy installation

I'm building this in the open under [Domenico Tenace Open Labs](https://github.com/Domenico-Tenace-Open-Labs), so anyone can follow along, contribute, or use what's already there.

And yes, I'll be continuing to use Antigravity for development. It's been too effective not to.

---

## Why Open Source?

You might wonder why I'm building this as an open-source project instead of keeping it proprietary.

Simple: the best tools I use every day are open source. Bulma is open source. Material Design specs are open. The entire web is built on open technologies.

Plus Ultra stands on the shoulders of giants. The least I can do is contribute back to the ecosystem that's given me so much.

If other developers find it useful, awesome. If someone wants to contribute improvements, even better. And if it helps people build better-looking websites with Bulma, that's the whole point.

---

## What I Want to Hear From You

Alright, your turn! I have questions for the community:

**If you use Bulma:**

- Would a Material Design version interest you?
- What components would be most valuable?
- What design systems would you like to see integrated with Bulma?

**If you use Material Design:**

- Do you prefer React-based Material UI or pure CSS solutions?
- What features are non-negotiable in a Material Design implementation?

**If you've used Antigravity for frontend:**

- How has your experience been with UI development?
- Did you find the browser integration as useful as I did?
- What tricks or workflows have you discovered?

**If you're considering trying Antigravity:**

- What questions do you have about using it for frontend work?
- What kinds of projects are you thinking about building?

**Drop a comment below!** I'm genuinely curious to hear if others are using Antigravity for frontend work and what your experiences have been. The tool is still new, and community knowledge sharing helps everyone.

---

## Conclusion

Building Plus Ultra has been a blast, and Antigravity made the process significantly faster and more enjoyable than traditional development would have been.

The combination of Bulma's simplicity and Material Design's aesthetics feels like a natural fit, and having an AI assistant that understands both design systems, can write clean Sass, and can visually validate the results is incredibly powerful.

If you're doing frontend work and haven't tried Antigravity yet, I highly recommend giving it a shot. The browser integration alone makes it worth exploring. And if you're a Bulma user looking for a Material Design aesthetic, keep an eye on Plus Ultra, we're just getting started.

Check out the repo, star it if you're interested, and feel free to contribute or provide feedback. This is a community project, and the more input we get, the better it becomes.

Happy coding!
