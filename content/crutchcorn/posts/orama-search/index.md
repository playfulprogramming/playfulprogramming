---
{
	title: "How we built our custom semantic search page",
	description: "Let's learn how we managed to improve our search experience using semantic search, powered by Orama.",
	published: '2024-11-07T13:45:00.284Z',
	tags: ['webdev', 'javascript']
}
---

> As part of our partnership with Orama, this blog post was sponsored and financially compensated for by Orama. This doesn't invalidate our learnings from this post, but if you'd like to read more, you can [check our disclosure of our partnership with Orama to learn more.](https://github.com/playfulprogramming/playfulprogramming/issues/1193)

On [October 20th, 2023 we launched a major redesign](https://github.com/playfulprogramming/playfulprogramming/pull/497). Not only did this redesign massively facelift all of the pages we had built previously:

![A bowtie Unicorn with a grid of articles in a simple two-tone UI](./uu_homepage_before.png)

> [Unicorn Utterances was our old name, which you can learn more about here.](/posts/rebrand-to-playful-programming)

![A more refined homepage with stickers and a "Join our Discord" button and search box](./pfp_homepage_after.png)

But during this process we decided to flesh out some functionality we had previously. For example, while our old site had the concept of a "collection", they weren't exposed anywhere on our site; not on the homepage, not via search, etc.

In the new site, we have this banner of collections on the homepage and they show up in our searches (more on that later):

![A list of collections like "Web Fundamentals", "The Framework Field Guide", and "React Beyond the Render"](./collections_preview.png)

One of the features we embarked on improving was search.

# Improving search UX

On the previous site, you could only make a search on the homepage. It was clunky, didn't have many of the features people wanted (like tags filtering), and wasn't scalable.

![A search box showing "Next.js" in the input showing an article on the homepage](./uu_search_before.png)

> Yup, that was the entire search experience.

To solve this, we worked hard on a new search experience with a dedicated search page powered by [Preact](https://preactjs.com/), [React Aria](https://react-spectrum.adobe.com/react-aria/), and [TanStack Query](https://tanstack.com/query/). It featured:

- A brand new design
- Ability to sort by date
- Collections in search
- Filters on tags and authors
- Mobile view

And more.

![A complete search page with a sidebar for filters and sort and the results on the main part of the screen](./pfp_search_after.png)

# Scalability Concerns

Earlier, we mentioned that the old search page wasn't scalable.

The reason it wasn't scalable was because we were using a JavaScript package fully on the client-side via [Lunr.js](https://lunrjs.com/). This meant that as we added articles to the site, the more JavaScript we had to download on each client-load to index all of the articles. We even did this if you didn't use search yet.

To solve this, we both:

- Migrated to a slightly heavier package with better search results (in our experience): [Fuse.js](https://www.fusejs.io/)
- Moved the searching to the server via a simple Vercel serverless function

 This alliviated our scalability concerns, since we were only needing to ship the required information down to the search page based on the request.

We did this through a faily trivial pipeline:

1) Store all of our content in markdown in our Git repository
2) During the build of the static parts of the Playful Programming site, build a `searchIndex.json` file that acts as a database of our articles
3) Consume the `searchIndex.json` file via a `fs.readFile` method in our serverless function
4) Deploy the static file and serverless functions via Vercel

![Vercel's dashboard showing "/api/search" and some metrics](./vercel_search.png)

This worked well for an initial implementation, but to keep things simple for an MVP, we initially avoided:

- Sever-side pagination
- Server-side filtering
- Counting article results on the server

We knew we could fix this in a follow-up, but this would've required more work.

In addition, we weren't entirely happy with the search results. For example, searching `"AST"` showed unrelated articles instead of Corbin's article of ["How Computers Speak: Assembly to AST"](/posts/how-computers-speak)

![A search result for "AST" showing "Porting a Next.js Site to Astro Step-by-Step"](./ast_search_before.png)

Similarly, any searches that include a more conversational tone, like `"articles that explain how effects work in React"` would either return unrelated items or nothing at all:

![Search result for "articles that explain how effects work in React" with 0 results](./search_term_before.png)

# Fixing Search Results

To solve these issues, we reached out to [Orama](https://orama.com/). Corbin had worked with them previously with his work on [the TanStack docs site](https://tanstack.com/) and knew that they could solve the challenges we were facing.

While Orama has an incredibly powerful built-in UI:

![A pre-built search UI showing "facets" search on Orama's docs](./orama_default_ui.png)

We didn't want to give up on the custom UI we'd built.

Luckily, [Orama provides a great JavaScript SDK that we could utilize for our needs: `@oramacloud/client`](https://docs.orama.com/cloud/integrating-orama-cloud/javascript-sdk).

To use it, we exposed our database of articles via a remote JSON that's deployed via CI/CD:

![Our searchIndex.json showing the whole list of our articles](./search_json.png)

We point Orama at this JSON endpoint:

![The Orama dashboard pointed at our remote JSON URL](./orama_dashboard.png)

> Orama will regularly check this remote JSON endpoint of ours to make sure that it's the most up-to-date data as needed.

Then, we initialize the Orama client like so:

````javascript
const postClient = new OramaClient({
    endpoint: ORAMA_POSTS_ENDPOINT,
    api_key: ORAMA_POSTS_API_KEY
});
````

And can call this client with a simple search term, complete with pagination and more:

````javascript
postClient.search(
    {
        term: "articles that explain how effects work in React",
        limit: 6,
        offset: 6 * pageIndex,
    },
);
````

Once this was done in our codebase, our search results were immediately improved:

!["articles that explain how effects work in React" search result showing "side effects" in React](./search_term_after.png)

# Why Orama?

Like any other decision-making tree, our decision to go with Orama extended beyond the developer experience wins we showcased before.

***First***, for Orama is perfect for open-source projects like ours. **Not only do you get unlimited search queries on any plan; Orama is free for open-source and community projects, forever**.

Don't take it from us! We asked Michele Riva, CTO of Orama, and [this is what he had to say about community usage of their product:](https://bsky.app/profile/riva.wtf/post/3la52ozb2sx2g)

> @orama.com is free and unlimited for all open-source projects and non-profit communities, forever.
>
> If you need full-text, vector, hybrid search, and unlimited GenAI sessions + analytics for free on your project, feel free to reach out!

-------

***Secondly***, Orama handles generating embeddings for your project. This means that we didn't have to be machine learning (ML) experts to get up-and running. We only needed to provide our data and it handled everything else for us.

---------

**Third**, Orama's vector searches allow us to maintain context through our search. This means that if someone searches something like "Green dress", it won't show search results for "Green salad dressing", but instead only show results for "Dressing in a green gown".

-----

***Finally***, Orama not only provides vector search, but it manages "hybrid search features". This means that it's able to mix-n-match methods of vector search and conventional text search to provide the best results; regardless of the length of text.

After all, if I know that I want to search `"React Side Effect"`, looking for a specific article, I don't want a vector database to override my request with something less relevant.

# Takeaways

Ultimately, we're very happy with our decision to go with Orama for our semantic search experience. They provided incredible support, a good product, and our users are happier as a result.

> **Story Time:**
> True story, after our first call with Orama, they had a proof-of-concept up and running against our API in 5 minutes

What do you think about our search page? We'd love to hear from you! 

[Let us know in our Discord](https://discord.gg/FMcvc6T); we hope to see you soon!
