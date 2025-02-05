# Contributing to Playful Programming Blog

As a community, we welcome anyone to write and submit posts to the Playful Programming blog! In this document, we'll go over how to create a new post in UU and submit it as a pull request.

**🚀 IMPORTANT: If you are new to contributing via GitHub, consider going through the [First Contributions guide](https://github.com/firstcontributions/first-contributions) before proceeding.**

## Guidelines for Writing Your Post

- Be inclusive! We support all sorts of skill levels - don't disparage newcomers or discourage readers from learning new things.
- Aim to provide factual and relevant information - citing sources is encouraged!
- Keep your content unbiased; i.e. don't advertise commercial products or services without reason.

If at any point you get stuck or want to ask questions, feel free to [open an issue on GitHub](https://github.com/playfulprogramming/playfulprogramming/issues/new) or [reach out to us on Discord](https://discord.gg/FMcvc6T) for help!

---

## Contents:
1. [Creating an author profile](#creating-an-author-profile)
2. [Writing a new post](#writing-a-new-post)
3. [Translating a Blog Post](#translating-a-blog-post)
4. [Submitting a Pull Request](#submitting-a-pull-request)

# Creating an Author Profile

Before creating a post, you'll need to add some information about yourself. To do this, create a new folder in [`content/`](./content/) with your username, and add an `index.md` inside it; e.g. `content/eric/index.md`.

Here's an example of what your `index.md` might look like:

```js
---
{
  name: "Eric Programmer",
  firstName: "Eric",
  lastName: "Programmer",
  description: "Haskell programmer, fanfiction author, and an omniscient unicorn.",
  socials: {
    mastodon: "https://hachyderm.io/@playfulprogramming",
    github: "playfulprogramming",
    website: "https://playfulprogramming.com/"
  },
  pronouns: "they/them",
  profileImg: "./profile.png",
  roles: ["author"]
}
---
```

**Don't want to show your real picture on the site?** That's alright! We have a [myriad of custom unicorn emotes that can be used as profile pictures as well](https://github.com/playfulprogramming/design-assets/tree/main/emotes). They're adorable, go check! 🤩

Once your profile is created, you'll be ready to proceed to the next step...

# Writing a New Post

All posts on Playful Programming live in a `content/{username}/posts/` folder - we structure this with a subfolder for each post, containing a markdown file named `index.md`. The naming of this post folder will match its URL on the site.

**New to Markdown?**
Check out the [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for examples of how to format different types of content in this file!

When writing your post, you'll need to include some metadata in the frontmatter at the top of the file:

```js
---
{
  title: "My First Post",
  description: "This is my first post on the Playful Programming site!",
  published: '2023-04-11',
  tags: ["meta"],
  license: 'cc-by-4'
}
---
```

**Note:** The "title" that you define here will always be displayed at the top of the post. You don't need to start your post with another heading - otherwise your post will have two titles!

<details>
  <summary><strong>Optional Properties</strong></summary>

  There are a few extra properties that you *can* specify in the post frontmatter, but are not required:

  - `authors: ["author1", "author2"]` can be used to manually specify the author IDs of a post, if written by multiple authors.
  - `edited: "2023-10-21"` can specify the "last updated" date of the post if any edits are made.
  - `collection: "My Awesome Article Series"` will treat a group of posts as a series if they all specify the same `collection` string.
  - `order: 0` will reorder posts in a collection according to whatever value you provide.
  - `originalLink: "https://example.com"` specifies an external URL that the post was originally sourced from.

</details>

# Submitting a Pull Request

Once all of your changes have been made, [create a Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) to merge your post into the site.

- Open a [new Pull Request](https://github.com/playfulprogramming/playfulprogramming/compare) from your fork
- Check that your files are in the Pull Request, and that they're being merged into the `main` branch.
- Create the PR and wait for a maintainer to review it.
- Once merged, your post will be visible on the site!

We'll get in touch with any questions or feedback once we've reviewed your post!