---
{
title: "How AI is changing my development workflow and I am excited about it",
published: "2026-02-09T00:07:31.869Z",
edited: "2026-02-09T00:07:31.869Z",
tags: ["AI","AI Development","Developer Experience","Workflow","Claude Code","CodeRabbit","GitHub Copilot","Anthropic"],
description: "If you are here, I am sure either you are excited about AI or you are scared about it. I am in the first category and super excited about AI and how it's changing my development workflow",
originalLink: "https://www.santoshyadav.dev/blog/how-ai-is-changing-my-development-workflow-and-i-am-excited-about-it/",
coverImg: "ai-cover-image.png",
socialImg: "ai-cover-image-og.png",
order: 1
}
---


Hey everyone, hope you are doing well and having a great start to the new year 2026. 

If you are here, I am sure either you are excited about AI or you are scared about it. I am in the first category and super excited about AI and how it's changing my development workflow and I wanted to share my experience with you all.


## Why am I excited about AI driven development when some feel it's scary?

For the last few years, my focus has been on improving Developer Experience and Developer Productivity, which means creating new tools, leading education efforts internally, helping with issues, and leading large development efforts. All of this requires research.

But when you are juggling between too many tasks, creating a small tool takes time. After AI, I became more productive. I still like to write design docs, I love to write design docs. Yeah, I am an IC (Individual Contributor), and it's something I started enjoying more in the last few years.

My new development workflow with AI looks like below:

- Monitor what teams/developers are struggling with most. This can be in the form of quarterly feedback, GitHub issues, or frustration from internal Slack or social media where your users are. 
- Start putting the idea in the form of a design doc.
- Get the design doc approved to see if the problem you are trying to solve makes sense and you are on the right track.
- After approval, give the design doc to a planning agent to break it into smaller tasks.
- Start working on the tasks and I will generally recommend splitting these tasks into smaller PRs if possible to iterate faster.
- For example, if I want to split a giant library into smaller libraries:
    1. The first step will be to create a new library structure and get this merged.
    2. In the next step I will copy the code from old library to new library, raise a PR for that.
    3. In the next step I will replace the old library with new library, raise a PR.
- Once the feature is shipped, monitor the feedback and iterate if needed.

![A hand-drawn flowchart on a beige background. A box labeled "New Task" has an arrow pointing to a box labeled "Create a design doc and get it reviewed". From there, an arrow points to a box labeled "Give it to planning AI agent like GitHub copilot". An arrow from this box points to a box labeled "Read docs, blogs, see videos, search on internet, stackoverflow etc". An arrow from this box points to a box labeled "Write code". An arrow from "Write code" points to a diamond-shaped decision box labeled "getting issues?". If the answer is "No", an arrow points to a final box labeled "Raise a PR/MR". If the answer is "Yes", an arrow loops back up to the box labeled "Give it to planning AI agent like GitHub copilot".](./ai-workflow.png)


The time I had to invest in trying different solutions has decreased. Even for issues while developing, I can feed the error back to AI and it's able to re-iterate on the solution.
In the past, there have been many instances where I tried multiple solutions and was able to get to the right solution after 
multiple iterations. Now I can do it in less time, but this is also possible because of the number of hours 
I have invested working on my craft.

