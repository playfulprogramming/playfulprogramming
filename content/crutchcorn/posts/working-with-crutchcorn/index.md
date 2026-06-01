---
{
    title: "Working with Me",
    description: "",
    published: '2026-08-26T10:12:03.284Z',
    tags: ['opinion'],
    license: 'cc-by-4'
}
---

As I get further into [my engineering management career path](/collections/journey-into-leadership/), I've come to re-learn how many different personality types there in this space. Similarly, as I've gotten to grow my teams and interact with more and more people, I've grown a deeper appreciation and empathy for those that report to me on my teams.

After all, when you first join a team you're at an unbalanced scenario of information loading compared to your colleagues. While they have to learn one person's name and quirks, the new team member has to understand:

- The company culture
- The immediate and broader teams' responsibilities
- Business context
- Tech stack decision-making

And more.

Among that list of "new things to learn" is how to establish rapport with your manager. Likewise, when **I** join a new team as a manager, some of the most important early tasks are to:

- Ask questions to understand the wants and needs from the team
- Figure out who I can delegate work out to and how to prioritize incoming work
- Seek to understand how the product we're working is able to grow
- Convey my values and what I historically have looked for in successful teams

And more.

Just like before, I also need to establish rapport with my team(s).

While some of these questions can only be answered with internal comms, I believe that:

- The first step to rapport building is trust
- The first step to trust is understanding
- The first step to understanding is being given context

With this, I thought a fun excercise to begin that process is to write a "Working with me" document and publishing it publicly. Not only does this potentially help shorten the window to having my team understanding where I come from on various issues, but it aligns well with my values of:

- Transparency
- Vulnerability
- Public accountability

This is all to say...

> This document is a starting point, not a contract. If something here does not match your working style, I want to talk about it. The goal is not for you to adapt perfectly to me; it is for us to build enough shared context that collaboration gets easier.

# What is my job?

Hi, I’m Corbin Crutchley. I:

- Am an engineering manager
- Have done 10+ years as a software engineer myself
- Founded and run a developer education non-profit called ["Playful Programming"](/)
- [Maintain many large-scale open-source projects](https://github.com/crutchcorn/)
- Wrote a [few](/collections/art-of-accessibility/) [programming books](/collections/framework-field-guide/) and 130+ technical blog posts
  - I'd like to pre-emptively apologize if I send you too many of my own blog posts. If I do and it bothers you, just let me know. I'm just excited to share; no harm or ego intended.
- Frequently make (terrible) memes
  - Expect me to send you some in the following days

Many of my friends tell me that I do too much, and most days I'm inclined to agree with them. At the end of the day though, I'm driven by the same set of guiding principals regardless of what I'm working on:

> I care about the people behind the screens

Whether I am doing open-source, writing educational content, or working with product folks as a manager I want to ensure that the focus on excelance is aimed towards human experiences.

This comes across in a few ways:

1) I strongly advocate for well-maintained engineering systems
	- This makes working in a codebase more enjoyable, faster to operate within for both humans and AI, and less error-prone for end-users.
2) Growth is a trait that I work strongly to foster within my teams.
	- [My background is frought with unique challenges I had to overcome](/posts/psychosis-hyper-logic-and-engineering/) and without specific growth opportunities provided to me I would not be where I am today.
3) I believe that a product is only valuable when it intersects with real-world needs.
	- As such, data-driven product development is a core value for my work, especially if you can gather it before building.
