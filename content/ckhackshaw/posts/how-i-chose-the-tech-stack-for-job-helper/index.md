---
{
  title: "How I Chose The Tech Stack For Job Helper",
  description: "Choosing a tech stack isn’t just about picking trendy tools, it’s about aligning architecture with real-world needs.",
  published: '2025-09-22',
  tags: ["react", "typescript", "python"],
  license: 'cc-by-4'
}
---

The job market is tough right now.

Since 2022, high interest rates and economic pressure have made hiring managers cautious. At the same time, the rise of AI tools like ChatGPT has caused many execs to pause hiring, re-evaluate roles, or try to "automate the gap."

I built Job Helper to reduce some of the emotional and logistical friction of job searching — especially for developers and tech professionals navigating uncertainty.

But from the very beginning, one question shaped the entire project:

✨ How do I design a stack that balances performance, maintainability, and real-world usefulness?

This article walks through the functional needs of Job Helper, the tech decisions I made to support them, and why I believe they were the right tradeoffs.

🧩 Functional Goals
I started by defining what the app actually needed to do. These four capabilities formed the foundation of every architectural decision:

Schedule recurring job scrapes (from platforms like LinkedIn, Indeed, etc.)

Generate CVs and cover letters using AI, customized per job

Send automated emails with links to those tailored documents

Manage the full job search lifecycle: saved jobs, applications, rejections, follow-ups

I wasn’t building a static job board — I was building a system that moves with the user and adapts to their search.

🧱 Service Architecture
With those goals defined, I began decomposing the system into logical services:

🐍 Scraping Service (Python + Flask)
Why Python? Web scraping is a solved problem in Python. With requests, BeautifulSoup, and Selenium, I could move fast and stay productive.

Why Flask? I didn’t need a heavy framework. Flask is lightweight and perfect for exposing scraping logic via internal endpoints.

Why its own service? Scraping is a long-running process. Keeping it isolated meant fewer risks of blocking API responses or creating a poor user experience.

🧠 AI Document Generation (Python + Flask + Celery)
LLM integration: This service takes raw CV data and job descriptions, then uses a language model to generate tailored CVs and cover letters.

Why separate it? Same logic as above — LLMs are compute-intensive, and I didn’t want delays on the main app thread.

Why Celery + Redis? Background task queueing is a natural fit. Scraping and document generation can be chained together, and workers can process them independently.

⚡ GraphQL Gateway (Node.js)
Why GraphQL? I wanted the frontend to request exactly what it needed — nothing more, nothing less. This reduced data over-fetching and made the UI more responsive.

Why Node.js? Node handles API logic well and integrates easily with GraphQL tooling like Apollo Server.

Why a gateway? This created a clear separation between user-facing requests and internal processing, which improved both security and maintainability.

🐘 PostgreSQL Database
Why Postgres? It's reliable, battle-tested, and handles relational data like job searches, applications, and document metadata very well.

I didn’t need a document store or NoSQL solution — strong schema enforcement was actually a benefit in this case.

🐳 Docker for Containerization
With all these moving parts (GraphQL API, scraper, AI service, Redis, Postgres, Celery workers), I needed a way to orchestrate the app locally and in production.

Docker let me:

Keep services isolated

Control which containers could talk to each other

Restrict public access to only the GraphQL API

Easily spin up staging environments

One lesson I’ve learned from experience is that clean service separation is only useful if the communication between services is predictable and secure — Docker networking helped a lot here.

🎨 Remix Frontend
I chose Remix because it’s now officially recommended by the React team as a full-stack solution.

It also gave me exposure to file-based routing, nested layouts, server-side rendering, and progressive enhancement — all while keeping the dev experience modern and React-like.

Since I already had a GraphQL layer in place, integrating with Remix was straightforward.

📄 Google Docs for CV & Cover Letter Generation
This might surprise some people, but I intentionally avoided building a custom document editor.

Instead, I used Google Docs because:

It already supports real-time editing, templating, version history, and PDF exports

I didn’t need to reinvent rich text formatting or build a doc collaboration tool

I already use it daily — and it's not going anywhere

It also meant users could edit generated CVs before downloading them, giving them flexibility without adding complexity to my stack.

📚 What Influenced My Decisions
An article by Corbin Crutchley was a major influence on my thinking — especially around service boundaries, asynchronous task design, and choosing tools that support iteration instead of blocking it. I highly recommend checking out Playful Programming for more smart developer content.

🔚 Final Thoughts
I’ve built many applications in my career, but Job Helper was a special kind of project — it forced me to zoom out and look at architecture holistically. Not just “what’s the best tech?” but:

🧠 What’s the right level of abstraction for this problem, given what I know and what the user needs?

The result is an app that’s:

Modular

Performant

Built on tech I trust

And more importantly, built to help real people.

I’ll be open-sourcing this project soon and would love to hear feedback from other devs, architects, or hiring managers.

If you’ve made similar decisions — or different ones — let’s talk.

#Architecture #DevTools #JobSearch #OpenSource #Python #React #LLM #BuiltInPublic

