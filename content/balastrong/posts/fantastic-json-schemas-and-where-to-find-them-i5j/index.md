---
{
title: "Fantastic JSON Schemas and where to find them",
published: "2024-01-16T13:04:41Z",
tags: ["webdev", "opensource", "codenewbie", "json"],
description: "Everytime you write a config for a common tool, for example you're writing a GitHub Action in Visual...",
originalLink: "https://leonardomontini.dev/json-schema",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Web Development",
order: 18
}
---

Everytime you write a config for a common tool, for example you're writing a GitHub Action in Visual Studio Code, you get a nice autocomplete with all the available options and documentation.

Have you ever wondered where does that come from? Ok, most likely you didn't, I see it's not the most exciting topic, but some days ago I was curious about it and I dug a little bit into it.

Here's what I found out:

<iframe src="https://www.youtube.com/watch?v=P0yKSeE5M0U"></iframe>

## The problem

In short, here's the story. I was writing the config for a [GitHub Issue Template](https://youtu.be/hNs5Gg_fEEs) and I noticed that a field that was in the official docs was marked as invalid in my editor.

How is that even possible? I tried to commit and push it anyway and it worked so the doc was right but the editor was wrong.

I investigated a little bit and discovered that the JSON schemas used to validate most of the config we're using are hosted on [schemastore.org](https://schemastore.org/) and in fact, the field I was trying to use was not there.

Scroll down a little bit and... there's a public repo on GitHub where you can contribute to the schemas!

<!-- ::start:link-preview -->
[Schemastore](https://github.com/schemastore/schemastore)
<!-- ::end:link-preview -->

## The solution

Ok then, I know what to do now!

The documentation explains quite easily how it works, you can edit the existing JSON schema and add some tests to make sure it works as expected. Since this isn't a new schema but I was just adding a field, everything else was already set up.

I [created the PR](https://github.com/SchemaStore/schemastore/pull/3452) and it got merged within a few hours. As a result, the field is now available in the schema and my editor is happy again.

## Closing

And that's it! As I said, I know it's not as exciting as having a hot take about which js framework is best, but hey I was curious and I learned something new.

Hope you find it a tiny bit interesting and remember, **stay curious**!

---

Thanks for reading this article, I hope you found it interesting!

I recently launched a GitHub Community! We create Open Source projects with the goal of learning Web Development together!

Join us: https://github.com/DevLeonardoCommunity

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)

<!-- ::user id="balastrong" -->
