<p align="center">
    <img alt="Unicorn Utterances logo" src="./content/assets/unicorn-utterances-logo-512.png"/>
</p>
<h1 align="center">
  Unicorn Utterances Website
</h1>
<div align="center">

[![Join chat on Discord](https://badgen.net/badge/discord/join%20chat/7289DA?icon=discord)](https://discord.gg/FMcvc6T)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v1.4%20adopted-ff69b4.svg)](CODE-OF-CONDUCT.md)

</div>

This repository acts as the source code location for the Unicorn Utterances blog found [here](https://unicorn-utterances.com)

## Important Files

### Blog Posts

Should be located under [`content/blog/post-name-here`](./content/blog/). You should then have an `index.md` file containing a frontmatter (with JS header, not YAML) portion and any related files should be in the same folder.

### Author Data File
The author data file is located at [`src/data/authors.json`](./src/data/unicorns.json). To add yourself as an author in a PR for a new post, you'd add your information as a new JSON object in the array, then add a profile picture to the `data` folder. The `pronouns` field should match an `id` in the `pronouns.json` (if yours is not listed, please add it as a new value in that file, we've tried to do our best to include everything we've found!)



## 🚀 Develop

To start the develop server, run `npm run develop`, it will then start the local instance at `http://localhost:8000`. You also have the ability to checkout the GraphiQL tool at `http://localhost:8000/___graphql`. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql).
