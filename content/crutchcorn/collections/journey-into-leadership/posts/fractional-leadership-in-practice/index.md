---
{
    title: "Fractional Leadership in Practice",
    description: "How taking on a short-term leadership contract can pave the way to long-term opportunities.",
    published: '2025-11-17T21:52:59.284Z',
    tags: ['leadership', 'opinion'],
    license: 'cc-by-4',
    order: 3
}
---

[My friend Obi introduced me to his CTO to help them solve some issues with their 3D code.](/posts/the-power-of-showing-up)

I spoke with their CTO. I listened to their business needs. I pitched my vision of a potential solution. I won the contract.

What ultimately swayed them wasn't the short-term gains, but the ability to have a stable environment in which they could quickly iterate and experiment in order to scale their software in the long run. They had a lot of plans for their software, and their current codebase was complex, hard to debug or extend, and relied on niche software. As a result, the 3D project had many bugs present.

In the end, we found ourselves looking at a 30-hour timebox to experiment with a version of their 3D software rebuilt into Unity. What's more, they wanted a gut check on the rest of their frontend codebase to understand the pros and cons of their decision-making. In many ways, this was less of a purely technical contract and more of a leadership contract. I was being asked to lead the technical direction of their 3D software, while also providing guidance on how to improve their frontend codebase.

It felt like someone had fired a gun in the air to instigate a race: The clock was ticking. Luckily for me, I had done contracts in the past; this wasn't a new feeling for me.

Many of my early hours were spent researching different solutions; while we knew that Unity was the right pick for web support, we didn't know yet where to ingest data from or how to process the data in the most efficient way once it got into the engine.

About three hours in, I had researched and played with a few of the choices and even made a few tiny prototypes to feel out the main differences. By hour seven, I had the minimum viable product (MVP) ready with some minor hiccups along the way. Hours eight and nine were spent pair-coding with Obi to refine the MVP to demo.

And that was a wrap! A 30-hour contract wrapped up in 9 hours.

Yes, there were unanswered questions still, but it was enough to showcase what _could_ be, rather than what was. Most importantly, however, I helped set the stage for where the product could go next.

I made sure to document the decision-making behind all of the tools I'd researched, which provided a good jumping off point for the future of the project, even when we learned that Unity was off the table. I made sure to outline what they could fix in their frontend at a high level, documenting the nuances of how their code organization was causing bugs in their apps. I even managed to make 6 pull requests to their non-3D frontend and 1 pull request to their backend deployment infrastructure.

It was a slam dunk, but not because of the code written. Little did I know that we'd eventually have to throw away our Unity code in favor of a JavaScript framework soon after I joined the company. While Unity itself did support web, a critical piece of tooling I used in my Unity demo did not support web builds. There were no viable alternatives I could find, and to rewrite it would have been a herculean task.

No, the reason the project was a slam dunk was that it articulated a clear reasoning for where I thought the project should go next. A reasoning formed through conversations with their CEO, CTO, and the rest of their team. It started with a technical understanding of problems but evolved into solving tangible business needs.

----

This, too, taught me a few things:

1) Experiments don't have to work to win.

   While we didn't end up going forward with Unity for our project, we were able to learn a lot that was able to be reused in the future. It helped us refine our vision for both the tech we wanted to use and the product features we were then more confident about shipping.

2) Documenting decision-making is critical.

   Writing down my thoughts was crucial for the success of my contract. Not only did it act as a "proof of work" while I was researching, but it acted as a guidance for where to take the project next. This painted a picture of my capabilities to lead the team to my would-be employers.

3) Solve real problems, not just technical ones.

   This one has been tough for me historically. I've spent so much of my career solving technical issues that it feels like an intuitive first step towards breaking down walls one faces. Instead, zooming out to understand _why_ you're hitting a wall can be more important than trying to fix the problem.

4) Ownership expands past your purview.

   I didn't have to make those frontend pull requests. I especially didn't have to make that backend pull request. But I wanted to understand a sense of what the project needed at a thousand-foot view. I do that best by reading code and making changes to see how problematic it is to merge code. It's this ability to go above and beyond that helped me eventually win my longer term role on the team.
