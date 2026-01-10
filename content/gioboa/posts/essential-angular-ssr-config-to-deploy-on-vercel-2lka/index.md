---
{
title: "Essential Angular SSR Config To Deploy On Vercel",
published: "2025-10-16T09:57:01Z",
tags: ["webdev", "programming", "angular", "vercel"],
description: "The world of web development is constantly evolving, with a strong emphasis on performance, user...",
originalLink: "https://dev.to/this-is-angular/essential-angular-ssr-config-to-deploy-on-vercel-2lka",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

The world of web development is constantly evolving, with a strong emphasis on performance, user experience, and efficient deployment. [Angular](https://angular.dev/), a powerful framework for building dynamic web applications, has embraced Server-Side Rendering (SSR) to address these demands, offering benefits like faster initial page loads and improved SEO.

However, integrating Angular SSR with platforms like [Vercel](https://vercel.com/) requires special configuration.

The creation of a new Angular application, is really straight forward, leveraging the `--ssr` flag to enable server-side rendering from the outset.

The command `ng new your-project-name-here --ssr` initiates this process. During setup, several key choices were made to optimize the application:

- Stylesheet System: CSS, Tailwind CSS, Sass (SCSS) etc. etc.
- Zoneless Application: Opting for a 'zoneless' application without zone.js is a significant step towards improving performance. Zone.js, while simplifying change detection, can sometimes introduce overhead. A zoneless approach offers more granular control and can lead to smaller bundle sizes and faster execution.
- AI Tools Configuration: While the specific AI tools weren't detailed in the provided context, integrating them with Angular best practices suggests a forward-thinking approach to leveraging intelligent functionalities within the application.

## API Endpoint

With the foundational Angular SSR application in place, the next step involved creating a simple API endpoint. A common practice for testing API connectivity is a "ping" endpoint.

```
app.get('/api/ping', (req, res) => { 
  res.json({ message: 'pong' })
});
```

This basic API, designed to return a JSON object with a "pong" message, serves as a crucial test for backend communication.

Initially, deploying this setup to Vercel using the standard process yielded unexpected results.

> While the application and its API functioned perfectly in a local development environment, the API route failed to work correctly once deployed on Vercel. This common hurdle often arises from how serverless platforms handle routing and server-side code execution.

## Vercel Custom Configuration

To overcome this, you can add this custom configuration for Vercel, two important files: `api/index.js` and `vercel.json`. These files are the cornerstone of successfully integrating Angular SSR with Vercel's serverless functions and ensuring all routes, including custom APIs, are correctly handled.

The `api/index.js` file acts as the entry point for Vercel's serverless function.

```javascript
export default async (req, res) => {
  const { reqHandler } = await import('../dist/angular-SSR-vercel/server/server.mjs');
  return reqHandler(req, res);
};
```

This file asynchronously imports the `reqHandler` from the compiled Angular SSR server bundle (`dist/angular-SSR-vercel/server/server.mjs`). This `reqHandler` is responsible for handling all incoming requests, including both the Angular application's routes and any custom API endpoints defined within the Angular server.

> By exporting this handler as the default, Vercel knows exactly how to process requests directed to this serverless function.

The `vercel.json` file is equally vital, providing Vercel with explicit instructions on how to build and route the application:

```json
{
  "version": 2,
  "public": true,
  "name": "your-project-name-here",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api"
    }
  ],
  "functions": {
    "api/index.js": {
      "includeFiles": "dist/your-project-name-here/**"
    }
  }
}
```

Let's focus on the important configurations:

- `"rewrites"`: This is where the magic for routing happens. The `"source": "/(.*)"` rule tells Vercel to match all incoming requests. The `"destination": "/api"` then redirects all these requests to the `/api` route, which in turn is handled by our `api/index.js` serverless function. This ensures that both static asset requests, Angular routes, and custom API calls are all funneled through the Angular SSR server.
- `"functions"`: This section configures the specific serverless functions. `"api/index.js"` identifies our entry point serverless function. On the other hand, `"includeFiles": "dist/angular-SSR-vercel/"` is crucial setting instructs Vercel to include the entire compiled Angular SSR distribution directory within the serverless function bundle.

Without this, the `api/index.js` file would not be able to find and import the `server.mjs` file, leading to deployment failures.

---

With these custom configurations in place, the Angular SSR application, complete with its custom `/api/ping` endpoint, successfully deployed and functioned on Vercel. The `vercel.json` rewrite rule effectively routes all requests through the `api/index.js` serverless function, which then leverages the Angular SSR `reqHandler` to serve both the rendered Angular application and any defined API routes.

This is an excellent blueprint for developers looking to integrate Angular SSR with Vercel with SEO-friendly approach and seamless API integration.

---

You can [follow me on GitHub](https://github.com/gioboa), where I'm creating cool projects.

I hope you enjoyed this article, don't forget to give ❤️.
Until next time 👋

{% embed https://dev.to/gioboa %}
