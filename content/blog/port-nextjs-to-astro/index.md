---
{
	title: 'Port a Next.js Site to Astro',
	description: '',
	published: '2023-11-26T22:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['nextjs', 'react', 'astro'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

## Guided example: Next data fetching to Astro

Here is an example of Next.js Pokédex data fetch converted to Astro.

This walks through converting three individual files to `.astro` files:

- `_document.js` for providing a layout becomes `src/layouts/Layout.astro`
- `pages/index.js` Pokemon list page becomes `src/pages/index.astro`
- `pages/pokemon/[name].js` for dynamic routing becomes `src/pages/[name].astro`

Note that `_app.js` is not needed in an Astro project. 

### Next base layout to Astro

This example converts the main project layout (`/pages/_document.js`) to `src/layouts/Layout.astro`.

1. Identify the return().

    ```jsx {5-17}
    // _document.js
    import { Html, Head, Main, NextScript } from 'next/document'

    export default function Document() {
        return (
            <Html>
                <Head lang="en">
                    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                </Head>
                <body>
                    <div className="screen">
                        <div className='screen-contents'>
                            <Main />
                        </div>
                    </div>
                    <NextScript />
                </body>
            </Html>
        )
    }
    ```

2. Create `Layout.astro` and add this `return` value, [converted to Astro syntax](#reference-convert-nextjs-syntax-to-astro). 

    Note that:

    - `<Html>` becomes `<html>`
    - `<Head>` becomes `<head>`
    - `<Main />` becomes `<slot />` 
    - `className` becomes `class` 
    - `<NextScript>` is not used in Astro.

    ```astro
    ---
    // src/layouts/Layout.astro
    ---
    <html>
        <head lang="en">
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </head>
        <body>
            <div class="screen">
                <div class='screen-contents'>
                    <slot />
                </div>
            </div>
        </body>
    </html>
    ```

3. Import the CSS (found in `_app.js`)

    Next.js imports global styling via a CSS import in `_app.js`. This import is moved to Astro's layout component:

    ```astro {0-3}
    ---
    // src/layouts/Layout.astro
    import '../styles/index.css'
    ---
    
    <html>
        <head lang="en">
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </head>
        <body>
            <div class="screen">
                <div class='screen-contents'>
                    <slot />
                </div>
            </div>
        </body>
    </html>
    ```
    

`pages/index.js` fetches and displays a list of the first 151 Pokémon using [the REST PokéAPI](https://pokeapi.co/).

Here's how to recreate that in `src/pages/index.astro`, replacing `getStaticProps()` with `fetch()`.

1. Identify the return() JSX.

```jsx {6-18}
// pages/index.js
import Link from 'next/link'
import styles from '../styles/poke-list.module.css';

export default function Home({ pokemons }) {
    return (
        <>
            <ul className={`plain-list ${styles.pokeList}`}>
                {pokemons.map((pokemon) => (
                    <li className={styles.pokemonListItem} key={pokemon.name}>
                        <Link className={styles.pokemonContainer} as={`/pokemon/${pokemon.name}`} href="/pokemon/[name]">
                            <p className={styles.pokemonId}>No. {pokemon.id}</p>
                            <img className={styles.pokemonImage} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={`${pokemon.name} picture`}></img>
                            <h2 className={styles.pokemonName}>{pokemon.name}</h2>
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}

export const getStaticProps = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    const resJson = await res.json();
    const pokemons = resJson.results.map(pokemon => {
        const name = pokemon.name;
        // https://pokeapi.co/api/v2/pokemon/1/
        const url = pokemon.url;
        const id = url.split("/")[url.split("/").length - 2];
        return {
            name,
            url,
            id
        }
    });
    return {
        props: {
            pokemons,
        },
    }
}
```

2. Create `src/pages/index.astro`

Use the return value of the Next function. Convert any Next or React syntax to Astro, including changing the case of any [HTML global attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes).

Note that:

- `.map` just works!

- `className` becomes `class`.

- `<Link>` becomes `<a>`.

- The `<> </>` fragment is not required in Astro templating.

```astro
---
// src/pages/index.astro
---
<ul class="plain-list pokeList">
    {pokemons.map((pokemon) => (
        <li class="pokemonListItem" key={pokemon.name}>
            <a class="pokemonContainer" href={`/pokemon/${pokemon.name}`}>
                <p class="pokemonId">No. {pokemon.id}</p>
                <img class="pokemonImage" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={`${pokemon.name} picture`}/>
                <h2 class="pokemonName">{pokemon.name}</h2>
            </a>
        </li>
    ))}
</ul>
```

3. Add any needed imports, props and JavaScript

Note that:

- the `getStaticProps` function is no longer needed. Data from the API is fetched directly in the code fence.
- A `<Layout>` component is imported, and wraps the page templating.

```astro
---
// src/pages/index.astro
import Layout from '../layouts/layout.astro';

const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
const resJson = await res.json();
const pokemons = resJson.results.map(pokemon => {
    const name = pokemon.name;
    // https://pokeapi.co/api/v2/pokemon/1/
    const url = pokemon.url;
    const id = url.split("/")[url.split("/").length - 2];
    return {
        name,
        url,
        id
    }
});
---

<Layout>
  <ul class="plain-list pokeList">
      {pokemons.map((pokemon) => (
          <li class="pokemonListItem" key={pokemon.name}>
              <a class="pokemonContainer" href={`/pokemon/${pokemon.name}`}>
                  <p class="pokemonId">No. {pokemon.id}</p>
                  <img class="pokemonImage" src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={`${pokemon.name} picture`}/>
                  <h2 class="pokemonName">{pokemon.name}</h2>
              </a>
          </li>
      ))}
  </ul>
</Layout>
```

### Next dynamic routing to Astro

This is a Next.js dynamic routing page (`pages/pokemon/[name].js`) that generates a detail screen for each of the first 151 Pokémon using [the REST PokéAPI](https://pokeapi.co/).

Here's how to recreate that in `src/pages/pokemon/[name].astro`, also using `getStaticPaths()` in Astro.

**[tl/dr]:**
1. Identify the return().
2. Convert JSX to Astro by replacing Next or React syntax with Astro/HTML syntax.
3. Add any needed JavaScript, props, imports.

```jsx {11-33}
// pages/pokemon/[name].js
import { useRouter } from 'next/router';
import styles from '../../styles/pokemon-entry.module.css';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Pokemon({ pokemon }) {
  const router = useRouter();
  return (
    <>
      <img className={styles.pokeImage} src={pokemon.image} alt={`${pokemon.name} picture`} />
      <div className={styles.infoContainer}>
        <h1 className={styles.header}>No. {pokemon.id}: {pokemon.name}</h1>
        <table className={styles.pokeInfo}>
          <tbody>
            <tr>
              <th>Types</th>
              <td>{pokemon.types}</td>
            </tr>
            <tr>
              <th>Height</th>
              <td>{pokemon.height}</td>
            </tr>
            <tr>
              <th>Weight</th>
              <td>{pokemon.weight}</td>
            </tr>
          </tbody>
        </table>
        <p className={styles.flavor}>{pokemon.flavorText}</p>
      </div>
    </>
  )
}

export const getStaticPaths = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  const resJson = await res.json();
  const pokemons = resJson.results;

  return {
    paths: pokemons.map(({ name }) => ({
      params: { name },
    }))
  }
}

export const getStaticProps = async (context) => {
  const { name } = context.params
  const [pokemon, species] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json()),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`).then(res => res.json())
  ])

  return {
    props: {
      pokemon: {
        id: pokemon.id,
        image: pokemon.sprites.front_default,
        name: capitalize(pokemon.name),
        height: pokemon.height,
        weight: pokemon.weight,
        flavorText: species.flavor_text_entries[0].flavor_text,
        types: pokemon.types.map(({ type }) => type.name).join(', ')
      },
    },
  }
}
```

#### Create `src/pages/pokemon/[name].astro`

Use the return value of the Next function. Convert any Next or React syntax to Astro.

Note that:

- Imported styles are moved to the code fence.
- `className` becomes `class`.
- `<Layout>` is added to provide the page shell.
- `{pokemon.*}` values just work!

```astro
---
// src/pages/pokemon/[name].astro
import styles from '../../styles/pokemon-entry.module.css';
---

