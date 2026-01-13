---
{
title: "TanStack Router: Path Parameters & Loader",
published: "2024-02-29T10:51:49Z",
tags: ["typescript", "react", "tutorial", "learning"],
description: "Welcome to the second article of a series where we will explore TanStack Router, the new typesafe...",
originalLink: "https://leonardomontini.dev/tanstack-router-path-parameters-loader",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "TanStack Router",
order: 2
}
---

Welcome to the second article of a series where we will explore TanStack Router, the new typesafe routing library (and state manager, in some cases) for React.

In the [first article](https://dev.to/this-is-learning/tanstack-router-setup-routing-in-react-4gf7) we saw how to set up a new project with TanStack Router and how to create a couple of routes. In this article we'll see how to handle path parameters and how to use a loader to fetch data before rendering a route.

## Path Parameters

Here's a demo of what you're going to learn in this article. For written instructions, keep reading below.

<iframe src="https://www.youtube.com/watch?v=xUrbLlcrIXY"></iframe>

On your favourite social network, your account url will be somewhere around `https://www.example.com/user/yourusername`. The `yourusername` part is a path parameter, and it's a way to tell the application that you'd like to see the page for that specific user.

Let's expand the previous example using pokemons as the domain. We want to create a page for each pokemin, obviously using path parameters.

If you didn't follow the previous article it's not a problem, you can start from the code on the [01-routes-and-setup](https://github.com/Balastrong/tanstack-router-demo/tree/01-routes-and-setup) branch.

### Adding a new route

Let's create a new file in `src/routes/pokemon/$id.ts`. You already see the path has a `$id` in it, which will be replaced in the URLs with our pokemon id.

### Reading the path parameter

Now, how can we read the parameter? When we create our route we're also creating a `Route` object which we can use to call some hooks, and there's one exactly called `useParams`.

Your initial page to check that everything is working might be something like this:

```tsx
export const Route = createFileRoute('/pokemon/$id')({
  component: Pokemon,
});

function Pokemon() {
  const { id } = Route.useParams();
  return <div>Pokemon {id}</div>;
}
```

If you now navigate to `http://localhost:5173/pokemon/1` you should see "Pokemon 1" on the screen. This already opens up to a lot of possibilities!

## Loader

To make things more interesting, let's say we want to fetch the pokemon data from an API before rendering the page. We can use a loader for that.

### Fetching the data

Here's an example to have an API, this isn't about TanStack router but only for the sake of the example. You can have on a file `src/api/pokemon.ts`:

```ts
type PokemonDetail = {
  name: string;
  id: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
};

export async function getPokemon(id: string): Promise<PokemonDetail> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return await response.json();
}
```

This gives us a function `getPokemon` that we can use to fetch the data for a specific pokemon.

### Using the loader

One of the parameters of the `createFileRoute` function is the `loader`. This is a function that will be called before rendering the route, and it can be used to fetch data. You can update your `Route` object to include the loader:

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { getPokemon } from '../../api/pokemon';

export const Route = createFileRoute('/pokemon/$id')({
  component: Pokemon,
  loader: async ({ params }) => await getPokemon(params.id),
});

function Pokemon() {
  const { id } = Route.useParams();
  return <div>Pokemon {id}</div>;
}
```

If you now refresh your page, you can already see in the network tab that the data is being fetched from the API and using it in the component is as easy as ready the path parameter since Route also exposes a `useLoaderData` hook.

```tsx
const pokemon = Route.useLoaderData();
```

You can now use the `pokemon` object to render the pokemon data on the screen, here's an example:

```tsx
function Pokemon() {
  const { id } = Route.useParams();
  const pokemon = Route.useLoaderData();
  console.log(pokemon);
  return (
    <div>
      <h2>
        ({id}) {pokemon.name}
      </h2>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <dl>
        <dt>Height</dt>
        <dd>{pokemon.height}</dd>
        <dt>Weight</dt>
        <dd>{pokemon.weight}</dd>
      </dl>
    </div>
  );
}
```

## Navigating to a route with parameters

If you notice, when you try to navigate to a route with parameters, you cannot set an url like `/pokemon/1` or `/pokemon/${pokemonId}` directly. TanStack Router will force you to pass the route definition as `/pokemon/$id` and then specify the parameter in the `params` object, for example:

❌ WRONG:

```tsx
<Link to={`/pokemon/${pokemon.id}`}>{pokemon.name}</Link>
```

✅ CORRECT:

```tsx
<Link to={'/pokemon/$id'} params={{ id: pokemon.id }}>
  {pokemon.name}
</Link>
```

Is it an additional step? Probably yes, but this makes sure you're passing the correct parameters and you have autocompletion and typesafety while doing so.

## Conclusion

In this article we saw how to handle path parameters and how to use a loader to fetch data before rendering a route. This is a very powerful feature that can be used to create dynamic pages and fetch data from an API.

However, sometimes you have many parameters, even structured! You can't have a strict link with each parameter sequentially, right? That's why in the next chapter we're gonna see one of the greatest features of TanStack Router: search parameters (aka query params).

This library allows you to basically handle your application state in the URL as search params, with the huge advantage that you can let your users bookmark an URL or send it to someone else, passing the state of your application.

Some examples? A search page with filters, a form with a lot of fields or a dashboard with many configurations.

As always, the code for this chapter is on the [02-path-parameters](https://github.com/Balastrong/tanstack-router-demo/tree/02-path-parameters) branch and stay tuned for the next article!

---

Watch the full playlist on YouTube: [TanStack Router](https://www.youtube.com/playlist?list=PLOQjd5dsGSxJilh0lBofeY8Qib98kzmF5)

---

Thanks for reading this article, I hope you found it interesting!

I recently launched a GitHub Community! We create Open Source projects with the goal of learning Web Development together!

Join us: https://github.com/DevLeonardoCommunity

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)
{% embed https://dev.to/balastrong %}
