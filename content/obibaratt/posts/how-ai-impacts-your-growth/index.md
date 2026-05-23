---
{ 
    title: "How AI Impacts Your Growth", 
    description: "AI can accelerate output while weakening skill development. Growth now requires intentional friction for individuals, teams, and organizations.", 
    published: "2026-05-21T00:00:00.000Z", 
    tags: ["ai", "software-engineering", "career", "leadership"], 
    license: "publicdomain-zero-1" 
}
---

# Introduction

The research is clear: AI accelerates output but decouples it from skill development. Growth now requires intentionally trading some efficiency for learning. If you want to succeed instead of stagnate, get used to learning when to do things the hard way.

Use AI without discipline and you risk losing the link between accomplishing things and personal growth. Scale that up to a team or an entire company, and you get an organization that ships quickly but struggles to build real capability. Instead of throwing AI subscriptions at everyone and hoping something useful will emerge, be deliberate about AI rollouts and teach people how to use it effectively.

Researchers at Zhejiang University found that:

> “collaboration with GenAI enhanced immediate task performance. However, this performance augmentation effect did not persist in subsequent tasks performed independently by humans.”

Climbing the career ladder used to involve a lot of repetitive, sometimes tedious work. That work built intuition and mental models. AI can now remove much of it, but it doesn’t replace the learning. If you rely on it without discipline, you’re not progressing as fast as you think. You’re outsourcing the process that builds competence.

There is a growing body of research demonstrating these risks. More importantly, there are emerging patterns for using AI in a way that preserves and compounds real skill. This article breaks down the problem, shows what it looks like in practice, and outlines what to do about it.

# The Research

Microsoft found that AI use is “subject to mechanised convergence,” meaning users with access to GenAI tools tend to produce less diverse outputs for the same task. This stood out to me immediately. There’s been a deluge of decent AI-assisted content, and it’s easy to feel drowned out. That sameness makes originality more valuable, not less. People connect with and prefer content that feels human, even if it’s less polished or less frequent.

You could shortcut the process. I could have dumped my sources into an LLM and asked it to write this article. But what would I gain from that? Something fast, coherent, and disposable. No real learning, no improvement, no signal of my own thinking.

The constraint is time. Between work, health, relationships, and everything else, it’s rational to offload the most time-consuming tasks to AI. But that tradeoff isn’t free. You decide, repeatedly, what’s worth learning and what isn’t. A useful filter is: what can I learn from this?

If the answer is nothing, like last week when I built my nth React component, lean on AI. If it’s a meaningful opportunity to build skill or develop your thinking, do enough of it the hard way to capture that value. I’m not saying don’t use AI. Use it, but anchor your work in your own thinking, knowledge, and goals. Growth depends on you taking responsibility for the outcome.

That tradeoff shows up most clearly in day-to-day work, especially when debugging under time pressure or fatigue: “Here’s the error. Fix it.” I’ve been using Cursor lately, and its “Fix with AI” command makes this especially tempting. It feels like you’re wasting money if you don’t just click it while you “think.” And it works a surprising amount of the time, which reinforces the habit.

If you haven’t formed a hypothesis about the root cause, you’re not debugging. You’re outsourcing the thinking. Over time, that erodes your ability to reason about the system. This style of prompting creeps in most when I’m multitasking. It’s easy in the moment, but it trades away understanding and long-term growth.

Breaking that loop starts with slowing down just enough to form a hypothesis. Start with your own thinking and use it to guide the conversation:

> “Here’s what I think is happening. Here’s where I suspect the issue is. What am I missing?”

Now the model is refining your reasoning instead of replacing it.

Overreliance introduces another risk: this Microsoft study found that people perform worse when using AI than when working alone, or when AI operates independently. They define overreliance as accepting incorrect outputs without sufficient scrutiny.

I had a short interaction with Qwen3.5 that illustrates the issue. In one response, it claimed its training cutoff was 2026. When I asked it to clarify, its internal reasoning showed a conflict:

> “Consistency in conversation is usually preferred… even if it's factually ambiguous.”

It even briefly converged on the correct answer:

> “I’ll just answer based on the most likely fact: 2024… No, wait. The previous turn said 2026. If I change it now, the user will notice. I will stick with 2026.”

But ultimately, it doubled down on the incorrect answer.

The problem isn’t that it was wrong; models make mistakes. This one knowingly chose to stay wrong. The model optimized for consistency over correctness, even when it had reason to doubt its own answer.

This gap between convincing output and real understanding becomes much more obvious when you look at how people are actually building with these tools.

# Case Study

I’m working with a very smart but non-technical individual who used Claude Code to build a mostly functional HealthTech MVP. It has working chat, a dozen features, organizations, teams, workflows, and both a web and iOS app deployed to the App Store. What would have taken a small team of engineers months, he built on his own, backed by a generous Opus 4.6 budget. But when we discussed the architecture in more depth, he wasn’t sure which languages or frameworks the apps were written in, and didn’t know what a backend was.

