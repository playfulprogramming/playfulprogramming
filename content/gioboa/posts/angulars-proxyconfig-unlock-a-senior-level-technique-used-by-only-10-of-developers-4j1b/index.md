---
{
title: "Angular's proxyConfig: Unlock a senior-level technique used by only 10% of developers",
published: "2025-04-25T12:51:26Z",
edited: "2025-04-25T12:56:04Z",
tags: ["angular", "webdev", "programming", "javascript"],
description: "In the world of modern web development, Angular has established itself as a leading framework for...",
originalLink: "https://dev.to/this-is-angular/angulars-proxyconfig-unlock-a-senior-level-technique-used-by-only-10-of-developers-4j1b",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

In the world of modern web development, Angular has established itself as a leading framework for building dynamic and interactive single-page applications (SPAs).

These applications, while powerful on the client-side, often need to interact with backend APIs or servers to retrieve and manipulate data.

> This is where Angular's `proxyConfig` comes into play, offering a seamless and efficient solution for handling cross-origin requests during development.

## The CORS Conundrum and the Need for a Proxy

Before we dive into `proxyConfig`, it's crucial to understand the underlying problem it solves: `Cross-Origin Resource Sharing (CORS)`.

> CORS is a security mechanism implemented by web browsers to restrict web pages from making requests to a different domain than the one which served the web page. This is a vital security measure that prevents malicious websites from accessing sensitive data from other domains.

However, during development, your Angular application often runs on `localhost:4200` (or a similar port), while your backend API might be running on `localhost:8080` or a different server altogether. This disparity in origin triggers CORS restrictions, preventing your Angular application from directly communicating with the backend, leading to errors in your browser console like:

"Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://localhost:8080/api/data. (Reason: CORS header 'Access-Control-Allow-Origin' missing)."

## Angular's `proxyConfig`: Your Development Gateway

Angular's `proxyConfig` provides a convenient and efficient workaround for the CORS issue during development. It essentially acts as a reverse proxy, intercepting requests from your Angular application and forwarding them to the backend server.

> The key benefit is that the browser sees all requests originating from the same origin (your Angular application's development server), thus bypassing the CORS restrictions.

In essence, the workflow is as follows:

- Your Angular application running on `localhost:4200` makes a request to `/api/data`.
- The `proxyConfig` intercepts the request.
- The `proxyConfig` forwards the request to `http://localhost:8080/api/data`.
- The backend server processes the request and sends a response back to the `proxyConfig`.
- The `proxyConfig` relays the response back to your Angular application.

Since the request appears to originate from the same origin, the browser happily allows the communication, and you can seamlessly develop your Angular application without the CORS headache.

## Creating and Configuring Your `proxyConfig`

The `proxyConfig` is typically a JavaScript or JSON file that resides in the root of your Angular project. You can name it anything you like, but a common convention is `proxy.conf.json` or `proxy.conf.js`. The content of this file defines the rules for how requests should be proxied.

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  }
}
```

- `/api` (Context): This is the URL prefix that triggers the proxy. Any request from your Angular application starting with `/api` will be intercepted and proxied. This is a crucial configuration point as it allows you to specify which requests should be proxied and which should be handled directly by your Angular application.
  You can define multiple contexts to proxy different parts of your application to different backend servers.

- `target`: This is the URL of the backend server to which the requests will be forwarded. In this example, it's pointing to a server running on `http://localhost:8080`.
  This is the most important setting as it defines where the proxy will send the intercepted requests.

- `secure`: This property determines whether to use HTTPS when proxying the request. Setting it to `false` disables SSL verification, which is often necessary during development with self-signed certificates. **Important Note:** Never set `secure` to `false` in production, as it compromises security.

- `logLevel`: This controls the level of logging output from the proxy. Setting it to `"debug"` provides detailed information about the proxied requests and responses, which can be helpful for troubleshooting. Other options include `"info"`, `"warn"`, and `"error"`.

