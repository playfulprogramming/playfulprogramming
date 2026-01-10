---
{
title: "Qwik introduction from Misko and Giorgio",
published: "2023-06-26T09:01:02Z",
tags: ["qwik", "javascript", "webdev", "community"],
description: "On June 14th I've been in Florence to attend an amazing workshop about Qwik, held by Misko Hevery,...",
originalLink: "https://leonardomontini.dev/qwik-framework/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "21771",
order: 1
}
---

On June 14th I've been in Florence to attend an amazing workshop about Qwik, held by Misko Hevery, the creator of Qwik, and Giorgio Boa, a Qwik core contributor and advocate.

In case Misko's name sounds familiar to you, he is also the creator of Angular.

![Selfie with Misko](./mhhykfxs9vi9boxr306n.png)

Such a great day! I've learned a lot about Qwik and I've met a lot of great people, I'm proud of this selfie!

---

## Qwik Workshop

Today I want to share with you some highlights of what I learnt during the workshop.

You can find here a short summary of the topics I'm going to cover in the [video below](https://youtu.be/m5PX9XF1in8).

### Resumability

One of the key factors of Qwik is that it's based on **resumability**.

In short, components are rendered first on the server, then they are "paused" and sent to the client. When the client receives the component, it receives it as plain html (and css) with the serialized state attached to it, and nothing happens. No extra javascript is downloaded.

This makes the page load fast. Really fast.

When the user interacts with the components, the js code is downloaded and the component is "resumed" on the client, starting exactly from the state it had on the server.

### Click to source

A cool thing, you can hold the `Alt` key and click on any element of the page to see the source code of the component that generated it, directly on vscode.

Qwik isn't the only framework that does this, but it works fine and it's worth mentioning.

### Signals

Qwik uses Signals natively. The greatest advantage is that way less components need a rerender when the state changes. Actually, only the part that really needs to be updated is updated. Child components are not rerendered if they don't need to.

You can use `useSignal` for primitive values, or `useStore` for objects.

### React to changes

Similarly to what you know as `useEffect`, Qwik has `useTask` with the biggest difference in the dependency array, which got removed.

```js
useTask$(({ track, cleanup }) => {
  track(filter);
  const id = setTimeout(() => (debouncedFilter.value = filter.value), 400);
  cleanup(() => clearTimeout(id));
});
```

You can keep track of the dependencies by using `track` and return a `cleanup` function if you need to.

### Components below the fold

Similarly to Astro, you can make sure some components not currently visible on the screen are not dynamic. Once you get there, the js code is downloaded and the magic happens.

This is possible with `useVisibleTask$`.

### Scoped Style

You can easily scope your style to avoid conflicts with other components.

```js
import CSS from "./index.css?inline";

...

useStylesScoped$(CSS);
```

### Combine data

Again a React analogy, similar to useMemo you can use useComputed to combine data.

```js
const fullName = useComputed$(() => `${firstName} ${lastName}`);
```

This works really well if you have data stored in signals or stores.

### Retrieve data asynchronously

The `useResource$` method will let you get async data with the power of `useTask$`, with `track`, `cleanup` and some extra features, such as the `<Resource>` built-in component which allows you to handle the loading and error states.

```js
<Resource
  value={reposResource}
  onPending={() => <>Loading...</>}
  onRejected={(error) => <>Error: {error.message}</>}
  onResolved={(repos) => (
    <ul>
      {repos.map((repo) => (
        <li key={repo}>
          <a href={`/github/${github.org}/${repo}`}>{repo}</a>
        </li>
      ))}
    </ul>
  )}
/>
```

### Routing parameters

`useLocation` in combination with `routeLoader$` are your best friends if you need to read parameters from the url and do some server-side computation.

### Server only operations

Speaking of the server, if you want something to happen there and not on the client, for example access the database or handle some external calls which might have private keys, you can use `server$`.

### Contribute to Qwik

Qwik is Open Source, you can contribute in the official [GitHub repo](https://github.com/BuilderIO/qwik) and also by creating integrations, dev tools and other projects.

A cool one I can mention is [qwik-ui](https://github.com/qwikifiers/qwik-ui), the official UI library for Qwik.

## Sounds cool?

If some of the mentioned topics sound interesting to you, that's great, I will expand them and show some coding in the video I recorded:

{% youtube m5PX9XF1in8 %}

---

Thanks for reading this article, this was a short one but I hope you found it interesting!

I recently launched my Discord server to talk about Open Source and Web Development, feel free to join: https://discord.gg/bqwyEa6We6

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/channel/UC-KqnO3ez7vF-kyIQ_22rdA?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
