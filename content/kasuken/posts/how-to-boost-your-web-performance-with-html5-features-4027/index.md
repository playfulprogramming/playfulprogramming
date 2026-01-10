---
{
title: "How to Boost Your Web Performance with HTML5 Features",
published: "2023-06-07T13:29:10Z",
edited: "2023-06-07T13:35:05Z",
tags: ["webdev", "html", "beginners", "performance"],
description: "Performance is a crucial aspect of web development, as it affects the user experience, accessibility,...",
originalLink: "https://dev.to/this-is-learning/how-to-boost-your-web-performance-with-html5-features-4027",
coverImage: "cover-image.png",
socialImage: "social-image.png"
}
---

Performance is a crucial aspect of web development, as it affects the user experience, accessibility, and business goals of your applications.
I develop products since many years right now, and the performance is one of the first thing that the users see and feel (and the UI/UX as well).
It try to work on performance on my backend tier but sometimes work on the performance on the frontend is important as well!

By using some of the HTML5 elements and attributes, you can make your web pages load faster, render smoother, and respond better to user interactions.

## The `fetchpriority` attribute

One of the HTML5 features that can improve the performance of your web pages is the `fetchpriority` attribute. This attribute allows you to signal to the browser the relative priority of a resource fetch compared to other resources. This can be useful when you want to indicate which resources are more or less important for the user experience.

The `fetchpriority` attribute can be used with `<link>`, `<img>`, and `<script>` tags. The attribute accepts one of three values:

- `high`: Fetch the resource at a high priority relative to other resources.
- `low`: Fetch the resource at a low priority relative to other resources.
- `auto`: Default mode, which indicates no preference for the fetch priority. The browser decides what is best for the user.

Here is an example of how to use the `fetchpriority` attribute:

```html
<link rel="stylesheet" href="style.css" fetchpriority="high">
<img src="logo.png" alt="Logo" fetchpriority="high">
<script src="analytics.js" fetchpriority="low"></script>
```

In this example, the browser will fetch the stylesheet and the logo image at a high priority, as they are essential for the first render of the page. The analytics script will be fetched at a low priority, as it is not critical for the user experience.

The effects of the hint on resource loading are browser-specific, so make sure to test on multiple browser engines. Use it sparingly for exceptional cases where the browser may not be able to infer the best way to load the resource automatically. Overuse can result in degrading performance.

## The `loading` attribute

Another HTML5 feature that can improve the performance of your web pages is the `loading` attribute. This attribute allows you to instruct the browser to defer loading of images and iframes that are off-screen until the user scrolls near them. This is also known as lazy loading, and it can save bandwidth and speed up page load time by avoiding unnecessary requests.

The `loading` attribute can be used with `<img>` and `<iframe>` tags. The attribute accepts one of two values:

- `lazy`: Defer loading of the resource until it reaches a calculated distance from the viewport.
- `eager`: Load the resource immediately.

Here is an example of how to use the `loading` attribute:

```html
<img src="banner.jpg" alt="Banner" loading="eager">
<img src="gallery1.jpg" alt="Gallery 1" loading="lazy">
<img src="gallery2.jpg" alt="Gallery 2" loading="lazy">
<iframe src="video.html" loading="lazy"></iframe>
```

In this example, the browser will load the banner image immediately, as it is likely to be visible on page load. The gallery images and the iframe containing a video will be loaded lazily, as they are likely to be below the fold and not visible on page load.

The `loading` attribute is supported by most modern browsers, but not by all. You can use a polyfill or a fallback technique to provide lazy loading functionality for older browsers.

## The `rel` attribute

Another HTML5 feature that can improve the performance of your web pages is the `rel` attribute. This attribute allows you to specify the relationship between the current document and a linked resource. Some of the values of this attribute can help you optimize the performance of your web pages by influencing how the browser connects to and fetches resources from different origins. These values are:

- `preconnect`: This value tells the browser to establish an early connection to an origin before an HTTP request is actually sent. This can reduce the latency and improve the performance of cross-origin requests.
- `preload`: This value tells the browser to fetch a resource as soon as possible, regardless of where it appears in the document. This can be useful for resources that are not easily discoverable by the browser, such as fonts, background images, or resources loaded by scripts.
- `prefetch`: This value tells the browser to fetch a resource that might be needed for a future navigation or user interaction, such as a page that the user is likely to visit next. This can improve the perceived performance of subsequent pages.

Here is an example of how to use the `rel` attribute:

```html
<head>
  <!-- Preconnect to a third-party origin -->
  <link rel="preconnect" href="<https://example.com>">

  <!-- Preload a font file -->
  <link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Prefetch a page -->
  <link rel="prefetch" href="/about.html">
</head>
```

In this example, the browser will preconnect to `https://example.com`, preload the font file `font.woff2`, and prefetch the page `/about.html`. These actions can improve the performance of cross-origin requests, font rendering, and subsequent navigation.

The `rel` attribute is supported by most modern browsers, but not by all. You can use feature detection or fallback techniques to provide alternative solutions for older browsers.

## Conclusion

In this post, I have shown you some of the HTML5 features that can help you optimize the performance of your web pages by controlling how and when the browser fetches resources such as images, scripts, fonts, and videos. These features are:

- The `fetchpriority` attribute: Allows you to signal to the browser the relative priority of a resource fetch compared to other resources.
- The `loading` attribute: Allows you to instruct the browser to defer loading of images and iframes that are off-screen until the user scrolls near them.
- The `rel` attribute: Allows you to specify the relationship between the current document and a linked resource, and influence how the browser connects to and fetches resources from different origins.

---

Are you interested in learning GitHub but don't know where to start? Try my course on LinkedIn Learning: [Learning GitHub](https://bit.ly/learninggithub).

![LinkedIn Learning](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/sdc2bpiftpadibi4h51c.gif)

---

Thanks for reading this post, I hope you found it interesting!

Feel free to follow me to get notified when new articles are out 🙂

{% embed https://dev.to/kasuken %}