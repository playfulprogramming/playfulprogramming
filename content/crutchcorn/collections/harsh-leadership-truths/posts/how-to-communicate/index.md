---
{
    title: "How to Communicate",
    description: "",
    published: "2027-01-01T13:45:00.284Z",
    tags: ['leadership', 'opinion'],
    license: 'cc-by-4',
    order: 3
}
---

When I engage with many engineers, they're often incredibly bright minds; capable of doing just about anything they set their minds to. However, most have a critical crux: Communication.

I've seen few developers fit the communication needs of their orgs; though those that do typically raise quickly to become the leaders of their groups. This is either done through literally improving their productivity by unblocking themselves and others more quickly, making others feel like they're more productive because they're capable of raising their work patterns better, or more often than not both.

Let's take a look at a number of tools in my communications toolkit that have helped me along the way.

# The Anatomy of an Efficient Message

There's a lot that goes into writing an effective message to your team. While casual conversations can to be aimlessly entertaining, placing an objective on a given piece of communication shifts the goalpost.

Instead of aiming for delight, your primary goal is now to inform, enable change, and be straightforward while doing so.

To make that a reality, you can follow a few patterns to enhance the effectiveness of your messages.

## "No Hello" and "Don't Ask to Ask"

In engineering, [flow state](/posts/in_person_vs_remote_teams) is extremely important to an individual's productivity. A large part of getting into flow state is uninterrupted time to focus on a given task; something that can't be achieved when notifications are being flung in from every direction.

As such, many engineers will put their devices on "mute" and work on their tasks. It's not until they're completed with their task that they'll then go through any communication they missed during that time. This is often called **"Asynchronous communication"**, where you engage in discussions back-and-forth when the respective parties have time.

This is very different from **"Synchronous communication"** like a phone call, where you expect back-and-forth at the same time to get on the same page.

The problem is that many treat messaging like a form of synchronous communication, when it's best served as async comms.

For example, some:

- Send "Hello" or some other greeting and wait for a reply before following up.
- Ask if they can ask a question; "Hey, can I ask something?". They similarly wait for a reply before asking.

While both of these are common affairs in speaking conversations, neither is particularly useful via message.

> "Why not?"

Well, let's consider a case where you're interacting with folks from another team. You want to ask how a policy procedure should be carried out and it's their procedure.

----------

> **Don't do this:**
>
> Forgetting to include the context in your messages introduces large levels of latency in your comms.

"Hey, are you around?"

You wait for a reply. Hours pass until finally:

"Oops, sorry, I wasn't. What's up?"

An after-hours reply. Turns out that they had a long group meeting. The next day you log in:

"No worries! How do I do _X_?"

You don't hear from them until late the next day once more; they had a family emergency.

-------

> **Instead, try this:**
>
> Including the ask in your main message is critical for timely responses.

See, if you had asked "How do I do _X_?" in your initial "Hey are you around?" message, you may have gotten a reply a day sooner.

This problem grows exponentially when your team is in different timezones or work schedules as well, since the means of your communication inherently have to be asynchronous most of the time.

This is why I suggest adding as much context as you can in your initial message. Use async comms the way they're intended.

## Bottom Line Up Front (BLUF)

> **BLUF:**
>
> For longer messages, you should include your ask and any short but immediate context up at the top of the message and include context later.

While [the phrase "Bottom Line Up Front" (or "BLUF") has origins in the U.S. military](https://web.archive.org/web/20190126172241/https://armypubs.army.mil/epubs/DR_pubs/DR_a/pdf/web/r25_50.pdf), the core principals can be highly useful in civilian contexts as well. The gist of it is simple: For longer messages, kickstart your conversation with your ultimate ask at the front of the conversation.

This is helpful for all kinds of folks, but doubly so for those that are in high positions or are otherwise very busy. This allows the reader to reduce the amount of noise they need to ingest to make a decision and dictate where they can refocus that energy in further communications with you.

## Focus on Formatting

[Did you know that the average time spent on a software development website is slightly over two and a half minutes?](https://firstpagesage.com/reports/average-session-duration-by-industry/)

One trick that many sites — including this one — use to get you focused for longer is by breaking up big blocks of text with different formatting?

Things like:

- Lists
- Tables
- Em Dashes
- Bolded text
- Italicized text

All work to make your content more glanceable. The more glanceable your content is, the more likely one is to stay on task with reading it all the way through.

The same hypothesis carries into messages. If you think a few keywords are important to gather intention, **bold** them! Want to ask a list of questions but need answers to a specific few?

1) Number them
2) Include the numbers in follow-ups

That way, when someone says "About #1", you both know what you're talking about.

> **Takeaway:**
>
> Learn to add visual flair in your messages.

