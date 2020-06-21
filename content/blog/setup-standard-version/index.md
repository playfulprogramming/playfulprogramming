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

Any good set of tooling should have guide-rails that help you follow the rules you set for yourself (and your team). Like a linter helps keeps your codebase syntactically consistent, Conventional Commit setups often have a linter setup of their own. This linter isn't concerned about your code syntax, but rather your commit message syntax. 

Just as you have many options when it comes to what linting ruleset you'd like to enforce on your codebase, you have a few options provided to you for your commit messages. You can utilize [the default linting rules out-of-the-box](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional), follow [the guide of the Angular Team](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-angular), or even [utilize the format that Jira has set out](https://github.com/Gherciu/commitlint-jira).

Another similarity to their code syntax contemporaries is that your commit linter has [a myriad of configuration options available to it](https://commitlint.js.org/#/reference-rules?id=rules). These options allow you to overwrite the existing configuration you're utilizing or even create your own configuration from scratch.

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

It should either validate or fail, depending on if the last commit message followed the ruleset or not.

### Husky Setup {#husky}

While you _could_ setup a CI system with something like the `commitlint` command from above, it wouldn't be super effective for making sure you and your team remain vigilant with your commit schema. You're actually able to enforce your commit messages directly from your development machine at the time of commit. To do so, we'll hookup git hooks to validate our commit messages before they finalize (and prevent a commit when they don't pass the linting rules). While there _are_ ways to do this manually, the easiest (and most sharable) method to do so using `package.json` is by installing a dependency called `husky`.

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

Now that we have `husky` configured properly, we're able to ensure that the linting is working as-expected. Now, if you run `git commit` it will give the following behavior pattern:

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

# Conclusion



Keep in mind, simply because you have a new tool to manage releases doesn't mean that you have a free pass on ignoring your branching strategy. If you're developing a developer tool that has breaking  changes every week, you're certainly going to alienate anyone that's not a staunch consumer. You'll want to keep following best practices for your use-cases to make sure that this tool isn't squandered by other project issues.