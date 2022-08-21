As a site and community alike, we have a myriad of ways to contribute to the site and the community at large. Below is the Table of Contents for this `CONTRIBUTING.md` file, but if you get stuck or want to ask questions, feel free to [open an issue on GitHub](https://github.com/unicorn-utterances/unicorn-utterances/issues/new) or [reach out to us on our Discord](https://discord.gg/FMcvc6T).

- [Blog Posts](#Blog-Posts)
  - [Adding a New Post](#Adding-a-New-Blog-Post)
    - [Author Data](#Author-Data-File)
    - [Markdown Post](#Markdown-Post)
  - [Editing a Blog Post](#Editing-a-Blog-Post)
  - [Translating a Blog Post](#Translating-a-Blog-Post)
    - [Finding a Language Code](#Finding-a-Language-Code)
    - [Creating the Translated Post](#Creating-the-Translated-Post)
- [Code Contributions](#Code)

# Blog Posts

## Adding a New Blog Post

To credit you for your new post, we'll start by adding you to the list of authors for the site.

### Author Data File

The author data file is located at [`content/data/unicorns.json`](./content/data/unicorns.json) 🦄

> This section assumes you'd like to contribute directly through GitHub. If you'd rather contribute an article without using Git, [reach out to us on our Discord](https://discord.gg/FMcvc6T), and we'll work with you to introduce your (attributed) content.

To add yourself as an author in a PR for a new post, you'd add your information
as a new JSON object in the array.

This information includes:

- A username for your profile (used in your profile URL).
  \[IE, our founder's username is `crutchcorn`, and [their page can be found here](https://unicorn-utterances.com/unicorns/crutchcorn)]

- Full name

  - A separate field for the first name and last name as well

    (this is because SEO meta tags force us to use first names and last names)

  - If you wish to go by an alias, nickname, or any other appropriate identifier, that is absolutely permitted.

- A short description of yourself

  - If you need to have a line break, simply add in `\n` and the code will handle it for you
  - We ask that your description is less than 140 characters long

- Your social media metadata. We currently support the following:

  - Twitter
    - Please leave your username without a `@` preceding it
  - GitHub
    - Please leave your username, not the full GitHub profile link
  - A personal website
    - Do leave the full URI of your website, including `http` or `https`
  - We [have an issue on supporting arbitrary profile links](https://github.com/unicorn-utterances/unicorn-utterances/issues/23). If you'd like to add other social media options, open an issue or a PR and we'll take a look at it
  - You may also leave these fields blank and simply provide an empty object as an alternative. Don't feel forced to leave any social media if you'd rather not

- Your preferred pronouns

  - Please keep [our Code of Conduct](./CODE_OF_CONDUCT.md)  in mind. We do not accept bigotry of _**any kind**_.
  - This value must match [one of the  `id` fields of our `pronouns.json` file](./content/data/pronouns.json)
    - If your preferred pronouns are not present, simply add a new value inside of said JSON file

- A profile picture, used on your profile page.

  - This profile picture should be a path to a PNG or a JPEG file with the resolution of at least `512x512` that's saved inside of `./content/data`
  - Don't want to show your real picture on the site? That's alright! We have a [myriad of custom unicorn emotes that can be used as profile pictures as well](https://github.com/unicorn-utterances/design-assets/tree/master/emotes). They're adorable, go check! 🤩

> While this feels like a lot of metadata, keep in mind that all of this is optional or can provide defaults that don't identify you. Please never feel pressured to provide more information than you're comfortable with!

### Markdown Post

Now that we have your user attribution data, we can move onto the post data itself. We store all blog posts under a format called ["Markdown."](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) This format is a plaintext file with some special syntax for formatting improvements. I recommend using [an app like Typora](http://typora.io/), which allows you to edit markdown files similarly to a Word document. If you're coming from Google Drive, [there's an open-source script](https://github.com/lmmx/gdocs2md-html) that may help you convert your documents to Markdown.

#### Save Location

Once you have your `.md` file, we'll need a place to put it. We place a subdirectory in our [`content/blog` folder](./content/blog) for each of the blog posts on the site. The naming of these subdirectories is integral to keep in mind, as they reflect the URL path of the article once finished. For example, the folder [`what-is-ssr-and-ssg`](./content/blog/what-is-ssr-and-ssg) will turn into the URL for the article:
<https://unicorn-utterances.com/posts/what-is-ssr-and-ssg/>

Once you've created a subfolder with the URI you'd like your article to have, move the `.md` file into the folder with the name `index.md`. If you have linked images or videos, you'll need to save those files in the same folder and change your markdown file to reference them locally:

An example of referencing a video locally is:

```markdown
<video src="./ios_vs_android.mp4" title="A comparison of how text spacing is applied on iOS and Android"></video>
```

Where you include the title of the video and the video.

##### File Naming

We expect images and videos to be fully lowercase with underscores ([often called `snake_case`](https://en.wikipedia.org/wiki/Snake_case))  for various build reasons. We've often had build issues when files contain uppercase or dashes in the file name.

##### Static File Linking

There may be instances where you want an image or arbitrary file to be linked within your article. Say you've made a PowerPoint presentation that you'd like to link inside of the article. To do this, create a subfolder with the same name as the URI of the blog post user [`static/posts`](./static/posts). You're then able to reference your files inside of the markdown file:

```markdown
[styles.xml](./styles.xml)
```

#### Frontmatter

Now that we've placed the file in the correct location, we need to add metadata about the blog post itself. We do this inside of the `index.md` file itself using what's called a "Frontmatter." An example frontmatter looks something like this:

```markdown
---
{
    title: 'Hard grids & baselines: How I achieved 1:1 fidelity on Android',
    description: 'Testing the limits of `firstBaselineToTopHeight` and `lastBaselineToBottomHeight` to deliver a perfect result.',
    published: '2019-10-07T22:07:09.945Z',
    edited: '2020-02-02T22:07:09.945Z',
    authors: ['edpratti'],
    tags: ['android', 'design'],
    attached: [],
    license: 'cc-by-nc-nd-4'
}
---
```

The following data **must** be present:

- Title for the article
  - We ask that your titles are less than 80 characters.

- A description of the article
  - We ask that your descriptions are less than 190 characters.

- A published date
  - Please follow the format as seen above

- An array of authors
  - This array must have every value match [one of the `id`s of the `unicorns.json` file](./content/data/unicorns.json)

- An array of related tags
  - Please try to use existing tags if possible. If you don't find any, that's alright
  - We ask that you keep it to 4 tags maximum

- A `license` to be associated with the post
  - This must match the `id` field for one of the values [in our `license.json` file](./content/data/licenses.json)
  - If you're not familiar with what these licenses mean, view the `explainLink` for each of them in the `license.json` file. It'll help you understand what permissions the public has to the post
    - For example, can they modify the article and re-release it or not?

## Editing a Blog Post

Our blog posts can all be found under [`/content/blog`](./content/blog). Simply find the article based on the URL path and edit the `index.md` file. We'll have one of our editors review the post changes, and we'll try to reach out to the author for them to review your PR as well.

## Translating a Blog Post

If you are adding a translation, make sure to create an [Author Data File](#author-data-file) with the `"translator"` role so that you are credited for your work on the site!

### Finding a Language Code

For any language to be translated, it must have a name and identifier defined in the [`/content/data/languages.json`](./content/data/languages.json) file. If the language is already defined there, simply use its identifier in the following sections; if not, we will need to add it to the file.

Each language code should consist of two lowercase letters. If it includes a region, append a hyphen followed by two more lowercase letters. For example, the code for French is `fr` - to specifically refer to the French dialect in Canada, the code would be `fr-ca`.

> Please use `-` instead of `_` in the language region ISO formats. Instead of `fr_ca`, it'd be `fr-ca`.

Refer to [Wikipedia: List of ISO 639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for identifiers to be used in this format.

### Creating the Translated Post

Each blog post on the site has a subdirectory inside the [`content/blog` folder](./content/blog). In this folder, the post should have an `index.md` file with its current contents.

To create a translation file for this post, copy the `index.md` file and rename it to include the new language identifier as `index.(lang).md`. For example, a translation for `fr` would be named `index.fr.md`. The content inside this file can then be translated into the respective language.

#### Translating Post Images / Assets

If any images used in the post need to be translated, these should be named in a similar fashion - for example, a translation of `dom_tree.svg` should be named `dom_tree.fr.svg`. Any links to these images will need to be updated in the `index.fr.md` post to point to the translated image.

# Code

While we have a lot of code that is not yet this way, we try our best to build our code for the site in such a way that it's generic enough to be useful for others. For example, some of our UI components have led to the creation of [our sister NPM library `batteries-not-included`](https://github.com/unicorn-utterances/batteries-not-included). We now directly consume said library for our own components. We've also found ourselves requiring a custom markdown processing utility [in the form of `unist-util-flat-filter`](https://github.com/unicorn-utterances/unist-util-flat-filter).

Keep in mind that we request developers reach out [via our Discord](https://discord.gg/FMcvc6T) or [via GitHub issue](https://github.com/unicorn-utterances/unicorn-utterances/issues/new) before extensive development is pursued. If you have a feature you'd like to add to the site, let us know! We'd love to do some brainstorming before coding begins!

We're using a small set of internal forks of deps for the following reasons:

- [rehype-slug](https://github.com/rehypejs/rehype-slug/issues/10)
- [rehype-img-size](https://github.com/ksoichiro/rehype-img-size/issues/4)

## Develop Mode

To start the development server, run `npm run develop`, it will then start the local instance at `http://localhost:8000`. You also can check out the GraphiQL tool at `http://localhost:8000/___graphql`. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql).

## Debugging Plugins

We have a few local plugins for Gatsby. However, I've found that while debugging these plugins, Gatsby's cache can often get in the way. If you run `npm run debug`, it will create a debuggable ([using Chrome](https://unicorn-utterances.com/posts/debugging-nodejs-programs-using-chrome/)) instance of the Gatsby develop mode and clear the cache of Gatsby. This script will ensure that your debugger provides proper insight into what's happening in the build process.