He produced real output without the mental models required to understand or extend it. As a result, he couldn’t get the project past the finish line, struggled with UI inconsistencies, and wasn’t confident deploying it to production, especially given that it would interact with protected health information.

This isn’t just an edge case anymore, it’s becoming the default.

AI makes it possible to generate working systems without building the underlying intuition that traditionally came from doing the work yourself. In this case, much of the implementation was straightforward UI and CRUD work, but that layer used to be where developers built foundational understanding.

Early in my career, most of my initial tickets looked exactly like this. The same is true for new engineers joining a team today. Onboarding tasks should be intentionally curated to expose them to the system and build a real understanding of how it works.

Like no-code tools before it, AI will continue to abstract away the repetitive parts of development. The difference is that those “repetitive” tasks were also where early-career engineers developed the intuition needed to handle more complex systems later on.

# Individual Adoption

Anthropic found that how you use AI matters more than whether you use it at all. Delegating work and then reviewing it leads to significantly better long-term understanding than full automation, even if it takes slightly more time. Over time, optimizing for learning outperforms optimizing for single-task efficiency.

Anthropic noted “that the impacts of [agentic tools like Claude Code] on skill development are likely to be more pronounced than the results.” I asked Codex to refactor a messy codebase to layered React structure and it independently got most of the way there within minutes. When your tools are this powerful, misuse becomes the default. We can avoid that by following research-backed guidelines:

- **Always do post-task comprehension when you aren’t familiar with the work that was done.** Each time you use AI to generate something new, take the time to understand what it did and why. Do it while the context is still fresh.
- **Use AI for expansion, not replacement.** Start with your own thinking, constraints, and goals. Let the model refine your reasoning.
- **Do not cede control of the system.** If you’re shipping large changes you can’t adequately explain, or approving things you didn’t review, you’ve lost control.
- **Do not rush through foundational work.** Not everything needs to be optimized for learning, but the tasks that build intuition shouldn’t be fully delegated.

Intentional friction is a choice you make in how you approach problems. I once asked Corbin Crutchley a question about React state, and instead of stopping at an answer, Corbin opened the React source code and walked me through it. It took longer and required a lot more effort, but that’s what made `useState` and `useRef` really click.

Doing things the hard way matters—not for external validation, but because it builds your ability to struggle through problems. AI can help you move into adjacent domains: frontend engineers into design, backend engineers into infrastructure, or even into product. Use that power to deliberately shape your career.

The Zhejiang University study showed that your perceived autonomy can diminish if AI-driven contributions override your decision-making. If you’ve ceded control to agentic workflows, that feeling compounds quickly. You should be driving the conversation, setting the goals, and reviewing the work. AI should support and elevate your judgment, not replace it.

# Actions for Team Leads

Without strong mental models, it’s easy to mistake output for progress. Over time, that turns developers into reviewers of generated code instead of authors of systems. From there, the workflow may look like it's efficient and automated, but the team becomes less capable of understanding or improving it.

When new team members join, start with constrained AI use and progressively relax those restrictions as they demonstrate understanding. This applies to experienced engineers as well, though juniors benefit the most. Give them a structured onboarding plan, with check-ins, pair coding, and system walkthroughs from existing team members.

The most important thing is to repeatedly make it clear that struggling in the early period isn't only expected, but encouraged. Be deliberate about creating boundaries between growth and output; by decoupling learning phases from high-velocity execution, you allow your team to understand exactly when to embrace the struggle and what they are truly optimizing for. Without being very clear in your communications, new hires are at risk of increased anxiety and feelings of insecurity.

Junior developers are most at risk of AI misuse. They gain the most in the short term, and it's harder than ever to break into tech. They face extreme pressure to appear the most competent and productive at a time they should be optimizing for learning.

Mid and senior engineers can also fall into bad AI patterns when leadership rewards raw output over system quality. It's entirely rational for a mid-senior developer to focus on maximizing output in order to climb the ladder even if their skills stagnate along the way, leading to further cycles of AI misuse. Management can also overwork the best engineers and create a toxic work environment where productivity is the only metric, and the best employees spend their lunch breaks updating their resumes.

Introduce structured friction by making reasoning visible and part of the work product. Have engineers explain tradeoffs, identify failure modes, and use AI to challenge their assumptions rather than simply generate answers. When would this not be the best course of action? Why is JavaScript NOT the answer to everything? Bear in mind that this will increase the cognitive load of the entire team, which will benefit them but necessarily slow things down. You are in the best position to decide how much pushback and intentional friction each team member needs.

Ensure everyone on your team knows when AI use is appropriate, and that they are ultimately responsible for anything they sign off on. Automated review processes are great but they shouldn’t be entirely trusted. AI-generated review comments, claims, and issues should be verified by someone with both domain knowledge and technical expertise.

# Organizational Decisions

