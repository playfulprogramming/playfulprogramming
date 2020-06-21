---
{
	title: "Autogenerate Changelogs and Manage Releases using Conventional Commit",
	description: "An explanation of what server-side rendering is, what static site generation is, and how you can utilize them in React, Angular, or Vue!",
	published: '2020-06-23T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['packaging', 'engineering', 'javascript'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

Writing changelogs for a project can be tedious. Usually, this lengthy process would start with your project manager, organizing your tickets in the sprint (depending on how your project is organized), and taking time out of the day to write the changelog itself. This process becomes even more complex when working on developer-centric projects. Remembering what is and isn't a breaking change (to keep a sensible [SEMVER](https://www.geeksforgeeks.org/introduction-semantic-versioning/)), what technical changes were made, and what you should do to migrate to newer versions might be a challenge in itself, on top of the typical release patterns.

This versioning complexity birthed a set of tools that allows you to automatically generate changelogs. Now, this may sound too good to be true: "How can it generate something without any metadata?" Well, dear reader, that's the trick of it: You **do** provide the metadata in the form of commit messages.

If you enforce a standardized set of commit messages (both header and body), then a tool can automatically run through each commit since your last release and generate the changelog from there. Furthermore, because the commit message standards you'll follow explain when a new feature, bug fix, or breaking change is introduced, this tooling is able to assume what portion of SEMVER (major, minor, or patch) to bump, and can change the version numbers in your files as well!

# Step 0: Commit Rules {#conventional-commit}

Before we start setting up tooling (to generate the changelogs, commit message verification, and more), we need to first understand what the rules are that we're signing up for. As mentioned before, we'll need to standardize the way we write our commit messages for our tooling to work effectively. The standardized commit message template we'll be following in this article is called [Conventional Commits](https://www.conventionalcommits.org/). Conventional Commits generally follow an outline as such:

- First, start with the _type_ of change you're making
- Then, have an (optional) scope, indicating what section of your app you're changing
- A description of your changes
- Then, an optional body that outlines further information that you might want to preserve in your changelog

```
type(scope): description

body
```

"Now, by 'type', what exactly do you mean?"

I'm glad you've asked! In Conventional Commits setups, there is an allowed array of terms that can be used for your _type_. For example, when following the Angular Style of commit messages, you'll have these options at your disposal:

```javascript
[
  'build',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test'
]
```

This means that your commit message might be something along the lines of:

```
test(pagination): added pagination edgecase to test suite

When changing pages on an odd number of items in the collection, we had an error thrown as a result of a miscalculation. This test should ensure this bug doesn't regress
```

In this case, your _type_ is `test` whereareas your scope is `pagination`. This way, when you're generating your public changelog, it will likely not include this commit message, as your users don't often care about the implementation or tests within. While this isn't a great example, let's take the next two examples:

```
fix(pagination): fixed pagination throwing errors when odd number of items in collection
```

```
feat(pagination): added new "first" and "last" events when pagination is moved to first or last page 
```

Because your first example is listed as a _type_ of `fix`, your tooling knows to only bump the patch release. However, in the second example, you have a _type_ of `feat`, which tells your tooling to bump your release version by a minor number.

Likewise, to tell your tooling that a commit introduces a breaking change, you'll do something along the lines of this:

```
refactor(pagination): consolidates "first" and "last" events into a "pageTo" event that includes the number in the event payload

BREAKING CHANGE: If you're using the `first` or `last` events in the paginator, you'll need to migrate your logic to use `pageTo` event and getting the page from the event payload (using `$event`). By doing so, you can add back conditional logic based on the number of page jumps 
```

The `BREAKING CHANGE:` at the start of your commit body tells your tooling that this should indicate a package bump of a MAJOR version, and will highlight this change at the top of your changelog as such.

## Commit Scope {#lerna-usage}

An immediate question that might be asked is "why would I put the scope of changes? How could this realistically help me?" One usecase where adding a commit scope is hugely advantageous is when using a monorepo for multiple packages in a single repo. When using [Lerna](https://github.com/lerna/lerna) to help manage a monorepo, there are even addons that enable [restricting your _scope_ to match one of the project's package names](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-lerna-scopes). By doing so, you're able to generate individual `CHANGELOG.md` files for each package, enabling your tooling to scope with your project's scale.

# Step 1: Commit Message Enforcement {#commit-lint}








# Conclusion



Keep in mind, simply because you have a new tool to manage releases doesn't mean that you have a free pass on ignoring your branching strategy. If you're developing a developer tool that has breaking  changes every week, you're certainly going to alienate anyone that's not a staunch consumer. You'll want to keep following best practices for your use-cases to make sure that this tool isn't squandered by other project issues.