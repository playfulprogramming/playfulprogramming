---
{
title: "Adding Capacitor to Glif with Antigravity: The Good, The Bad, and The Reality Check",
published: "2026-02-26" ,
tags: ["ai", "tools", "android", "javascript"],
description: "In this post, I will share my experience of integrating Capacitor into Glif using Antigravity. I will discuss the benefits, challenges, and provide a reality check on what to expect when working with these technologies.",
originalLink: "https://domenicotenace.dev/blog/adding-capacitor-to-glif/",
coverImg: "./cover.webp",
socialImg: "./cover.webp"
}
---

## Overview

Hey everyone

I recently decided to take [Glif](https://github.com/Domenico-Tenace-Open-Labs/glif), my minimalist QR code generator web app, and turn it into a proper mobile app using Capacitor. For those who don't know, Glif is a simple Nuxt app that lets you create and download customizable QR codes, nothing fancy, just clean and functional.

Since I've been using Google Antigravity for various projects, I figured: why not let it handle the Capacitor integration? It's supposed to be great for frontend work, and mobile development is definitely frontend territory, right?

Well... let me tell you about that experience. Spoiler alert: Antigravity helped, but it wasn't the smooth ride I expected.

Let's start!

---

## What Is Capacitor and Why Add It to Glif?

First, a quick explainer for anyone unfamiliar. **Capacitor** is Ionic's cross-platform runtime that lets you turn web apps into native mobile apps for iOS and Android. Think of it as a bridge: your web code (HTML, CSS, JavaScript) runs inside a native container, and Capacitor provides APIs to access device features like the camera, filesystem, notifications, etc.

For a tool like Glif, going mobile made perfect sense:

**Why Glif Needs Mobile:**

- QR codes are inherently mobile-first (people scan them with phones)
- Users might want to generate QR codes on the go
- Having a native app feels more legitimate than "just a website"
- Access to device features like sharing, saving to photos, etc.
- Potential for offline functionality

The web version works fine, but a native mobile app would be the natural evolution. Capacitor seemed like the obvious choice, it's well-maintained, works great with Vue/Nuxt, and doesn't require rewriting the entire app.

---

## The Plan: Let Antigravity Handle It

I've had good experiences using Antigravity for frontend work ([I literally built an entire Material Design CSS library with it](https://domenicotenace.dev/blog/building-plus-ultra/)), so I was optimistic. My thinking was:

- Capacitor integration is well-documented
- It's mostly configuration and boilerplate
- Antigravity should be able to follow the Capacitor docs
- The agent can test the mobile build in the browser
- This should be straightforward

So I fired up Antigravity in Planning mode and gave it the task:

> "Integrate Capacitor into this Nuxt 4 project to create iOS and Android builds. Configure all necessary plugins for a QR code app including Filesystem."

The agent created a plan, I reviewed it, and we were off to the races.

---

## What Went Well

Let me start with the positives, because Antigravity did help in several areas:

### Initial Setup Was Smooth

The agent handled the initial Capacitor installation perfectly:

- Installed `@capacitor/core` and `@capacitor/cli`
- Ran `npx cap init` with correct project details
- Added Android platforms
- Created the `capacitor.config.ts` file with proper configuration

All the boilerplate stuff that's tedious but straightforward worked flawlessly. This is exactly what AI assistants should excel at.

### Plugin Installation

Antigravity correctly identified and installed the necessary plugins:

- `@capacitor/filesystem` for saving QR codes
- `@capacitor/splash-screen` for native app experience
- `@capacitor/status-bar` for handle status bar
- `@capacitor-community/media` for handle media files (like images)

It even configured them properly in the Capacitor config, which saved me from reading documentation.

### Build Configuration

The agent modified the Nuxt config to work with Capacitor:

- Set up the correct output directory
- Configured SSR settings (disabled, since Capacitor needs SPA)
- Adjusted router settings for mobile
- Created proper build scripts in package.json

This was actually helpful because the Nuxt + Capacitor combo has some quirks that the agent navigated correctly.

---

## Where Antigravity Struggled

Now for the part where things got messy. Antigravity wasn't terrible, but it definitely wasn't at 100% performance:

### Native Platform Specifics

The agent struggled with Android-specific configurations. For example:

- `AndroidManifest.xml` permissions were incomplete
- Didn't configure proper app theming
- Missed some required Gradle configuration
- Icons and splash screens needed manual adjustment

Again, the agent knew what needed to be done but couldn't execute it properly.

### Build Errors and Debugging

This is where Antigravity really fell short. When builds failed, the agent struggled to:

**Diagnose Real Errors:**
The first Android build threw a Gradle error. I asked Antigravity to fix it, and it suggested changes that didn't address the actual issue. After three attempts, I just Googled the error myself and fixed it in 5 minutes.

**Understand Native Tooling:**
Antigravity doesn't actually run Android Studio, so when I pasted error messages from those tools, its suggestions were hit-or-miss. It could recognize _common_ errors but anything specific required me to debug manually.

**Handle Version Conflicts:**
Dependency conflicts between Capacitor plugins and Nuxt modules were a pain. The agent suggested version combinations that didn't work, and I ended up trial-and-error fixing them myself.

### Performance Optimization

The agent successfully integrated Capacitor, but the resulting app wasn't optimized:

- Bundle size was larger than necessary
- Some Nuxt modules loaded unnecessarily in mobile context
- Animation performance on lower-end devices was choppy
- Initial load time was slower than it should be

When I asked Antigravity to optimize, it made generic suggestions (tree-shaking, lazy loading, etc.) but couldn't implement them effectively for the Capacitor + Nuxt combo.

### Mobile-Specific UI Issues

The web version of Glif looked fine, but mobile had problems:

- Touch targets were too small in some places
- Bottom navigation issues with Android gesture navigation
- Keyboard behavior wasn't optimized for mobile

Antigravity suggested CSS fixes, but many required understanding native mobile behavior that it just didn't grasp well enough.

---

## The Reality: Manual Work Was Necessary

Here's what I ended up doing manually:

- Fix AndroidManifest.xml completely
- Configure proper app theming and colors
- Set up icons and splash screens correctly
- Adjust Gradle dependencies to resolve conflicts

**Code Optimization:**

- Manually remove unnecessary Nuxt modules for mobile
- Optimize bundle size by tree-shaking unused code
- Improve touch interactions with mobile-specific CSS
- Fix status bar and safe area issues with custom code

**Testing:**

- Test on actual devices (simulator isn't enough)
- Fix device-specific bugs Antigravity couldn't predict
- Optimize performance on lower-end hardware

Honestly, I'd estimate Antigravity handled about 60% of the work. The other 40% required manual intervention, native tooling knowledge, and debugging skills.

---

## Why Antigravity Wasn't at 100%

After reflecting on the experience, I think I understand why Antigravity underperformed:

### It Can't Actually Run Native Tooling

Antigravity's browser integration is great for web testing, but it can't Android Studio. This means:

- It can't validate native builds
- It can't see build errors in native IDEs
- It can't test on actual devices or simulators

For truly mobile-native work, this is a significant limitation.

### Capacitor Is a Bridging Technology

Capacitor sits at the intersection of web and native, which means you need knowledge of both worlds. Antigravity is strong on the web side but weak on the native side. When problems arise in the native layer, the agent struggles.

### Documentation Isn't Enough

The agent can read Capacitor docs, but implementing best practices requires experience. Things like:

- Proper safe area handling
- Performance optimization for mobile devices
- Platform-specific UI patterns
- Native permission flows

These require _knowing_ mobile development, not just reading about it.

### Nuxt + Capacitor Is a Niche Combo

Most Capacitor tutorials focus on React, Angular, or vanilla JS. The Nuxt integration has specific quirks and gotchas that aren't as well-documented. Antigravity didn't have enough training data on this specific stack.

---

## What I Learned

This experience taught me some valuable lessons:

**Antigravity Is Still Best for Pure Web:**
When the work is 100% web-based (HTML, CSS, JavaScript, Vue components), Antigravity excels. The moment you cross into native territory, its effectiveness drops significantly.

**Hybrid Frameworks Need Hybrid Knowledge:**
Using Capacitor effectively requires understanding both web and native development. An AI that's strong in one but weak in the other will struggle with the integration layer.

**Boilerplate vs. Implementation:**
Antigravity is excellent at boilerplate and initial setup. But when things go wrong or need optimization, you still need traditional debugging skills.

**Testing Matters:**
The agent can't test on actual devices, which is critical for mobile development. Until AI can actually run apps on phones and see visual/performance issues, it'll miss important problems.

**Documentation Has Limits:**
Reading docs doesn't replace experience. Mobile development has countless edge cases and platform quirks that you only learn by doing.

---

## The Current State of Glif Mobile

Despite the struggles, Glif now has working Android builds! The apps:

- Generate QR codes with custom colors and sizes
- Save QR codes to the device photo library
- Work offline (since it's all client-side)
- Have proper icons, splash screens, and native feel

It's not perfect, there are still optimizations I want to make, but it's functional and feels like a real mobile app.

Antigravity got me maybe 60-70% of the way there, which isn't nothing. But the final 30-40% required rolling up my sleeves and getting my hands dirty with Android Studio.

---

## Should You Use Antigravity for Capacitor Integration?

Based on my experience, here's my take:

**Use Antigravity if:**

- You need help with initial setup and boilerplate
- You're already comfortable with mobile development and just want to speed up configuration
- You're okay handling native tooling yourself when things go wrong
- Your app is relatively simple without complex native integrations

**Don't rely solely on Antigravity if:**

- This is your first time with Capacitor or mobile development
- Your app needs complex native features or optimizations
- You need production-ready, fully optimized mobile apps without manual work

**The Reality:**
Antigravity is a helpful assistant for Capacitor integration, but it's not a replacement for mobile development knowledge. Think of it as a junior developer who can handle setup tasks but needs supervision for the complex stuff.

---

## What I'd Do Differently Next Time

If I were to integrate Capacitor into another project with Antigravity, I'd:

**Set Realistic Expectations:**
Go in knowing I'll need to manually handle native configuration and optimization. Don't expect the agent to deliver a production-ready mobile app.

**Use It for What It's Good At:**
Let Antigravity handle installation, basic config, and documentation. Handle native-specific work myself from the start.

**Test Earlier:**
Don't wait for the agent to "finish" before testing on actual devices. Test incrementally and catch issues early.

**Have Native Tools Ready:**
Have Android Studio open from the beginning. Don't expect to complete mobile development purely through the Antigravity interface.

**Combine with Traditional Resources:**
Use Antigravity alongside Stack Overflow, Capacitor docs, and community forums. Don't rely on it exclusively.

---

## Conclusion

Adding Capacitor to Glif was a learning experience. Antigravity helped significantly with setup and boilerplate, but mobile development's native aspects required traditional hands-on work.

The 60-70% of work the agent handled was genuinely useful and saved me time. But that final 30-40% reminded me that AI coding tools, as impressive as they are, still have clear limitations when you cross platform boundaries.

Mobile development is complex, spanning web tech and Android. Until AI tools can truly understand and test across all these layers, they'll remain helpful assistants rather than complete solutions.

That said, would I use Antigravity again for Capacitor integration? Probably yes, but with realistic expectations and my native IDEs ready to go from day one.
