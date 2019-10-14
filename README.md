<p align="center">
    <img alt="Unicorn Utterances logo" src="./content/assets/unicorn-utterances-logo-512.png"/>
</p>
<h1 align="center">
  Unicorn Utterances Website
</h1>
<div align="center">

[![Join chat on Discord](https://badgen.net/badge/discord/join%20chat/7289DA?icon=discord)](https://discord.gg/FMcvc6T)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

Master branch status: [![Master Branch Build Status](https://travis-ci.org/unicorn-utterances/unicorn-utterances.svg?branch=master)](https://travis-ci.org/unicorn-utterances/unicorn-utterances)

Integration branch status: [![Integration Branch Build Status](https://travis-ci.org/unicorn-utterances/unicorn-utterances.svg?branch=integration)](https://travis-ci.org/unicorn-utterances/unicorn-utterances)

</div>

This repository acts as the source code location for [the Unicorn Utterances blog](https://unicorn-utterances.com)

## Sponsors

[![The Polyglot Developer](./static/sponsors/the-polyglot-developer.svg)](https://www.thepolyglotdeveloper.com/)

## Statement of Ethics

We never want to end up in a place where our educational content or the community or
experience around that content is compromised. Not by money and not by any potential
of harmful members within said community. As a result,
[we've implemented the Contributor Covenant as our code of conduct](CODE_OF_CONDUCT.md).

We also pledge to keep transparent communication in regards to finances
that flow through the project. While not every sponsorship contains a
financial contribution, if one does it will be disclosed both what those
finances are going towards as well as what will be done in exchange for
said contribution will be clearly and transparently laid out.

## Important Repo Files

### Blog Posts

Should be located under [`content/blog/post-name-here`](./content/blog/).
You should then have an `index.md` file containing a frontmatter (with JS
header, not YAML) portion and any related files should be in the same folder.

### Author Data File
The author data file is located at [`src/data/unicorns.json`](./src/data/unicorns.json) 🦄

To add yourself as an author in a PR for a new post, you'd add your information
as a new JSON object in the array, then add a profile picture to the `data`
folder. The `pronouns` field should match an `id` in the `pronouns.json` (if
yours is not listed, please add it as a new value in that file, we've tried to
do our best to include everything we've found!)

> If you do not want to show a profile picture or commit your picture to
the repo, we have a [myriad of emotes that can be used as profile pictures as well](./content/assets/branding/emotes).
They're adorable, go check! 🤩

## 🚀 Develop

To start the develop server, run `npm run develop`, it will then start
the local instance at `http://localhost:8000`. You also have the ability to
checkout the GraphiQL tool at `http://localhost:8000/___graphql`. This is a
 tool you can use to experiment with querying your data. Learn more about
 using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql).

## Git Strategy

We loosely follow [the Gitflow branching strategy](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
where our development branch is called `integration` and our mainline branch is called `master`.

This means that any new pull requests should be made against `integration`
unless it is an emergency hotfix (to be approved by the devops team).

We also have the `master` branch which is a live reflection of the code
hosted on the server. Any time `integration` is pulled into `master`, the
site will be deployed. A PR from `integration` to `master` should only be
opened by a Unicorn Utterances team member and must be approved by at
least one devops member
