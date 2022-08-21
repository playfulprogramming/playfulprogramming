---
{
	title: "Building an Angular Blog With Scully",
	description: "NuxtJS and Gatsby allow you to make SSG-enabled blogs, but Angular doesn't have an equivalent... Until now. Let's build a blog with Scully!",
	published: '2020-03-17T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['angular', 'ssg', 'scully'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

If you've ever used something like [Gatsby](https://www.gatsbyjs.org/) or [NuxtJS](https://nuxtjs.org/), you may already be familiar with Static Site Generation (SSG). If not, here's a quick rundown: You're able to export a React application to simple HTML and CSS during a build-step. This export means that (in some cases), you can disable JavaScript and still navigate your website as if you'd had it enabled. It also often means much faster time-to-interactive times, as you no longer have to run your JavaScript to render your HTML and CSS.

For a long time, React and Vue have had all of the SSG fun... Until now.

Recently, a group of extremely knowledgeable developers has created [Scully, a static site generator for Angular projects](https://github.com/scullyio/scully). If you prefer Angular for your stack, you too can join in the fun! You can even trivially migrate existing Angular projects to use Scully!

In this article, we'll outline how to set up a new blog post site using Scully. If you have an existing blog site that you'd like to migrate to use Scully, the blog post should help you understand some of the steps you'll need to take as well.

Without further ado, let's jump in, shall we?

# Initial Setup {#initial-setup}

First, we have some requirements:

- Node 12
- Angular CLI installed globally

You're able to do this using `npm i -g @angular/cli`. You'll want to make sure you're using the latest version if you already have it pre-installed.

Now that we have that covered let's generate our project!

```
ng new my-scully-blog
```

We'll want to choose `y` when it asks us to add routing. The second question that will be raised is regarding what flavor of CSS you'd like. I like `SCSS`, so I chose that, but you're free to select any of the options that you deem fit for your blog.

If we pause here and run `ng serve`, we'll find ourselves greeted with the default generated app screen from the Angular core team upon visiting the `localhost:4200` URI in our browser.

The file that this code lives under is the `app.component.html` file. We'll be modifying that code later on, as we don't want that UI to display on our blog site.

## Adding Scully {#adding-scully}

After that, open the `my-scully-blog` directory and run the following command to install and add Scully to the project:

```
ng add @scullyio/init
```

This will yield us some changed files. You'll see a new `scully.my-scully-blog.config.js` file that will help us configure Scully. You'll also notice that your `package.json` file has been updated to include two new commands:

```
"scully": "scully",
"scully:serve": "scully serve"
```

Here's where the "SSG" portion of Scully comes into play. You see, once you run `ng build` to build your application, you should be running `npm run scully` to run the static generation. That way, it will generate the HTML and CSS that your Angular code will generate on the client ahead-of-time. This means that you have one more build step, but it can be incredibly beneficial for your site's speed and usability.

We'll need to run the `npm run scully` command later on, but for now, let's focus on adding Markdown support to our blog:

# Adding Markdown Support

While Scully [_does_ have a generator to add in blog support](https://github.com/scullyio/scully/blob/master/docs/blog.md), we're going to add it in manually. Not only will this force us to understand our actions a bit more to familiarize ourselves with how Scully works, but it means this article is not reliant on the whims of a changing generator.

> This isn't a stab at Scully by any means, if anything I mean it as a compliment. The team consistently improves Scully and I had some suggestions for the blog generator at the time of writing. While I'm unsure of these suggestions making it into future versions, it'd sure stink to throw away an article if they were implemented.

## Angular Routes {#angular-blog-routes}

Before we get into adding in the Scully configs, let's first set up the page that we'll want our blog to show up within. We want a `/blog` sub route, allowing us to have a `/blog` for the list of all posts and a `/blog/:postId` for the individual posts.

We'll start by generating the `blog` module that will hold our routes and components.

```
ng g module blog --route=blog --routing=true --module=App
```

This will create a route called `blog` and generate or modify the following files:

```
CREATE src/app/blog/blog-routing.module.ts (341 bytes)
CREATE src/app/blog/blog.module.ts (344 bytes)
CREATE src/app/blog/blog.component.scss (0 bytes)
CREATE src/app/blog/blog.component.html (21 bytes)
CREATE src/app/blog/blog.component.spec.ts (622 bytes)
CREATE src/app/blog/blog.component.ts (275 bytes)
UPDATE src/app/app-routing.module.ts (433 bytes)
```

If you look under your `app-routing.module.ts` file, you'll see that we have a new route defined:

```typescript
const routes: Routes = [
  {
    path: "blog",
    loadChildren: () =>
      import("./blog/blog.module").then(m => m.BlogModule)
  }
]
```

This imports the `blog.module` file to use the further children routes defined there. If we now start serving the site and go to `localhost:4200/blog`, we should see the message "blog works!" at the bottom of the page.

### Routing Fixes {#router-outlet}

That said, you'll still be seeing the rest of the page. That's far from ideal, so let's remove the additional code in `app.component.html` to be only the following:

```html
<router-outlet></router-outlet>
```

Now, on the `/blog` route, we should _only_ see the "blog works" message!

However, if you go to `localhost:4200/`, you'll see nothing there. Let's add a new component to fix that.

```
ng g component homepage -m App
```

This will create a new `homepage` component under `src/app/homepage`. It's only got a basic HTML file with `homepage works!` present, but it'll suffice for now. Now we just need to update the `app-routing.module.ts` file to tell it that we want this to be our new home route:

```typescript
import { HomepageComponent } from "./homepage/homepage.component";

const routes: Routes = [
  {
    path: "blog",
    loadChildren: () =>
      import("./blog/blog.module").then(m => m.BlogModule)
  },
  {
    path: "",
    component: HomepageComponent
  }
];
```

Now, we have both `/blog` and `/` working as-expected!

### Adding Blog Post Route {#blog-post-route}

Just as we added a new route to the existing `/` route, we're going to do the same thing now, but with `/blog` paths. Let's add a `blog-post` route to match an ID passed to `blog`. While we won't hookup any logic to grab the blog post by ID yet, it'll help to have that route configured.

```
ng g component blog/blog-post -m blog
```

Then, we'll need to add that path to the blog list:

```typescript
const routes: Routes = [
  { path: ":postId", component: BlogPostComponent },
  { path: "", component: BlogComponent }
];
```

That's it! Now, if you go to `localhost:4200/blog`, you should see the `blog works!` message and on the `/blog/asdf` route, you should see `blog-post works!`. With this, we should be able to move onto the next steps!

## The Markdown Files {#frontmatter}

To start, let's create a new folder at the root of your project called `blog`. It's in this root folder that we'll add our markdown files that our blog posts will live in. Let's create a new markdown file under `/blog/test-post.md`.

```markdown
---
title: Test post
description: This is a post description
publish: true
---

# Hello, World

How are you doing?
```

> Keep in mind that the file name will be the URL for the blog post later on. In this case, the URL for this post will be `/blog/test-post`.

The top of the file `---` block is called the "frontmatter"\_. You're able to put metadata in this block with a key/value pair. We're then able to use that metadata in the Angular code to generate specific UI based on this information in the markdown file. Knowing that we can store arbitrary metadata in this frontmatter allows us to expand the current frontmatter with some useful information:

```markdown
---
title: Test post
description: This is a post description
publish: true
authorName: Corbin Crutchley
authorTwitter: crutchcorn
---
```

It's worth mentioning that the `publish` property has some built-in functionality with Scully that we'll see later on. We'll likely want to leave that field in and keep it `true` for now.

## Scully Routes {#scully-blog-route-config}

Now we'll tell Scully to generate one route for each markdown file inside of our `blog` folder. As such, we'll update our `scully.my-scully-blog.config.js` file to generate a new `/blog/:postId` route for each of the markdown files:

```javascript
exports.config = {
  // This was generated by the `ng add @scullyio/init`
  projectRoot: "./src",
  projectName: "my-scully-blog",
  outDir: './dist/static',
	// This is new
  routes: {
    '/blog/:postId': {
      type: 'contentFolder',
      postId: {
        folder: "./blog"
      }
    },
  }
};
```

Before we start the build process and run Scully, let's add one more change to our `blog-post.component.html` file:

```html
<h1>My Blog Post</h1>
<hr>
<!-- This is where Scully will inject the static HTML -->
<scully-content></scully-content>
<hr>
<h2>End of content</h2>
```

Adding in the `scully-content` tags will allow Scully to inject the HTML that's generated from the related Markdown post into that tag location. To register this component in Angular, we also need to update our `blog.module.ts` file to add an import:

```typescript
import {ScullyLibModule} from '@scullyio/ng-lib';

@NgModule({
  declarations: [BlogComponent, BlogPostComponent],
  imports: [CommonModule, BlogRoutingModule, ScullyLibModule]
})
export class BlogModule {}
```

You'll notice that if you run `ng serve` at this stage and try to access `localhost:4200/blog/test-post`, you'll see... Not the blog post. You'll see something like:

```html
<h1>Sorry, could not parse static page content</h1>
<p>This might happen if you are not using the static generated pages.</p>
```

This message is showing because we're not able to get the HTML of the markdown; we haven't statically generated the site to do so. Scully injects the markdown's HTML at build time, so we're unable to get the contents of the markdown file during the development mode. We _can_ get the route metadata from the frontmatter on the blog post, however. If you want to learn more about that, you'll have to read the next section. 😉

# Running the Build

> Even if you're familiar with Angular's build process, you should read this section! Scully does some non-standard behavior that will prevent some of the steps in the next sections if not understood properly.

Now that we have our code configured to generate routes based on our Markdown files let's run `ng build`. The build should go off without a hitch if the code was updated alongside the post.

> If you hit an error at this step, make sure to read through the steps again and pay attention to the error messages. Angular does a decent job of indicating what you need to change to get the build working again.

Now, let's run `npm run scully`; Doing so should give us some message like this:

```
Route "" rendered into file: "/Users/ccrutchley/git/my-scully-blog/dist/static/index.html"
Route "/blog" rendered into file: "/Users/ccrutchley/git/my-scully-blog/dist/static/blog/index.html"
Route "/blog/2020-03-12-blog" rendered into file: "/Users/ccrutchley/git/my-scully-blog/dist/static/blog/2020-03-12-blog/index.html"
send reload
```

> "ScullyIO not generating markdown blog post route" is something I've attempted to Google multiple times.
>
> If you happen to see an error like `Pull in data to create additional routes.
> missing config for parameters (postId) in route: /blog/:postId. Skipping
> Route list created in files` you've misconfigured your `scully.config.js` file.
>
> For example, at one point I had the following code in my config file when I was getting that error:
>
> ```javascript
> '/blog/:postId': {
>   type: 'contentFolder',
>   slug: {
>     folder: "./blog"
>   }
> },
> ```
>
> The problem is that the route and the config are mismatched. You need to configure it to look like this:
>
> ```javascript
> '/blog/:postId': {
>   type: 'contentFolder',
>   postId: {
>     folder: "./blog"
>   }
> },
> ```
>
> Making sure that your params match like this should generate the pages as-expected.

Now, we can access the server at the bottom of the build output:

```
The server is available on "http://localhost:1668/"
```

Finally, if we go to <http://localhost:1668/blog/test-post>, we can see the post contents alongside our header and footer.

![A preview of the post as seen on-screen](./hello_world_blog_post.png)

## Scully Build Additions {#scully-build-folder}

You'll notice that if you open your `dist` folder, you'll find two folders:

- `my-scully-blog`
- `static`

![An image showing the folder layout of dist](./dist-folders.png)

The reason for the two separate folders is because Scully has it's own build folder. When you ran `ng build`, you generated the `my-scully-blog` folder, then when you later ran `npm run scully`, it generated the `static` folder. As such, if you want to host your app, you should use the `static` folder.

## Asset Routes {#scully-build-routes}

If you open the `/src/assets` folder, you'll notice another file you didn't have before `npm run scully`. This file is generated any time you run Scully and provides you the routing metadata during an `ng serve` session. [Remember how I mentioned that there was a way to access the Markdown frontmatter data?](#scully-blog-route-config) Well, this is how! After running a Scully build, you'll be provided metadata at your disposal. In the next section, we'll walk through how to access that metadata!

# Listing Posts {#scully-route-acess}

To get a list of posts, we're going to utilize Scully's route information service. To start, let's add that service to the `blog.component.ts` file:

```typescript
import { Component, OnInit } from '@angular/core';
import { ScullyRoutesService } from '@scullyio/ng-lib';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  constructor(private scully: ScullyRoutesService) {}

  ngOnInit(): void {      
  }
}
```

Now that we have access to said service, we can add some calls inside of our `ngOnInit` lifecycle method to list out the routes:

```typescript
ngOnInit(): void {
  this.scully.available$.subscribe(routes => console.log(routes));
}
```

If you now start your server (`ng serve`) and load up your `/blog` route, you should see the following printed out to your log:

```javascript
0: {route: "/"}
1: {route: "/blog/test-post", title: "Test post", description: "This is a post description", publish: true, authorName: "Corbin Crutchley", …}
2: {route: "/blog"}
```

See? We're able to see all of the routes that Scully generated during the last `npm run scully` post-build step. Additionally, any of the routes that were generated from a markdown file contains it's frontmatter!

> [Remember how I said earlier that the frontmatter fields impacted Scully?](#frontmatter) Well, that `publish` field will toggle if a route shows up in this list or not. If you change that field to `false`, then rebuild and re-run the `scully` command, it will hide it from this list.
>
> Want to list **all** of the routes, including the ones with `publish: false`? Well, change `this.scully.available$` to `this.scully.allRoutes$`, and you'll even have those in the fray!

We now have the list of routes, but surely we don't want to list the `/blog` or the `/` routes, do we? Simple enough, let's add a filter:

```typescript
routes.filter(route =>
	route.route.startsWith('/blog/') && route.sourceFile.endsWith('.md')
);
```

And that'll give us what we're looking for:

```javascript
0: {route: "/blog/test-post", title: "Test post", description: "This is a post description", publish: true, authorName: "Corbin Crutchley", …}
```

## Final Blog List {#scully-avail-routes}

We can cleanup the code a bit by using [the Angular `async` pipe](https://angular.io/api/common/AsyncPipe):

```typescript
// blog.component.ts
import { Component } from '@angular/core';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  constructor(private scully: ScullyRoutesService) {}

  $blogPosts = this.scully.available$.pipe(
    map(routes =>
      routes.filter(
        route =>
          route.route.startsWith('/blog/') && route.sourceFile.endsWith('.md')
      )
    )
  );
}
```

```html
<!-- blog.component.html -->
<ul aria-label="Blog posts">
  <li *ngFor="let blog of $blogPosts | async">
    <a [routerLink]="blog.route">
      {{blog.title}} by {{blog.authorName}}
    </a>
  </li>
</ul>
```

This code should give us a straight list of blog posts and turn them into links for us to access our posts with!

![A preview of the post list as seen on-screen](./post_list_preview.png)

While this isn't a pretty blog, it is a functional one! Now you're able to list routes; we can even get the metadata for a post

## Final Blog Post Page {#scully-avail-routes-filtered}

But what happens if you want to display metadata about a post on the post page itself? Surely being able to list the author metadata in the post would be useful as well, right?

Right you are! Using [RxJS' `combineLatest` function](https://rxjs.dev/api/index/function/combineLatest) and [the `ActivatedRoute`'s `params` property](https://angular.io/api/router/ActivatedRoute#params) (alongside [the RxJS `pluck` opperator](https://rxjs.dev/api/operators/pluck) to make things a bit easier for ourselves), we're able to quickly grab a post's metadata from the post page itself.

```typescript
// blog-post.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { combineLatest } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private scully: ScullyRoutesService
  ) {}

  $blogPostMetadata = combineLatest([
    this.activatedRoute.params.pipe(pluck('postId')),
    this.scully.available$
  ]).pipe(
    map(([postId, routes]) =>
      routes.find(route => route.route === `/blog/${postId}`)
    )
  );
}
```

```html
<!-- blog-post.component.html -->
<h1 *ngIf="$blogPostMetadata | async as blogPost">Blog Post by {{blogPost.authorName}}</h1>
<hr>
<!-- This is where Scully will inject the static HTML -->
<scully-content></scully-content>
<hr>
<h2>End of content</h2>
```

![A preview of the post list as seen on-screen](./post_page_preview.png)

# Conclusion

While this blog site is far from ready from release, it's functional. It's missing some core SEO functionality as well as general aesthetics, but that could be easily remedied. Using a package like [`ngx-meta`](https://www.npmjs.com/package/@ngx-meta/core) should allow you to make short work of the SEO meta tags that you're missing where areas adding some CSS should go a long way with the visuals of the site.

All in all, Scully proves to be a powerful tool in any Angular developer's toolkit, and knowing how to make a blog with it is just one use case for such a tool.

As always, I'd love to hear from you down below in our comments or even [in our community Discord](https://discord.gg/FMcvc6T). Also, don't forget to subscribe to our newsletter so you don't miss more content like this in the future!
