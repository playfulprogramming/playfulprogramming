---
{
title: "Building an RSS Scully Plugin - Angular",
published: "2021-06-17T07:06:05Z",
tags: ["angular", "webdev", "javascript", "typescript"],
description: "In this article, we will learn how to extend Scully functionality through plugins. We will do this by...",
originalLink: "https://mainawycliffe.dev/blog/building-scully-rss-plugin-angular",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

In this article, we will learn how to extend Scully functionality through plugins. We will do this by building an RSS Plugin. This plugin will generate an RSS feed for our blog web app build using Angular and Scully.

For an RSS plugin, we will build a **routeDiscoveryDone** plugin, which is usually called when all routes have been discovered. This is going to use data discovered during the route discovery process to create an RSS feed. The route discovery process is done by a **router** plugin, which you can learn more about [here](https://scully.io/docs/Reference/plugins/types/router/).

Scully provides 9 types of plugins which are called at during different stages of Scully build. For more information about different types of plugins, please visit the official documentation [here](https://scully.io/docs/Reference/plugins/overview/).

## Prerequisites

* Setup Scully for Your Angular Project - [Link](https://scully.io/docs/learn/getting-started/overview/).

## Building the Plugin

### Getting Started

If you used schematics to setup your Scully for your Angular project, you should be able to spot a Scully directory at the root of the workspace. This directory contains a `tsconfig` file for Scully plugins and a plugins directory, which is where our plugin will live.

Inside the plugins directory - `scully/plugins` - we will create a new file named `rss.ts`, which is going to contain the source code for our plugin. 

### Plugin Code

To create our RSS feed, we will use the NPM package [Feed](https://github.com/jpmonette/feed), which make it easy to generate syndicated feed using Typescript.

Our RSS plugin will be called when Scully discovers all routes and it will receive a list of routes and route data associated with each route discovered.

```typescript 
const createRSSFeed = async (routes: HandledRoute[]) => {
  // code here
}
```

We will start by creating a new instance of `Feed`. 

First, we need to import `Feed`.

```typescript 
import { Feed } from 'feed';
```

Then instantiate `Feed`.

```typescript 
const feed = new Feed({
  title: 'John Doe Blog',
  language: 'en-us',
  author: {
    email: 'johndoe@example.com',
    name: 'John Doe',
  },
  description: 'about you website or blog',
  id: 'https://example.com',
  link: 'https://example.com/blog',
  favicon: 'https://example.com/favicon.png',
  copyright: "John Doe Copyright"
});
```

> NB: Update the content above according to your own specification.

Next, we will loop over the routes, and add an RSS Feed item for each.

```typescript 
routes.forEach((route) => {
	// add each item to an RSS Feed Article  
})
```

Then, for each route, we want to add an RSS item, and use the route data - `route.data.*` to fill in the different properties like `title`, `date`, `content`, etc.

```typescript 
routes.forEach((route) => {
  feed.addItem({
    title: route.data.title,
    date: new Date(route.data.publishedAt),
    link: route.data.link,
    // loop through the names of the authors if list
    author: [
      {
        email: route.data.author.email,
        name: route.data.author.email,
      },
    ],
    // uses tags as categories
    category: route.data?.tags?.map((t: Tag) => ({
      name: t.name,
    })),
    content: route.data.html,
    id: route.data.id,
    image: route.data.featured_image,
    published: new Date(route.data.publishedAt),
  });
})
```

> **NB:** update the different properties of each item according to the structure of your data. For markdown content, this are the keys in the [Front Matter](https://jekyllrb.com/docs/front-matter/).

Finally, we will save our RSS feed as an XML file inside the output directory of Scully. We can use `fs-extra` to do that, so we will start by installing the package.

**Yarn:**

```sh
yarn add --dev fs-extra
```

**NPM:**

```sh
npm i -D fs-extra
```

Then, we will import `outputFileSync` from `fs-extra`.

```typescript 
import { outputFileSync } from 'fs-extra';
```

Finally, we will save the RSS feed.

```typescript 
// the output directory of your scully builds artefacts
const outDir = './dist/static';

outputFileSync(join(outDir, 'blog', `feed.xml`), feed.rss2());
```

On top of that, we can also generate both JSON and Atom files:

```typescript 
outputFileSync(join(outDir, 'blog', `feed.atom`), feed.atom1());
outputFileSync(join(outDir, 'blog', `feed.json`), feed.json1());
```

That's it for the plugin, here is what the plugin function looks like.

```typescript 
const createRSSFeed = async (routes: HandledRoute[]) => {
  log(`Generating RSS Feed for Blog`);

   const feed = new Feed({
    title: 'John Doe Blog',
    language: 'en-us',
    author: {
      email: 'johndoe@example.com',
      name: 'John Doe',
    },
    description: 'about you website or blog',
    id: 'https://example.com',
    link: 'https://example.com/blog',
    favicon: 'https://example.com/favicon.png',
    copyright: "John Doe Copyright"
  });

  routes.forEach((route) => {
    feed.addItem({
      title: route.data.title,
      date: new Date(route.data.publishedAt),
      link: route.data.link,
      // loop through the names of the authors if list
      author: [
        {
          email: route.data.author.email,
          name: route.data.author.email,
        },
      ],
      // uses tags as categories
      category: route.data?.tags?.map((t: Tag) => ({
        name: t.name,
      })),
      content: route.data.html,
      id: route.data.id,
      image: route.data.featured_image,
      published: new Date(route.data.publishedAt),
    });
  })

  try {
    const outDir = './dist/static';
    outputFileSync(join(outDir, 'blog', `feed.xml`), feed.rss2());
    log(`✅ Created ${yellow(`${outDir}/blog/feed.xml`)}`);
    outputFileSync(join(outDir, 'blog', `feed.atom`), feed.atom1());
    log(`✅ Created ${yellow(`${outDir}/blog/feed.atom`)}`);
    outputFileSync(join(outDir, 'blog', `feed.json`), feed.json1());
    log(`✅ Created ${yellow(`${outDir}/blog/feed.json`)}`);
  } catch (error) {
    logError('❌ Failed to create RSS feed. Error:', error);
    throw error;
  }
};
```

> NB: `log` and `logError` are helper functions from Scully, imported from `@scullyio/scully`.

### Registering the Plugin

Next, we will give our plugin a name. First, we will declare and export a variable for the name of the plugin. 

```typescript 
export const BlogRSSFeed = Symbol('BlogRSSFeed');
```

> This variable can be imported in to the Scully config file to use the plugin.

Then, we will register our Scully plugin as a `routeDiscoveryDone` plugin.

```typescript 
registerPlugin('routeDiscoveryDone', BlogRSSFeed, createRSSFeed);
```

### Using the Plugin

Finally, we can use the RSS plugin by adding to the array of `postRederrers`. This can be achieved using two approaches. The first one will be for all routes within our our application:

```typescript 
export const config: ScullyConfig = {
  projectRoot: './src',
  projectName: 'project-name',
  outDir: './dist/website',
  defaultPostRenderers: [BlogRSSFeed], // for all routes
  routes: {
    '/blog/:slug': {
     	// ...
    },
  },
};
```

While the second one can be specified for a specific route i.e. blog. This is useful when you only want to generate an RSS feed for a single section of your site like the blog section.

```typescript 
export const config: ScullyConfig = {
  // ...
  routes: {
    '/blog/:slug': {
      postRenderers: [BlogRSSFeed],
      // ...
    },
  },
};
```

## Conclusion

In this article, we learnt how to create a Scully plugin to generate RSS feeds for our Angular app. We have created a `routeDiscoveryDone` plugin that's called after routes for our application have been discovered and uses the route data to generate RSS feed for each of our route.

### Resources

* Speeding Up Angular Scully Builds in GitHub Actions - [Link](https://mainawycliffe.dev/blog/speeding-angular-scully-builds-github-actions).
* Angular CDK - Platform Module - [Link](https://mainawycliffe.dev/blog/angular-cdk-platform-module).
* Scully Documents - [Link](https://scully.io/docs/learn/getting-started/overview/).