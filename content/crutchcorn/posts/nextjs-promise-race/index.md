---
{
  title: 'Next.js Promise Racing',
  description: "Learn how you can use Next.js' and React's primitives to achieve a neat party trick: Conditionally show a loading spinner based on a given wait time.",
  published: "2025-06-30",
  tags: ["react", "webdev"],
  license: "cc-by-4",
}
---

While working on my next article, I was reminded of [a Next.js demo I posted to X/Twitter some time ago](https://x.com/crutchcorn/status/1754174851936629225). 

This demo showcases how you can use [React Server Components (RSCs)](/posts/what-are-react-server-components) to say "Fully resolve a promise on the server unless it takes longer than N seconds. If it does, then show a spinner on the client":

```jsx
import { Suspense } from "react";

// Simulate an async data fetching function
function fetchUser() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ name: "Corbin Crutchley" });
		}, 2000);
	});
}

// Race the passed promise against a timeout of 1 second
function race(promise) {
	return Promise.any([
		promise,
		new Promise((resolve) => setTimeout(() => resolve(), 1000)),
	]);
}

async function UserDisplay({ promise }) {
	const user = await promise;
	return <div>{user.name}</div>;
}

export default async function Page() {
	// Start fetching user data
	const userPromise = fetchUser();

	// If the user data takes longer than 1 second, we will not wait for it
	// and instead render a fallback UI.
	await race(userPromise);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<UserDisplay promise={userPromise} />
		</Suspense>
	);
}
```

<iframe data-frame-title="Server Race - StackBlitz" src="pfp-code:./server-race?template=node&embed=1&file=src%2Fapp%2Fpage.jsx"></iframe>

This is so cool to me. Notice we didn't need any `"use client"` API usage; these are all server components! But despite that, we're still using the previously client-only `<Suspense>` component to handle data loading!

Not only do React's client and server APIs marry in this code sample, but even the ideas behind JSX-over-the-wire are on full display here: We're _[serializing](/posts/intro-to-web-components-vanilla-js#Serializability) a promise to send over the wire_. **Conditionally**.

This means that if the promise resolves in time, it will never ship the loading `<div>` to the client!

Likewise, if it doesn't resolve in time, the promise will "continue" on the client via Next.js' RPC mechanisms. Not only is this a neat party trick, but it comes with performance benefits as well. In the example above, `fetchUser` takes 2 seconds but the wait time is only 1 second. When the promise is passed to the user in this way, they'll only have to wait 1 addition second from the original wait time to resolve.

Pretty cool, right?