With the prevalence of AI tooling in both education and industry, organizations need a clear stance on how these tools should be used. Without one, teams default to whatever maximizes short-term output.

This works… until it doesn’t.

I know very talented engineers who are working on 4–5x more tickets than they were a year ago, but they’re losing their grasp of the systems they work on. Bugs are lingering, UI quality degrades, and user experience suffers.

And it’s expensive. AI spend is exploding across the industry, but that doesn’t automatically translate to higher product quality. Apps that were once polished now ship with rough edges and regressions that shouldn’t make it to production. In late April, I ran into more bugs in a day or two of ordering food delivery than I had in years prior.

If you reward metrics like lines of code, tokens consumed, or tickets closed without context, you reinforce the exact behavior that creates these problems. You get more output, at the cost of ownership.

It’s never been easier to build things. But building hasn’t been the hard part for a while—it’s knowing what to build, why it works, and how to evolve it over time. That requires engineers who understand systems, not just tools.

If you optimize purely for output, you will get output. Fast, polished, and mechanically converged. Meanwhile you’ll struggle to build and retain engineers who can own complex systems. Over time, hiring and retention issues become real problems.

Reflect on what your organization actually rewards. Not what it says, but what its behavior reinforces. Consider what a new hire or soon-to-graduate student sees when they look at your organization. Are you somewhere engineers grow and become great, or a relentlessly optimized software assembly line?

Organizations that get this right don’t try to limit AI usage. They align incentives so that using AI responsibly is the easiest way to succeed. That means accepting a tradeoff. Short-term efficiency may decrease in some areas, but building an org full of stronger engineers, better systems, and more resilient teams is worth the effort.

A team that is capable, confident, and responsible in how it uses AI is an enormous asset. You can’t force that into existence without aligned incentives. Push AI adoption while cutting headcount, and you’ll erode trust faster than you build capability.

There is a real responsibility here: not just to ship faster, but to build an environment where engineers can continue to grow while using these tools.

# Conclusion

Growth now requires intentional friction: occasionally choosing learning over speed, even when AI could solve the task in a prompt or two. That can feel inefficient. It can even feel useless while you struggle through something a model could generate instantly. But that struggle is often where the growth happens.

That doesn’t mean falling behind. AI proficiency matters, and ignoring these tools is not a serious option. The point is to use them deliberately. Sometimes that means moving fast. Sometimes it means slowing down, tracing the system, asking why, and making sure you understand what you’re approving.

That balance is what makes this such an exciting time to be in tech. We have more capability available to us than ever before. Used well, AI is ridiculous leverage. It let me build things I had been putting off, prototype ideas across multiple domains, and research topics that would have taken far longer to approach manually—from personal projects and games to HIPAA compliance and OLAP databases. I even built a working prototype of a game I’d designed over a year ago on my flight home.

That’s the version of AI I want more of: not a replacement for skill, but a force multiplier for people who keep building it. The same applies to teams and organizations. The goal isn’t to use less AI. It’s to create environments where AI makes people more capable instead of more dependent.

Use AI to go further. Just don’t let it rob you of the work that makes you worth amplifying.

# Sources

- Anthropic. (2026, January 29). *[How AI assistance impacts the formation of coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills)*. Anthropic.
- Crutchley, C. (2025, April 9). *[Scale your project with layered React structure](https://playfulprogramming.com/posts/layered-react-structure/)*. Playful Programming.
- Jain, S. (2026, April 16). *[Uber’s Anthropic AI push hits a wall—CTO says budget struggles despite $3.4B spend](https://finance.yahoo.com/sectors/technology/articles/ubers-anthropic-ai-push-hits-223109852.html)*. Benzinga via Yahoo Finance.
- Lee, H.-P. (Hank), Sarkar, A., Tankelevitch, L., Drosos, I., Rintel, S., Banks, R., & Wilson, N. (2025). *[The impact of generative AI on critical thinking: Self-reported reductions in cognitive effort and confidence effects from a survey of knowledge workers](https://www.microsoft.com/en-us/research/wp-content/uploads/2025/01/lee_2025_ai_critical_thinking_survey.pdf)*. CHI Conference on Human Factors in Computing Systems (CHI ’25). Association for Computing Machinery.
- Vorvoreanu, M., Passi, S., Dhanorkar, S., Heger, A., & Walker, K. (2025). *[Fostering appropriate reliance on GenAI: Lessons learned from early research](https://www.microsoft.com/en-us/research/wp-content/uploads/2025/03/Appropriate-Reliance-Lessons-Learned-Published-2025-3-3.pdf)*. Microsoft Research.
- Wu, S., Liu, Y., Ruan, M., Chen, S., & Xie, X.-Y. (2025). *[Human-generative AI collaboration enhances task performance but undermines human’s intrinsic motivation](https://www.nature.com/articles/s41598-025-98385-2)*. *Scientific Reports, 15*, Article 15105.