<Layout>
  <img class={styles.pokeImage} src={pokemon.image} alt={`${pokemon.name} picture`} />
  <div class={styles.infoContainer}>
    <h1 class={styles.header}>No. {pokemon.id}: {pokemon.name}</h1>
    <table class={styles.pokeInfo}>
      <tbody>
        <tr>
          <th>Types</th>
          <td>{pokemon.types}</td>
        </tr>
        <tr>
          <th>Height</th>
          <td>{pokemon.height}</td>
        </tr>
        <tr>
          <th>Weight</th>
          <td>{pokemon.weight}</td>
        </tr>
      </tbody>
    </table>
    <p class={styles.flavor}>{pokemon.flavorText}</p>
  </div>
</Layout>
```
#### Add any needed imports, props and JavaScript


1. Convert Next's `getStaticPaths()` function to Astro's `getStaticPaths()` by removing the `paths` route prefix and returning an array. (Otherwise, the functions are the same.) This function goes into Astro's code fence.

:::tip
Use `Astro.props` to access the `params` returned from the `getStaticPaths` function.
:::

```astro {4-11, 14}
---
// src/pages/pokemon/[name].astro
import styles from '../../styles/pokemon-entry.module.css';

export const getStaticPaths = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  const resJson = await res.json();
  const pokemons = resJson.results;

  return pokemons.map(({ name }) => ({
      params: { name },
    }))
}