- `changeOrigin`: Setting this to `true` modifies the `Origin` header of the request to match the `target` URL. This is often necessary when the backend server performs origin validation, as it ensures that the request appears to originate from the correct domain. This is a critical setting to avoid CORS-related issues on the backend.

## Integrating `proxyConfig` into Your Angular Application

Once you have created your `proxyConfig` file, you need to tell Angular to use it during development. This is done by modifying the `serve` configuration in your `angular.json` file.

```json
{
   "projects": {
     "my-app": {
       "architect": {
         "serve": {
           "builder": "@angular-devkit/build-angular:dev-server",
           "options": {
             "proxyConfig": "src/proxy.conf.json" // <-- Add this line
           }
         }
       }
     }
   }
 }
```

The key change is adding the `proxyConfig` property under the `options` configuration within the `serve` target. This property specifies the path to your `proxyConfig` file.
Now, when you run `ng serve`, the Angular development server will automatically use the proxy configuration.

## Advanced `proxyConfig` Configurations

The basic `proxyConfig` setup is sufficient for many scenarios, but Angular's proxy configuration offers several advanced features for more complex development environments.

- Multiple Contexts: You can define multiple contexts to proxy different API endpoints to different backend servers.

```json
{
  "/products": {
    "target": "http://localhost:3000",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  },
  "/users": {
    "target": "http://localhost:4000",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  }
}
```

- Path Rewrite: You can rewrite the URL path before forwarding the request to the backend. This is useful if your backend API expects a different path structure than your Angular application uses.

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": "" // Remove the /api prefix
    }
  }
}
```

In this example, any request to `/api/products` will be forwarded to `http://localhost:8080/products` (the `/api` prefix is removed).

- WebSocket Proxying: `proxyConfig` can also be used to proxy WebSocket connections. You need to add the `ws` property to the configuration.

```json
{
  "/ws": {
    "target": "ws://localhost:8080",
    "ws": true,
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  }
}
```

- Custom Proxy Logic: For highly customised proxying behaviour, you can use a JavaScript file instead of a JSON file. This allows you to define a function that handles the proxying logic programmatically.

```javascript
export default {
  '/api/proxy': {
    "target": 'http://localhost:3000',
    "secure": false,
    "bypass": function (req, res, proxyOptions) {
        if (req.headers.accept.includes('html')) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
        }
        req.headers['X-Custom-Header'] = 'yes';
    }
  }
};
```

The key part here is the bypass function, it adds custom logic and lets you conditionally skip the proxy based on the request.
It receives three arguments:

- `req`: The incoming request object (Node.js http.IncomingMessage). You can inspect headers, cookies, the URL, etc.
- `res`: The outgoing response object (Node.js http.ServerResponse). You can modify the response, but be careful, as you might interfere with Angular's rendering if you use it inappropriately.
- `proxyOptions`: The proxy options that are configured for this route. You usually don't need to directly interact with these.

## proxyConfig in Production? Absolutely Not!

It is absolutely crucial to understand that `proxyConfig` is **exclusively for development purposes**. It is not intended for and should never be used in a production environment.

In production, you should configure your web server (e.g., Nginx, Apache, IIS) to act as a reverse proxy for your Angular application.  This ensures optimal performance, security, and control over request routing. Using the development server's proxy in production would be highly inefficient and introduce significant security vulnerabilities.

## Conclusion

Angular's `proxyConfig` is an indispensable tool for streamlining development workflows when your application needs to interact with backend APIs. By acting as a reverse proxy, it effectively bypasses CORS restrictions, allowing you to focus on building your application without being hindered by cross-origin issues.

Understanding its configuration options and advanced features empowers you to handle complex development scenarios with ease. Remember to always configure a proper reverse proxy on your production web server and never rely on `proxyConfig` in a live environment.

By mastering `proxyConfig`, you can significantly improve your development experience and create robust and efficient Angular applications.

---

You can [follow me on GitHub](https://github.com/gioboa), where I'm creating cool projects.

I hope you enjoyed this article, don't forget to give ❤️.
Bye 👋

{% embed https://dev.to/gioboa %}
