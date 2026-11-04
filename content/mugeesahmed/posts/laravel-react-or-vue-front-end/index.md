---
{
  title: "Laravel With React or Vue: Picking the Front End for a Custom App",
  description: "Laravel's official starter kits include a React version and a Vue version of the same app, alongside Svelte and Livewire kits. This compares the React and Vue ones and lists the questions that should decide which one you use.",
  published: "2026-10-24",
  tags: ["react", "vue"],
  license: "cc-by-4"
}
---

On a new custom web app with Laravel behind it, the React or Vue argument tends to start before anyone has written a migration. It usually gets argued as taste. It goes better if you first settle how the front end will talk to Laravel, because that answer changes how much the framework choice matters at all.

## How will the front end reach Laravel?

There are two common shapes.

The first is [Inertia](https://inertiajs.com/). Laravel keeps the routes, controllers, middleware and auth, and a controller returns a page component plus its props where it would otherwise return a Blade view. Inertia's own site puts it as "No API required." Laravel's official React and Vue starter kits are both built this way, on Inertia 3 with TypeScript and Tailwind.

The second is a separate single page app that calls a Laravel API, with [Sanctum](https://laravel.com/docs/sanctum) handling sign in. For your own SPA, Sanctum doesn't use tokens at all. It uses Laravel's normal session cookies, which brings CSRF protection with it. The catch is that the SPA and the API must share the same top-level domain, though they can sit on different subdomains. The Sanctum docs say plainly that API tokens are the wrong tool for a first-party SPA; tokens are for third parties and mobile apps.

With Inertia, a good part of the React versus Vue debate disappears. You don't choose a client-side router, because Laravel does the routing. You don't design a REST API for your own screens. What's left is how each framework renders markup and holds component state, which is a smaller decision than it looks from outside.

A separate SPA earns its extra moving parts when the API has other consumers, such as a mobile app or a partner integration, or when a different team ships the front end on its own schedule. In that case each framework's wider ecosystem carries more weight.

Before committing to JavaScript, it's also worth a look at [Livewire](https://livewire.laravel.com). Laravel's docs pitch it at teams that mostly write Blade templates and want "a simpler alternative" to React, Svelte and Vue. If that describes your team, the rest of this article may not apply.

## What does the same page look like in each?

Here is one Laravel route serving an invoice list through Inertia. This part is identical no matter which front end you choose:

```php
<?php

use App\Models\Invoice;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/invoices', function () {
    return Inertia::render('invoices/index', [
        'invoices' => Invoice::query()
            ->latest()
            ->get(['id', 'number', 'total']),
    ]);
})->middleware(['auth', 'verified'])->name('invoices.index');
```

The React page, as `resources/js/pages/invoices/index.tsx`:

```tsx
import { Head } from '@inertiajs/react';

type Invoice = { id: number; number: string; total: string };

export default function InvoicesIndex({ invoices }: { invoices: Invoice[] }) {
    return (
        <>
            <Head title="Invoices" />
            <ul>
                {invoices.map((invoice) => (
                    <li key={invoice.id}>
                        {invoice.number}: {invoice.total}
                    </li>
                ))}
            </ul>
        </>
    );
}
```

The Vue page, as `resources/js/pages/invoices/index.vue`:

```vue
<script setup lang="ts">
import { Head } from '@inertiajs/vue3';

type Invoice = { id: number; number: string; total: string };

defineProps<{ invoices: Invoice[] }>();
</script>

<template>
    <Head title="Invoices" />
    <ul>
        <li v-for="invoice in invoices" :key="invoice.id">
            {{ invoice.number }}: {{ invoice.total }}
        </li>
    </ul>
</template>
```

I ran the PHP through `php -l`, the TSX through esbuild and the Vue file through `@vue/compiler-sfc` to make sure all three parse.

The props arrive the same way in both. The difference is where the markup lives. React's docs describe JSX as "a syntax extension for JavaScript that lets you write HTML-like markup inside a JavaScript file," so the loop is an ordinary `map` call. A Vue single-file component keeps an HTML template next to its script and styles, and loops with a `v-for` directive.

If your team spends its day in Blade, the Vue template will look closer to home: double curly braces for output, as in Blade, and a `v-for` or `v-if` directive where Blade would use `@foreach` or `@if`. If they would rather have every loop and condition be a plain JavaScript expression, JSX works that way: a loop is a `map` call and a condition is a ternary or `&&`.

The starter kits keep the rest level. The React kit uses shadcn/ui and the Vue kit uses shadcn-vue, and both come with the same sidebar and header layouts and the same Fortify sign in pages. Both also support Inertia's server-side rendering through `npm run build:ssr`, so SSR isn't a tie-breaker inside this stack.

## Who will be reading this code later?

For a custom app, this question tends to outweigh everything on a feature table. Pick the framework that the person maintaining the app can read without effort. If the developer who will inherit it writes Vue every day, a React codebase means learning hooks, effect dependencies and list keys before they can safely change a form. A React developer meeting `v-model`, `computed` and `watch` for the first time has the same problem in reverse. Either way the first few tickets take longer than they should.

## Is a native mobile app on the roadmap?

If so, plan for it on both sides. In Laravel, Sanctum's mobile flow issues an API token per device, alongside the session login your web app uses. On the front end, React's docs list Expo as a recommended starting point for native apps, so a React team can begin the mobile project in a library it already knows. That's a real point in React's favor when mobile is likely, and close to irrelevant when it isn't.

## How many decisions do you want made for you?

Outside Inertia, the two ecosystems differ in how much they choose on your behalf. Vue's docs point to Vue Router as the officially supported router for most SPAs, and recommend Pinia, maintained by the Vue core team, for state in new apps. React's docs say that starting from scratch means picking your own tools for routing and data fetching, and recommend starting with a framework such as Next.js or React Router instead.

With Laravel already owning routing and data, much of what a full React framework offers overlaps with the back end you have. A Vue SPA with Vue Router and Pinia gives you a short list of official answers. A React SPA gives you more freedom and more choices to make, and it's worth writing those choices down on day one so the second developer doesn't redo them.

## What catches people in the starter kits?

One detail that bites in both kits: routes on the front end are typed with Wayfinder, which generates route definitions at build time. If you turn off a Fortify feature such as email verification in `config/fortify.php`, you also have to delete the front-end references to those routes, or the build fails. It reads like a front-end bug the first time you hit it, but the cause sits on the Laravel side.

When the questions above don't settle it, run `laravel new` twice, pick the React kit once and the Vue kit once, and build the same real screen from your app in each. Then hand both versions to the person who will maintain the app and let them choose.

## Sources

- Laravel 13.x documentation, Starter Kits: https://laravel.com/docs/starter-kits
- Laravel 13.x documentation, Laravel Sanctum: https://laravel.com/docs/sanctum
- Inertia.js home page: https://inertiajs.com/
- Inertia v3 documentation, Pages: https://inertiajs.com/docs/v3/the-basics/pages
- React documentation, Creating a React App: https://react.dev/learn/creating-a-react-app
- React documentation, Build a React app from Scratch: https://react.dev/learn/build-a-react-app-from-scratch
- React documentation, Writing Markup with JSX: https://react.dev/learn/writing-markup-with-jsx
- Vue documentation, Introduction: https://vuejs.org/guide/introduction.html
- Vue documentation, Routing: https://vuejs.org/guide/scaling-up/routing.html
- Vue documentation, State Management: https://vuejs.org/guide/scaling-up/state-management.html