const { name } = Astro.props;
---

<Layout>
  <img class={styles.pokeImage} src={pokemon.image} alt={`${pokemon.name} picture`} />
  <div class={styles.infoContainer}>
    <h1 class={styles.header}>No. {pokemon.id}: {pokemon.name}</h1>
    <table class={styles.pokeInfo}>
      <tbody>
        <tr>
          <th>Types</th>
          <td>{pokemon.types}</td>
        </tr>
        <tr>
          <th>Height</th>
          <td>{pokemon.height}</td>
        </tr>
        <tr>
          <th>Weight</th>
          <td>{pokemon.weight}</td>
        </tr>
      </tbody>
    </table>
    <p class={styles.flavor}>{pokemon.flavorText}</p>
  </div>
</Layout>
```

2. Remove the `getStaticProps()` method wrapping the API data fetch, as in the previous example. Add this, along with all other necessary JavaScript for the templating, to the Astro page code fence.



```astro {16-33}
---
// src/pages/pokemon/[name].astro
import styles from '../../styles/pokemon-entry.module.css';

export const getStaticPaths = async () => {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  const resJson = await res.json();
  const pokemons = resJson.results;

  return pokemons.map(({ name }) => ({
      params: { name },
    }))
}

const { name } = Astro.props;

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const [pokemonData, species] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then(res => res.json()),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`).then(res => res.json())
])

const pokemon = {
    id: pokemonData.id,
    image: pokemonData.sprites.front_default,
    name: capitalize(pokemonData.name),
    height: pokemonData.height,
    weight: pokemonData.weight,
    flavorText: species.flavor_text_entries[0].flavor_text,
    types: pokemonData.types.map(({ type }) => type.name).join(', ')
};
---

<Layout>
  <img class={styles.pokeImage} src={pokemon.image} alt={`${pokemon.name} picture`} />
  <div class={styles.infoContainer}>
    <h1 class={styles.header}>No. {pokemon.id}: {pokemon.name}</h1>
    <table class={styles.pokeInfo}>
      <tbody>
        <tr>
          <th>Types</th>
          <td>{pokemon.types}</td>
        </tr>
        <tr>
          <th>Height</th>
          <td>{pokemon.height}</td>
        </tr>
        <tr>
          <th>Weight</th>
          <td>{pokemon.weight}</td>
        </tr>
      </tbody>
    </table>
    <p class={styles.flavor}>{pokemon.flavorText}</p>
  </div>
</Layout>
```