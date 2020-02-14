---
{
	title: "How to Pick Tech Stacks For New Projects",
	description: 'I often get asked "How do you pick a tech stack for your projects?". This article answers that by outlining what questions you should be asking early on',
	published: '2020-02-04T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['engineering'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

> When you make a new project how do you go about planning it. You know what features you want, before you even start do you figure out frameworks, libraries etc. you will use for those different features, do you also make sure that all the different technologies you will be using will work together nicely in your application? Thanks!

The answer is ironically a lot less about the solution to a given problem as much as it is discovering the root of the problem itself.

For example, let's look at a project I've been debating spinning up:

An online first bootcamp system with interactive tests, live streamed content, and a large set of hosting video, etc

The first thing I do, before looking at any tech whatsoever is think about it from a business perspective. "Who is this for?", "What do they want?", "What's most important to have done first?", "What are my stretch goals/holistic vision/defining drive?", "What is the profit model?" (if that matters to that project), "What's my budget? (time, money, etc)". These are all of the questions I lay out before even thinking about coding. Whiteboarding these things, explaining them, etc.

In this case, the two groups of people I would want to appeal to is:

- Students
- Independent teachers looking for a unified platform

What do they want:

- Simple-to-use UI
- Lots of full-filled content (meaning I have to maintain some kind of storage layer)

What is my holistic vision:

- A single place to host a course for someone
- An independant creator feeling comfortable enough to host content here without having to make their own landing page/etc (so a lightweight customization of a page to showcase their own brand/course)
- Focus on groups rather than single courses. Subscribing to a single content group/creator rather than "React course #1" which has no clear distinction from another "React course #1"

Profit model:

- We'd focus on a B2B type solution where you could pay for a pro account that would make promoting your courses and stuff to other students easier.
- No students would pay for accounts but might pay for subscription to course content
- We'd likely take a cut of the subscription or charge for course features in some way

What's my budget:

- Myself, maybe a few other folks locally
- All as second jobs
- All on top of working on other UU content and other side projects

Now that we have a clearer goal of what the problem space we're entering is, we can more clearly define our goals (next part)

# Goals

Now that we're onto setting goals, I like to start thinking about "What is the bare minimum we need to show this to someone to spark a conversation". This is often called the "MVP" (minimum viable product)

Looking at what we need to do, I can say that we could probably get away with the following:

- User account creation. We'll keep only one type of user for now, but we do need to be aware that users will have different permission roles in the future

- Organizations creation/viewing (we can manually assign users to orgs using the database for now, but we'll want to structure data to support many users per org)

- This org will need courses, so creation/view of those (no need to manage permissions, that'd be a future feature)

- Courses will need content, so a way to upload/view content on courses

Notice how when I'm thinking about the features in a minimal way, I'm also mentally mapping how the data should be structured and thinking about long-term implications even though I'm only building them in a short-term way (aka I'm ignoring the nuances of certain permission features, but still building things mentally in such a way that we can add them later without refactoring everything)

# Requirements

Finally, I look at the data requirements and features and start thinking about what code requirements I'll have:

- I need to upload/download files

Speaking from experience, doing this with GraphQL is a pain-in-the-ass, so I'll stick with REST for now, easy enough

- My data isn't likely to change structure very much

As a result, I'd feel comfortable using SQL for something like this.

- I need user authentication

So I'll probably use "passport" or something like it. If I want to enable users to sign in from their Google accounts or something in the future, I should keep that in mind (as I wouldn't want to roll my own OAuth) even if I'm not building that functionality off-the-bad

- I am going to be focusing on per-user UI (achievements, dashboards, etc)

As such, my use of something like Gatsby (for SSG) isn't realistically very helpful. We could go with Next.JS or something like that, but due to using a lot of media (ala video/picture) I'd argue there's not that much optimization by building SSR-first

- I'm not likely to have a lot of forms in my application - primarily focusing on viewing rather than form creation

As a result, I might not go with Angular (which I personally have found their form system to be quite robust)

- However, I will be following a lot of live-streamed user content in the future

Stuff like "live quizzes", live streaming/playback of video, anything that requires tracking of time/etc is all a great use case for event-based programming (ala RxJS).

So there we have it - a non-Angular, REST API, Passport authenticated, SQL DB, non-SSR, RxJS powered application

Now, this doesn't give us the whole idea, but from here we can start doing further research (next part)

# Extra Pieces

From here, things start becoming a lot more subjective and a lot more social.

I personally prefer Vue, but after talking with my team - it's what they're most comfortable with. That plus its size and strong backing makes me feel okay with using it as I feel it can sustain our product's growth.

Moving onto CSS was more of the same: It was less "what can support this specific use-case" and more "What is familiar and can sustain our growth?". This is where things get really tricky because you often are not just picking a framework or library, but often a philosophy of CSS as well. After a long-form discussion with my (front-end focused) team about this, we decided to go with Styled Components and Material UI. This was due to their flexibility, general A11Y support (for MUI), themability, and our comfort with the tools. The size and stability also took a role in this discussion.

Smaller decisions of libraries for me often boil down to a formula-of-sorts:

- What's their community support like? (can I ask a question and have an answer within a few days)
- What's the size of their community? (typically judged by questions I can find on stackoverflow, their community site/forum, or even npm downloads)
- How stable is the tool?
- When was it last updated?
- Does it handle my edgecases?
- What's the performance of the tool?

Each tool and usage will weigh these questions differently. If I'm using a timer component from a library and the code is small, clean, easily readable, but only has seven stars on GitHub, I'll go with it over a larger more bloated alternative because I know I can maintain it if all else fails. However, I wouldn't go with something like IO.js (now defunct alternative to Node.js) for a larger project regardless of how clean the code is because I'd be unable to maintain the more obscure tool (as opposed to Node.js) if I ever needed to

# Conclusion

To recap, it's a mixture of:
- Proper planning (focusing on features and experience rather than tech)
    - 2x on this, as understanding what to start building after picking the tech is important
- Expertise
    I knew that SQL would suffice for our data thanks to my experience scaffolding various applications with SQL and NoSQL alike
- Research
    The only reason I knew that working with binary data over GQL is due to research I did ahead of time before even writing any code
- Communication
    This one is often overlooked but is CRITICAL - especially within teams. Leverage each other's strengths and weaknesses and be open and receptive to suggestions/concerns

That's by NO means an easy feat to do, despite reading fairly easily. Don't worry if you're not able to execute these skills perfectly - goodness knows I can't! I'm sure a lot of the decisions I made here, even with the group I spoke to, could have been better guided in different ways. These are the skills that I think I personally value the most in Sr. devs - especially communication. Communication becomes key when working with medium/larger teams (or really, teams of any size) since reasonable minds may differ on tool sets that they might see strengths/weaknesses in

Sorry for the essay y'all. Even though it's long, it's the most concisely I could sufficiently feel as if I'd "answered" this question (because there's so much nuance here that there little to no full and perfect answer to it!).

