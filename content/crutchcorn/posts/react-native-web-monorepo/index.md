---
{
  title: "Set up a React Native Web Project in a Monorepo",
  description: "",
  published: '2024-04-05T13:45:00.284Z',
  tags: ['react', 'react native'],
  license: 'cc-by-nc-sa-4',
  originalLink: "https://example.com",
  collection: "React Native Monorepo",
  order: 2
}
---

In our last blog post, we took a look at how to scaffold a React Native monorepo. We explained how some of the benefits were not only code sharing between native apps, but that it enabled us to have different types of applications share the same code:

![// TODO:](../setup-a-react-native-monorepo/rn_monorepo.png)

Here, we showed a Windows, macOS, Android, and iOS app that all share from the same codebase in a monorepo.

What if I told you that this isn't where things stopped?

Let's look at how each of these platforms are supported in React Native:

- [iOS (maintained from Meta)](https://reactnative.dev/)
- [Android (maintained by Meta)](https://reactnative.dev/)
- [Windows (maintained by Microsoft)](https://microsoft.github.io/react-native-windows/)
- [macOS (maintained by Microsoft)](https://microsoft.github.io/react-native-windows/)
- [Web (maintained by ecosystem)](https://necolas.github.io/react-native-web/)

> Wait, what?! We can build web apps using React Native?!

It's true! While this might seem backwards at first, it's a superpower to get a React Native app ported to the web quickly.

So, how do we do this?

## Setting Up the Initial Vite Project

So, let's take the file structure from the last article and add a `websites/admin-portal` folder:

<!-- ::start:filetree -->

- `apps/`
  - `customer-portal/`
  - `admin-portal/`
- `packages/`
  - `shared-elements/`
- `websites/`
  - `admin-portal/`
    - `package.json`
    - `vite.config.ts`
    - `index.html`
    - `src/`
        - `main.tsx`
    - `tsconfig.json`
- `package.json`

<!-- ::end:filetree -->

This `package.json` will include the basics to get a Vite site up-and-running:

```typescript
{
  "name": "vite-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}
```

As well as a `vite.config.ts` file:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

This allows us to have our `index.html` file act as our web app's entry point:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your App Name Here</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Finally, the `<script>` tag allows us to run and import `main.tsx` from `src` to run React:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return <p>Hello, world!</p>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

# Adding React Native Web Support

