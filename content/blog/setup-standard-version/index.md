---
{
	title: "Autogenerate Changelogs and Manage Releases using Conventional Commit",
	description: "Whether creating changelogs or just keeping track of git tags, releases matter. Learn how to automate your release process with conventional-commits!",
	published: '2020-06-23T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['npm', 'javascript'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

Writing changelogs for a project can be tedious. Usually, this lengthy process would start with your project manager, organizing your tickets in the sprint (depending on how your project is organized), and taking time out of the day to write the changelog itself. This process becomes even more complicated when working on developer-centric projects. Remembering what is and isn't a breaking change (to keep a sensible [SEMVER](https://www.geeksforgeeks.org/introduction-semantic-versioning/)), what technical changes were made, and what you should do to migrate to newer versions might be a challenge in itself, on top of the typical release patterns.

This versioning complexity birthed _a set of tools that allows you to generate changelogs automatically_. Now, this may sound too good to be true: "How can it generate something without any metadata?" Well, dear reader, that's the trick of it: You **do** provide the metadata in the form of commit messages.

If you _enforce a standardized set of commit messages_ (both header and body), then _a tool can automatically run through each commit_ since your last release _and generate the changelog_. Furthermore, because the commit message standards you'll follow outline when a new feature, bug fix, or breaking change is introduced, _this tooling can assume what portion of SEMVER (major, minor, or patch) to bump_. It can change the version numbers in your files as well!

# Step 0: Commit Rules {#conventional-commit}

Before we start setting up tooling (to generate the changelogs, commit message verification, and more), we need first to understand what the rules are that we're signing up for. As mentioned before, we'll need to standardize the way we write our commit messages for our tooling to work effectively. The standardized commit message template we'll be following in this article is called [Conventional Commits](https://www.conventionalcommits.org/). Conventional Commits generally follow an outline as such:

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

We had an error thrown as a result of a miscalculation when changing pages on an odd number of items in the collection. This test should ensure this bug doesn't regress
```

In this case, your _type_ is `test`, whereas your scope is `pagination`. This way, when you're generating your public changelog, it will likely not include this commit message, as your users don't often care about the implementation or tests within. While this isn't a great example, let's take the next two examples:

```
fix(pagination): fixed pagination throwing errors when an odd number of items in collection
```

```
feat(pagination): added new "first" and "last" events when pagination is moved to first or the last page 
```

Your tooling knows only to bump the patch release because your first example is listed as a _type_ of `fix`. However, in the second example, you have a _type_ of `feat` that tells your tooling to bump your release version by a minor number.

Likewise, to tell your tooling that a commit introduces a breaking change, you'll do something along the lines of this:

```
refactor(pagination): consolidates "first" and "last" events into a "pageTo" event that includes the number in the event payload

BREAKING CHANGE: If you're using the `first` or `last` events in the paginator, you'll need to migrate your logic to use `pageTo` event and getting the page from the event payload (using `$event`). By doing so, you can add back conditional logic based on the number of page jumps 
```

The `BREAKING CHANGE:` at the start of your commit body tells your tooling that this should indicate a package bump of a MAJOR version, and will highlight this change at the top of your changelog as such.

## Commit Scope {#lerna-usage}

An immediate question that might be asked is, "why would I put the scope of changes? How could this realistically help me?" One use-case where adding a commit scope is hugely advantageous is when using a monorepo for multiple packages in a single repo. When using [Lerna](https://github.com/lerna/lerna) to help manage a monorepo, there are even addons that enable [restricting your _scope_ to match one of the project's packages names](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-lerna-scopes). By doing so, you're able to generate individual `CHANGELOG.md` files for each package, enabling your tooling to scope with your project's scale.

# Step 1: Commit Message Enforcement {#commit-lint}

Any suitable set of tooling should have guide-rails that help you follow the rules you set for yourself (and your team). Like a linter helps keeps your codebase syntactically consistent, _Conventional Commit setups often have a linter setup of their own_. This linter isn't concerned about your code syntax, but rather your commit message syntax.

Just as you have many options regarding what linting ruleset you'd like to enforce on your codebase, you have a few options provided to you for your commit messages. You can utilize [the default linting rules out-of-the-box](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional), follow [the Angular Team's guidelines](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-angular), or even [utilize the format that Jira has set out](https://github.com/Gherciu/commitlint-jira).

Another similarity to their code syntax contemporaries is that your commit linter has [a myriad of configuration options available](https://commitlint.js.org/#/reference-rules?id=rules). These options allow you to overwrite the existing configuration you're utilizing or even create your configuration from scratch.

## Setup {#install-commit-lint}

While you can go as in-depth as creating your own configuration, let's assume that we want to stick with the out-of-box settings. Let's assume that you already have a `package.json` configured. First thing's first, let's install the dependencies we need:

```
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

The [`commitlint` CLI](https://commitlint.js.org/) is what will actually do the linting on the commit message while the `@commitlint/config-conventional` is the ruleset that the linter will follow. Now, we'll create the configuration file that will tell the CLI what rules to use. Create a file called `commitlint.config.js` at the root of your project and place the following code inside:

```javascript
module.exports = {extends: ['@commitlint/config-conventional']};
```

Now, you can test that your setup works properly by linting the last commit in your branch:

```
npx commitlint --from=HEAD~1
```

It should either validate or fail, depending on whether the last commit message followed the ruleset.

### Husky Setup {#husky}

While you _could_ set up a CI system with something like the `commitlint` command from above, it wouldn't be very effective at making sure you and your team remain vigilant with your commit schema. You're _able to enforce your commit messages directly from your development machine_ at the time of commit. To do so, we'll hookup git hooks to validate our commit messages before they finalize (and prevent a commit when they don't pass the linting rules). While there _are_ ways to do this manually, the easiest (and most sharable) method to do so using `package.json` is by installing a dependency called `husky`.

```
npm install --save-dev husky
```

By installing `husky`, we can now add the following to our `package.json` to tell git to run our `commitlint`:

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

## Test The Hook {#testing-husky}

Now that we have `husky` configured properly, we're able to ensure that the linting is working as expected. Now, if you run `git commit` it will give the following behavior pattern:

```
git commit -m "foo: this will fail"
husky > commit-msg (node v10.1.0)
No staged files match any of provided globs.
⧗   input: foo: this will fail
✖   type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test] [type-enum]

✖   found 1 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint

husky > commit-msg hook failed (add --no-verify to bypass)
```

# Step 2: Manage Your Releases {#standard-version}

While contiguous commit consistency is cool (what a mouthful), our end goal is to have easier management of our releases. To this end, we have the [`standard-version` ](https://github.com/conventional-changelog/standard-version). This tool allows you to generate git tags, changelogs, and bump your `package.json` files. To start, we'll install the package as a developer dependency:

```
npm i --save-dev standard-version
```

Afterward, we can add a `release` script in our `package.json`:

```json
{
  "scripts": {
    "release": "standard-version"
  }
}
```

Finally, `standard-version` needs to have a starting point to append the CHANGELOG and other versions to. Simply run:

```
npm run release -- --first-release
```

To generate your initial `CHANGELOG.md` file. This will also create a tag of the current state so that every subsequent release can change your version numbers.

## Usage {#use-standard-version}

Having an initial starting point for releases is cool but ultimately useless without understanding how to cut a new release. Once you've made a series of commits, you'll want to re-run `npm run release`. This will do all of the standard release actions. [As mentioned before, the `type` of commits will dictate what number (patch, minor, major) is bumped](#conventional-commits). As all of your changes will make it into your `CHANGELOG.md`, you may want to consider squashing PRs before merging them, so that your changelog is clean and reflective of your public changes (not just the implementation detail).

One thing to note is that you'll want to run `npm run release` _**before**_ running your build or release. This is because it bumps your package version, and as-such won't change the package version in your deployed updates.

## Changelog Customization {#customize-changelog}

From here, your `CHANGELOG.md` file should look like the following:

```markdown
# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.0.1-alpha.1 (2020-01-01)

Initial release
```

Let's say we introduce a new version that has a set of features and bug fixes:

```markdown
### [0.0.2](https://github.com/unicorn-utterances/batteries-not-included/compare/v0.0.1...v0.0.2) (2020-02-25)

### Features

* added overflow property to keyboard handler ([3f85fdc](https://github.com/unicorn-utterances/batteries-not-included/commit/3f85fdcc9ff2bf2e765585c500b0d2f3421c92dc))
* added wrap number util ([762f1cd](https://github.com/unicorn-utterances/batteries-not-included/commit/762f1cd5ff60274b221eccf6da829b72fac97d7b))

### Bug Fixes

* parameter in name in doc in wrap-number.ts ([249b63b](https://github.com/unicorn-utterances/batteries-not-included/commit/249b63bebe1816655dd64cc1acf7f57875b0613e))
* updated overflow to work on keyboard handler ([eb50de0](https://github.com/unicorn-utterances/batteries-not-included/commit/eb50de0c401d98f84a5c9628c6d34c6cef311eb1))
```

You might think "Well, this file is auto-generated. I shouldn't modify it, least it stop working!" Luckily for us, this is not the case! So long as we leave the headers as-is, we're able to customize the `CHANGELOG.md` file with further details. _We can even include images_ using the standard markdown `![]()` syntax! Using this knowledge, we can create extremely robust and explanative changelogs for our consumers.

## Bump Version Files {#bump-package-json}

While working in a monorepo, I often find myself needing to change the version number in more than a single file at a time. I've also found myself in need of multi-file version bumping when using a different `package.json` for release than the one I use for development.

Regardless of the reason behind needing to change multiple files' package number, `standard-version`'s got you covered!

You'll want to create a `.versionrc` file and put the following in it:

```json
{
  "bumpFiles": [
    {
      "filename": "MY_VERSION_TRACKER.txt",
      // The `plain-text` updater assumes the file contents represents the version.
      "type": "plain-text"
    },
    {
      "filename": "a/deep/package/dot/json/file/package.json",
      // The `json` updater assumes the version is available under a `version` key in the provided JSON document.
      "type": "json"
    },
    {
      "filename": "package.json",
      "type": "json"
    },
  ]
}
```

Multiple different kinds of files that can be updated, and you can even [write your own `updater` method to update any file you'd so like](https://github.com/conventional-changelog/standard-version#custom-updaters).

# Conclusion {#conclusion}

Keep in mind, simply because you have a new tool to manage releases doesn't mean that you have a free pass on ignoring your branching strategy. If you're developing a developer tool that has breaking  changes every week, you're certainly going to alienate anyone that's not a staunch consumer. You'll want to keep following best practices for your use-cases to ensure that this tool isn't squandered by other project issues.

While the outline we've provided should suffice for most usage, each of these tools includes many options that you're able to utilize customize the process to your liking.

Find options you think we should cover in this article? Have questions about how to get `conventional-commit` and `standard-version` working? Let us know! We've got a comments section down below as well as [a Discord Community](https://discord.gg/FMcvc6T) that we use to chat.