4) Accessibility in a product-line isn't an afterthought for me.
	- A "good product" is often predecated on the idea that the user flow is good. [Wins for accessibility improve user flows for everyone.](https://en.wikipedia.org/wiki/Curb_cut_effect) 

I hold these values dear to my heart, but acknolwedge that they can conflict with one-another at times. In particular, ensuring these values are followed while providing buisness value through my work can be tricky.

My job, as I see it, is to navigate the challenges that stand in the way of progressing these virtues while establishing positive impact on an organization.

In laymen's terms: I want to unblock team members advancing improvements.

This comes in many shapes and forms, based on the size and shape of an organization. In some of my jobs, this means code review and architecture analysis. In others, it means translating technical problems to non-technical project owners. In all scenarios, it means that I strive to cultivate a healthy working culture.

# What are my values?

I believe that to understand the work of oneself, you must begin by understanding your core values. Here are just a few of my engineering values, split between interpersonal values and technical values.

While my values between these two overlap heavily, hopefully this helps you understand where I place credence in my work.

## Interpersonal Values

### I am verbose

[You know what they say about assuming things.](https://en.wiktionary.org/wiki/when_you_assume,_you_make_an_ass_out_of_you_and_me) Despite this, many engineering-focused minds will omit information during regular communication; assuming a shared baseline that may not be present. This can lead to confusion, misunderstandings, and even anger in the wrong contexts.

To help mitigate this, I may do some of the following in various channels:

- Recap what's been done until now, even if that information is available elsewhere
- Link to relevant explainers, even for seemingly obvious things
- Reintroduce a problem that's actively being discussed

These might seem obtuse in some instances, but are meant to help keep comms clean and easy to glance through.

> I will always do my best to attribute things properly. If I do, for example, reintroduce a problem you first outlined — I will try my best to credit you. After all, a large part of my job is to pass on successes to the team and take team failures as my own.

### I like to ask questions first

Before you speak, it's important that you're speaking from a place of knowledge. What better way to gain knowledge about a problem-space or organization than to ask those who are actively working on it.

My first few weeks may be best resembled by a "question tour" of my own design. Broadly, before taking on any new task, I want to understand:

- What's working well?
- What are the problems today?
- What are nuances in the problems?
- What has been attempted to fix things?

### I value transparency

I often find that managers expect their teammates to implicitly understand why an ask is being given or the context around a task.

After all, if you're like me and believe that "Because I say so" isn't a sufficient answer for justifying children's questions, why would it be accepatable for professionals?

As such, I think it's important to communicate as strongly downward as I might upwards. While upper-management might want to understand the work being done by the tech team, the engineering crew is often just as eager to learn the surrounding context of their work. To this end, I do my best to articulate the asks from the business; where they came from, alternatives considered, and more.

## Technical Values

### Determinism > Unpredicability

AI has left many confused about the value of developer tooling. What is the value of, say, ESLint in the face of automated code reviews? Why have strict types when "good enough" gets the job done?

Well, I'd argue that the same reasons we kept these systems in-place during the human-authored code era are still present today. After all, the through process of an agent often acts as a facsimile of our own processes. Having more information around how and when code might break helps dissuade an LLM from building in a manner that's not sustainable.

Moreover, it allows AI-written code to remain more consistent between runs. This consistency may seem less important today, but having an internal dataset of "what should I do in this instance?" is often the difference between stable software codegen and the wild-west of nonsensical output. 

And while AIs [have historically had controls to help with consistency of AI output](https://www.ibm.com/think/topics/llm-temperature), not only were these not bulletproof, but [many modern models like Opus no longer support these parameters.](https://web.archive.org/web/20260529190806/https://platform.claude.com/docs/en/about-claude/model-deprecations#api-parameter-deprecations) This helps make the case for deterministic tooling as a strong companion to AI-assited engineering.

### Problem understanding still matters

Similarly, AI's ability to innately answer any question thrown to it quickly has left many believing that complex problems can be solved trivially.

While this might be true in some instances, it's important to remember that many problems are instances of [Mandelbrot sets](https://en.wikipedia.org/wiki/Mandelbrot_set). This means that each level of depth in a sufficiently complex problem contains its own levels of complexity.

This isn't to say that AI isn't a useful tool for accelerating problem-understanding; simply that leveraging AI for new problems often requires a "trust but verify" system that includes off-platform research and verification of presented information.

### Systems should reinforce values

It's easy for someone to say "I care about X" but not back that up with action. Similarly, any system that isn't built around its core values is easy to leverage to sidestep said values.

For example, [Playful Programming](/) is a non-profit [with a focus on transparency and openness](https://github.com/playfulprogramming/playfulprogramming/blob/main/CORE_VALUES.md#transparency--surprise). To this end, we're working on developing our own CMS that uses Git as the source of truth to store blog posts out and in the open. This way, if an author ever wanted to leave our platform, they could do so without having to even request their data.

In a more enterprise focused example, a company that cares deeply about security needs to scope their production database access very carefully. The more any set of engineers can access data arbitrarily, the more an attacker would be able to access in the wrong scenario. To mitigate that, a company might establish scoped permissions for specific engineering types.
