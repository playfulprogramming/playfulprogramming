---
{
	title: "How we built our custom semantic search page",
	description: "",
	published: '2024-11-04T13:45:00.284Z',
	tags: ['webdev', 'javascript']
}
---

On [October 20th, 2023 we launched a major redesign](https://github.com/playfulprogramming/playfulprogramming/pull/497). Not only did this redesign massively facelift all of the pages we had built previously:

![TODO: Write](./uu_homepage_before.png)

> [Unicorn Utterances was our old name, which you can learn more about here.](/posts/rebrand-to-playful-programming)

![TODO: Write](./pfp_homepage_after.png)

But during this process we decided to flesh out some functionality we had previously. For example, while our old site had the concept of a "collection", they weren't exposed anywhere on our site; not on the homepage, not via search, etc.

In the new site, we have this banner of collections on the homepage and they show up in our searches (more on that later):

![TODO: Write](./collections_preview.png)

One of the features we embarked on improving was search.

# Improving search UX

On the previous site, you could only make a search on the homepage. It was clunky, didn't have many of the features people wanted (like tags filtering), and wasn't scalable.

![TODO: Write](./uu_search_before.png)

> Yup, that was the entire search experience.

To solve this, we worked hard on a new search experience with a dedicated search page powered by [Preact](https://preactjs.com/), [React Aria](https://react-spectrum.adobe.com/react-aria/), and [TanStack Query](https://tanstack.com/query/). It featured:

- A brand new design
- Ability to sort by date
- Collections in search
- Filters on tags and authors
- Mobile view

And more.

![TODO: search](./pfp_search_after.png)

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

![TODO: Write](./vercel_search.png)

This worked well for an initial implementation, but to keep things simple for an MVP, we initially avoided:

- Sever-side pagination
- Server-side filtering
- Counting article results on the server

We knew we could fix this in a follow-up, but this would've required more work.

In addition, we weren't entirely happy with the search results:

// SHow demo of "AST" before/after

// Show conversational request before/after

# Fixing Search Results

// ORAMA TIME BABY