Yes, AI hallucinates many times, and you still need to trust yourself on what solution should be accepted. For example, many times while generating unit tests for Angular, 
I found the tests are using [NO_ERRORS_SCHEMA](https://angular.dev/api/core/NO_ERRORS_SCHEMA), which I personally don't like as it can suppress some actual errors, 
and you need to be aware of gotchas like these. 

Do you think developers in enterprise or building serious apps are going to be so careless about what they are pushing to production? I don't think so. 
I am sure most companies will have some sort of guardrails in place to make sure the code is not just AI generated but also reviewed by an engineer or an AI code review tool before it goes to production.

## What kind of engineers will be in demand in the future?

In my experience, there will be demand for good engineers, and there has always been a demand for good engineers.
I have been part of the hiring team, the first thing we say during the hiring planning is we need to hire good engineers.
The good engineers with AI will be unstoppable, they will be able to solve more complex problems, and they will be able to create better solutions.

You know, the number of hours you have invested in building a project and searching for solutions over the internet is not suddenly going to be useless.
It's very useful when AI throws a solution at you and you realize that it's not the right solution. You can quickly iterate and find the right solution, and this is where your eye for detail comes in handy.

What kind of engineers am I talking about? 
- The engineers who are curious.
- The engineers who know how to write maintainable code.
- The engineers who are willing to learn new things.
- The engineers who are willing to adapt to new tools and technologies.
- The engineers who want to ship better products and solve real problems for their users.

## My development workflow before AI

I have been writing code since 2008. I started my career writing code in C# doing Windows development. In those days, learning to code meant reading books, I was not even aware of GitHub until 2013.

By 2011, the ways to learn were changing. If you got stuck with any bug or issue, it meant searching the internet and trying out many solutions from Stack Overflow or some blog you found on the internet.

If I visualize this is how my development workflow looked like

![A hand-drawn flowchart outlining a software development workflow. It starts with a box labeled "New Task", leading to a diamond decision box asking "Do I need to do research". If "No", an arrow points directly to a "Write code" box. If "Yes", an arrow points to a box labeled "Read docs, blogs, see videos, search on internet, stackoverflow etc", which then points to the "Write code" box. From "Write code", an arrow leads to another diamond decision box asking "getting issues?". If "Yes", an arrow loops back to the "Read docs..." box. If "No", an arrow points to a final box labeled "Raise a PR/MR". Additionally, from the "getting issues?" diamond, another arrow points down to a box labeled "Find the solution at 2am while sleeping", which then has an arrow pointing to the "Raise a PR/MR" box. The entire chart is in a hand-sketched style on a cream background.](./AI-blog.png)
 
Today, writing code is the easiest part of the job. The improvement in tooling or let's call it AI tooling—has changed the perspective of even Developer Experience.

Now developers don't care about better DX from a programming language; everyone is a prompt away from creating a new application. And this is where the problem starts. 

Most people think they are suddenly a developer. Yeah, I know the word "vibe coding," but that's not engineering. And if you don't believe me, see this video:

[Senior Developers are Vibe Coding Now (With SCARY results) From TraversyMedia](https://www.youtube.com/watch?v=nGxpctRd2OQ)


When I learned to code, one principle I was repeatedly told by my peers was "The code must be readable" a principle I have tried to follow throughout my career. Are we doing it now? Yes, people shipping Production-Grade applications are still doing it. Even though AI is writing most of the code, good engineers are careful with what goes into production.

AI is making shipping Production-Grade applications hard for organizations as well. [See the report by CodeRabbit](https://www.coderabbit.ai/blog/state-of-ai-vs-human-code-generation-report).

I know about the fear factor. Every news item is about layoffs, CEOs claiming no one needs developers in 6-12 months.

Here are some of the news I have seen in the past.

- [Mark Zuckerberg says AI will be doing the work of mid-level engineers this year](https://www.forbes.com/sites/quickerbettertech/2025/01/26/business-tech-news-zuckerberg-says-ai-will-replace-mid-level-engineers-soon/)
- [Anthropic CEO: "We might be 6-12 months away from a model that can do everything SWEs do end-to-end. And then the question is, how fast does that loop close?"](https://www.youtube.com/watch?v=mmKAnHz36v0&t=1s)
- [Former Google CEO predicts AI will replace most programmers in a year](https://san.com/cc/former-google-ceo-predicts-ai-will-replace-most-programmers-in-a-year/?utm_source=chatgpt.com)  

And let me tell you some of them were from 2025, we are already in 2026, and I am still here writing code, and I am loving it.

# Conclusion

What AI cannot take away from most engineers is the ability to find the right solution. Understanding when AI is wrong, irrespective of how long you have been coding, is something that is becoming more valuable than ever.
AI is a tool, treat it as a helper on the side. It can help you reiterate on your ideas and write better tests, but if you don't know 
what code is being pushed to production, that's a problem. I know we have heard so many horror stories of vibe coding already.

And believe it or not, most organizations I know are still hiring. Let's even talk about Anthropic, they hired the Bun team,
the same company whose CEO said that AI will replace mid-level engineers in 6-12 months. 

AI is changing the way we write code and the way we interact with code. You can talk to AI and reiterate on your ideas.
What's fun is I can build a side project I have been thinking about in a few days time, which I was not able to do in the past because of time constraints. I am super excited about it.

You can share your thoughts about your experiences with me on [Twitter](https://twitter.com/santoshyadavdev), [Bluesky](https://bsky.app/profile/santoshyadav.dev) or you can also reach out to me on [LinkedIn](https://www.linkedin.com/in/santoshyadavdev/)