# Engineering Your Team's Comms

Simply structuring your messages won't solve issues in your teams' communication pipeline, however. Let's take a look at a few things that can be done to improve communications at a more systemic scale.

## Sync vs. Async

We've all heard it before:  "This could have been an email."

And you know what? Most of the time, that meeting probably _could_ have been one, too. Not only do long-toothed meetings take up time, but in an organization time is literally money (through hefty engineering salaries and the sorts). Consider the following:

| Item                    | Value   |
| ----------------------- | ------- |
| Attendees               | 5       |
| Average Salary          | $80,000 |
| Duration (mins)         | 60      |
| Per-meeting cost        | $192.31 |
| Yearly cost (if weekly) | $10,000 |

And that's for a _weekly_ meeting! When I first joined my company as VP, I was mortified to find that many of our team members were all joining a daily org-wide call that lasted upwards of an hour and half; you can imagine the cost that must've incurred over time!

If you must have a synchronous call, you should broadly make sure that it:

- Has a clear agenda
- Requires all the attendees to be there
- Has some level of time-sensitivity to it

> **Grading Rubric:**
>
> [There's a handy grading rubric and cost calculator for your meetings available at "thismeetingcouldhavebeenanemail.org"](https://thismeetingcouldhavebeenanemail.org/). I don't know who made it, but it's glorious!

## Synthesizing Summaries

You start a thread right before lunch, a challenging topic has come up in your work and you're looking for an answer. You make sure you include all the right context, formatting, and the other goodies we've talked about. You leave for lunch. When you return:

![A Slack thread with 59 replies between two people](./slack_59.png)

Oh dear. It seems like your team has a **lot** to say on the topic. But you've been out! Are you to read all 59 messages to catch up? What about the next person who wonders in?

> **How to solve this:**
>
> Add a summary to long-running threads.

Summaries are incredible ways of getting multiple ideas documented at once — retaining the context and nuance of it all — while removing much of the unnecessary chitter chatter.

You can do this in a number of ways:

1) Add a summary to the top message of a thread — pinning it if your app allows you to.
2) Move off chat apps and into an RFC document, where you can comment and edit specific points and make multiple proposals.

The second works particularly well if this decision you're debating has long-standing consequences. Having a point of reference for future folks is very advantageous in team comms.

## Default to Documentable Communication

When working with teams, it's common to get direct messages asking questions about a particular piece of technology or some other decisionmaking that needs to occur.

This seems innocuous enough and almost certainly doesn't come with any malice, but can be problematic for a few reasons:

- It insulates the information to a select few, making it harder to share this information to others if needed down the line.
- Others who might be knowledgeable on the topic are not able to join into the conversation.
- It inhibits the knowledge being accertained from transferring to bystandards, who might not think to ask the question otherwise.

It's not isolated to messages, either. Asking to jump into a 1:1 call for a pair programming session, while helpful at times, means that others can't jump in and participate or learn from the experiences. Likewise, business or broader technical decisions made in those calls [are often lost](/posts/in_person_vs_remote_teams) or need to be reevalutated with fresh eyes at some point.

To solve these problems, I often suggest that communication be made public by default. This means that all questions that are not explicitly more appropriate for private comms be made into messages or otherwise written forms of communnication that are indexed and able to be found trivially.

This includes async calls, too; either hold them in a space where people can freely join if they'd like, take notes or use AI transcription to publish the recordings, or both!

### Team Size Shyness

This problem of defaulting to private comms is excaserbated when you only have larger group chats available to raise questions in; since many feel uncomfortable with feeling foolish or stupid. 

To help mitigate this, create smaller environments that are still publicly viewable (and maybe even able to message in), but don't inherently advertise the group outside of those that need to be there.

This is also partly a sign of broader cultural change that might need to occur to help others (especially juniors) find their voices. Reward speaking publicly when it otherwise might feel silly, don't impune "dumb" questions, and encourage regular active Q&A sessions. 

# Demonstrating Leadership

The people on your teams are, first and foremost, people. It can be tricky to context switch between engineering work and soft skills at times. To help along that path, here are a few things that I like to keep in mind when chatting with my peers.

## Seek to Understand First 

- Always start by asking questions (even if you know the topic extremely well, asking questions helps you understand pain-points)

## Systemically Adding Rationale

- "Because I said so" (how to systemically add rationale in decision-making)



## Practice Active Listening

- Summarize what you've heard



## Build, Don't Block

- "Yes, and" (play off of others' excitement, even if redirecting it) ["That could be cool! We'll have to loop back on that in the future. For now, let's see how we can build a foundation to make it there"]



## Praise in Public, Correct in Private

- Story from Linkd

