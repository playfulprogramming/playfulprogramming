---
{
	title: "Building a CMS for Playful Programming",
	description: "",
	published: '1999-09-19',
	tags: [],
	license: 'cc-by-nc-sa-4',
	noindex: true
}
---

// TODO: Write

# Why build your own CMS?!

- Git-first (Git as source of truth)
- Markdown-first (no MDX or others)
- Custom components support
- Support non-approved authors
- Require approval before publishing

Here's a rough flow chart of the planned functionality:

```mermaid
flowchart TD
    CreatePost["User creates a draft post"] --> DB[("Database")]
    DB --> EditPost["User edits their post"] & PublishPost["User publishes their post"]
    EditPost --> WriteDB("Write to Database")
    WriteDB --> DB & SyncFork("Sync updates with the GitHub fork/branch")
    SyncFork --> HasFork{"Does the user have a fork yet?"}
    HasFork -- No --> CreateFork("Fork the unicorn-utterances repo with a branch matching the post slug")
    CreateFork --> PushFork("Merge changes and push")
    HasFork -- Yes --> PushFork
    ForkUpdated["User pushes manual changes to their fork"] -- "<span style=color:>GitHub sends a webhook event</span>" --> SyncFork
    LeftComments["Someone leaves a comment on a PR"] -- "<span style=color:>GitHub sends a webhook event</span>" --> SyncComments("Sync comments from any active pull requests")
    SyncComments --> DB
    PublishPost --> CreatePR("Create a pull request")

     CreatePost:::action
     EditPost:::action
     PublishPost:::action
     ForkUpdated:::action
     LeftComments:::action
    classDef action stroke-width:4px
    classDef dashed stroke-dasharray:5 5
```



We want the best of both worlds:

https://strapi.io/blog/git-based-vs-api-first-cms

# What other options have you explored?

From most in-depth researched to least researched:

## Decap CMS

In conversations we've been considering building the CMS entirely in-house, as https://decapcms.org/ doesn't completely satisfy this use case and there are a lot of custom-built behaviors for e.g. tabs/iframes and the remark/rehype plugins.

> https://github.com/playfulprogramming/playfulprogramming/compare/main...decap-cms

https://decapcms.org/docs/open-authoring/



- Custom components aren't using the same MD syntax as we'd like for portability

While it's clear that no solution is going to fit our bill 100%, maybe Decap would be a good base to fork from? It's [MIT](LINK TO THEIR REPO) after all.

Well, no.

All of their main components (GH interop, Local Git stuff, FE, et al) appear to be at least 2 years old

The FE is not the most modern (JS, not TS, Emotion, Redux **4**, et al)

And while the frontend seems sorta big (15K LOC at a SUPER rough glance), the BE comparitively doesn't:

- 4K for their GH interop
- 1.5K for other Git glue
- 2K for their local Git interop

## Tina CMS

https://tina.io/

**Pros**:

- Git-based
- Open-source
- Good auth provider selection
  - Useful for our needs of non-GitHub permitted users needing to authenticate

**Cons**:

- UI relies heavily on "see what you edit"; good for sites - not for blogs.
- Uses MDX for custom components
- Doesn't allow external authors
- Makes heavy usage of `isomorphic-git`, which has known issues with larger repos given lots of history
- No CRDT usage



Given how heavily we'd need to rework the frontend to match our blog-first needs, we'd probably start from scratch.

The primary part of the backend, despite having lots of good, is only about 9k LOC and doesn't include much of the infrastructure for features we'd want to add or even have for `v1`.

## Keystatic

**Pros**:

- Git-based
- MIT Licensed
- Support for both MDX and ???
- Incredibly up-to-date and polished codebase
- Good UI
  - Doesn't matter - we'd reskin it for our needs
- Immensely flexible data schema customization
- Pre-built Astro support

**Cons**:

- No backend
  - This makes the `fork our repo from our singleton CMS instance` is a no-go

https://keystatic.com/



## Keystone

**Pros**:

- MIT Licensed
- Amazing rich-text editor 
- Good UI
  - Doesn't matter - we'd reskin it for our needs
- Immensely flexible data schema customization

**Cons**:

- No Git backing
- No ability to save output to files instead of `db` tables/schema
- No support for non-approved authors

## Ghost CMS

**Pros**:

- MIT Licensed

**Cons**:

- Using [a very old version of Ember for most of its frontend](https://github.com/TryGhost/Ghost/issues/21692)
- Not Git-based
- No external user permissions



## Payload CMS

**Pros**:

- MIT Licensed

**Cons**:

- Not Git-based
- Permissions issues



## Strapi

**Cons**:

- [Questionable OSS license](https://github.com/strapi/strapi/blob/develop/LICENSE)
  - Changes license based on folder you're in, includes important parts of the codebase
- Not Git-based
- Permissions issues



# What are you building?

## `v1`

- Drafts (in git) are *indexed* in a db (postgres or mysql or whatever TBD)
- Either: 
  - Keep a CRDT in the db (with Redis cache?) for persistence
  - Store CRDT for active "editor sessions" in Redis -> commit to local git once closed?
- Intermittently push updates to an upstream github repository/fork
- Pulling updates to draft/edited posts from the repo back into currently-drafted posts
- Live in-CMS preview
- Creating a PR (from local git to GitHub) through GH sign-in

## `v2`

- Multi-user editing
- UI for feedback comments
- Editing existing posts by pulling them from the repo
- Offline support: https://docs.yjs.dev/ecosystem/database-provider/y-indexeddb
- Stored draft editor history: https://docs.yjs.dev/api/undo-manager

# Implementation Notes

// TODO: Move these to the GH repo

- Decided to explore https://docs.yjs.dev/ as a CRDT/merge implementation - https://github.com/y-crdt/y-crdt is its wasm/rust port vs. https://automerge.org/
- Using a CRDT only for active "editor sessions" and storing one copy (+ syncing to git) might be preferable? The use-cases where the *server* would need to interact with the CRDT itself would be minimal. In which case I believe it could be client-only?
- If a git update occurs in the upstream GitHub repo, it can simply overwrite the local draft - assuming it was previously up to date with the repo. (i.e. its revision history would be saved)
- If a git update occurs from upstream when an editor session is active, there could be a prompt on the client(similar interactions in vscode/intellij when the filesystem changes with an open editor)
- TBD: I still think that placing revisions in local git repos when on the CMS is unnecessary. These could be stored in a database (with revisions) and synced with the remote (github). This could take advantage of search indexing, reliability of database transactions, consolidated backups, etc.