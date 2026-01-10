---
{
title: "How GitHub Copilot Uses MCP Tools Behind the Scenes",
published: "2025-11-18T20:16:16Z",
tags: ["github", "githubcopilot", "mcp", "agents"],
description: "Before we dive into the details, here is the video version of this article if you prefer to watch it...",
originalLink: "https://leonardomontini.dev/mcp-tools-explained/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "34094",
order: 1
}
---

Before we dive into the details, here is the video version of this article if you prefer to watch it first and then come back here for a slower, written walkthrough. If you prefer to read, you can safely skip it and continue with the examples below.

{% youtube U_ahtUrubuQ %}

Let's begin with an easy example to make things concrete.

You open a new chat and ask Copilot a simple but very practical question: "is there any pull request waiting for me?"

After a brief pause and some behind-the-scenes magic, Copilot replies with the exact list of pull requests that need your attention. No manual search, no switching tabs. In the rest of this article, we'll unpack what actually happened behind the scenes.

![Copilot Chat](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4xlirfwysjl2wcjh4reo.png)


In this article, we'll look at how that "magic" of MCP Tools really works, using the GitHub MCP server as an example.

## From a simple question to the right tool

In the pull request example above, when you ask Copilot about your pull requests, it is not "guessing" the answer as it can't know by itself. Instead, it is using a tool provided by the GitHub MCP server to search your repositories.

Installing an MCP server is basically telling the LLM client where the server lives and how to talk to it. For example, a server might be hosted at a URL like `https://api.githubcopilot.com/mcp/`, and the client can talk to it over HTTP.

But the location of the server is only part of the story. What really matters is **which tools** that server exposes.

From the GitHub Chat UI, if you click on the Tools button, for each server you see the list of registered tools together with their descriptions. In the GitHub MCP, for example, you'll find a tool that searches pull requests.

That's the one Copilot used to answer my question about open PRs.

## How Copilot discovers the tools

So far we've focused on what the tools do, the next step is understanding how Copilot becomes aware of them in the first place.

The answer is in the Model Context Protocol (MCP) specification.

As soon as the client starts up, for example when VS Code launches, the MCP client asks each registered server for a list of tools.

The server replies with a list that includes, for each tool:

- The tool name
- A description
- The input schema (which parameters it expects)

This list is then made available to the language model. In other words, Copilot can see a catalog like "there is a `search_pull_requests` tool that takes a `query`, an `owner`, and a `repository`."

From there, the model can decide **which** tool to call and **how** to fill in those inputs.

```json
{
  "query": "repo:Balastrong/confhub is:open",
  "owner": "Balastrong",
  "repo": "confhub"
}
```

Copilot chooses the values for these fields based on your question, the current repository context, and other metadata. Then it sends that payload to the MCP server.

The server runs its own logic, talks to external APIs if needed, and returns a structured output.

```json
{
  "total_count": 1,
  "incomplete_results": false,
  "items": [
    {
      "id": 3592203585,
      "number": 5,
      "state": "open",
      "locked": false,
      "title": "Modernize create community form with card-based layout and visual elements",
      "body": "The create community form ...",
      "created_at": "2025-11-05T17:57:06Z",
      "updated_at": "2025-11-08T15:46:28Z"
    },
    ...
  ]
}
```

## Turning raw tool output into answers

The response coming back from the MCP server is not what you see in the chat.

The tool returns structured data: objects, arrays, fields with IDs, titles, URLs, and so on. This is extremely useful for the model, but not necessarily friendly for humans.

When Copilot receives that output, it treats it as **additional context**, not as the final answer. With this extra data, the model can:

- Pick only the relevant fields
- Format them nicely
- Explain what is going on in natural language

This is the step where raw tool output becomes the clear answer in your chat, powered by real data from the MCP server.

At this point, you know how Copilot finds the right tool and turns its output into something readable. But there is still an interesting question left.

## How does Copilot know who you are?

In the earlier example, the pull request search tool needs to know **which** user and repository it should work with.

If you look at the MCP output tab, you can see that the Copilot chat is initialized with your GitHub username and other pieces of repository context.

Out of curiosity, you can even ask Copilot directly: "what is my GitHub username?" It can answer based on the repository context and the information injected into the session.

More specifically, Copilot chat adds details like:

- Your GitHub username
- The repository you are working in
- The current branch
- And other metadata needed by tools

This is how the language model "knows" who you are inside Copilot chat: not by guessing, but because the client explicitly shares that information as part of the context.

## Why understanding this matters

It is easy to look at these features and think that everything is pure magic.

But when you understand that there is a clear protocol, a list of servers, a list of tools, input schemas, and structured outputs, everything becomes much more tangible.

Knowing how things move behind the scenes gives you more control. You can:

- Better understand what Copilot is capable of
- Reason about which tools might be useful for your workflow
- Design or configure MCP servers that expose exactly the tools you need

Magic is cool, but knowledge is your real power.

I'm planning to create more content exploring how VS Code, Copilot, and MCP work together, going beyond the "wow" moment and into the practical details.

Thanks for reading. I hope this answered some of your questions about how Copilot uses MCP tools.

See you in the next one!


---

Thanks for reading this article, I hope you found it interesting!

Let's connect more: https://leonardomontini.dev/newsletter

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}