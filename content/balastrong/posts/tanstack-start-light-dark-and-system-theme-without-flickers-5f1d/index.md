---
{
title: "TanStack Start: light, dark, and system theme without flickers",
published: "2025-08-25T12:33:00Z",
tags: ["react", "ssr", "tailwindcss", "tutorial"],
description: "Having multiple themes is a common request on (web) applications nowadays, at least having light,...",
originalLink: "https://leonardomontini.dev/tanstack-start-theme/",
coverImage: "cover-image.png",
socialImage: "social-image.png",
collection: "Web Development",
order: 23
}
---

Having multiple themes is a common request on (web) applications nowadays, at least having light, dark, and system (define dark/light automatically from the user's system).

If your application has also some sort of server-side rendering, this seemingly simple request might quickly become more complex than expected, in particular once you start seeing issues like:

- The app initially loads with the wrong theme (FOUC: Flash Of Unstyled Content)
- You refresh the page and the theme is gone
- The user changes the system theme and the app doesn't follow
- Some weird errors are logged as client-only APIs are called on the server
- Hydration issues everywhere
- ... the list goes on

## Implementation Details

I recently took some time to implement a robust approach for a TanStack Start application ([code here](https://github.com/Balastrong/start-theme-demo)) and I recorded a video where I explain step by step all the moving parts, you can watch it here and keep this written article as reference for later.

<iframe src="https://www.youtube.com/watch?v=NoxvbjkyLAg"></iframe>

### The two theme types

Let's begin with the types definition. I like to distinguish between what the user chooses and what the app actually renders:

```ts
export type UserTheme = 'light' | 'dark' | 'system';
export type AppTheme = Exclude<UserTheme, 'system'>;
```

`UserTheme` is the user's explicit choice, while `AppTheme` is the resolved theme that the app actually uses for rendering.

### Storage that doesn't break SSR

Let's persist the user's choice through localStorage.

Wait... but isn't it a client only API? Yes it is, the usual architectural choice is between localStorage and cookies. I'll get a bit more into detail at the end of the article if you're curious, but for now let's go with the localStorage approach.

Rule number 1 is: never touch `window` or `localStorage` when running on the server. There's another interesting rule but I'll tell you later... ok no let me put it now, when doing the first render (on the server) you can't rely on js or you'll get hydration errors and weird flashes. We'll see that in practice in the theme switcher.

here's the approach through some utility methods: a safe getter that returns 'system' on the server and validates values on the client; and a setter that no‑ops on the server.

```ts
function getStoredUserTheme(): UserTheme {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = localStorage.getItem(themeStorageKey);
    return stored && themes.includes(stored as UserTheme) ? (stored as UserTheme) : 'system';
  } catch {
    return 'system';
  }
}

function setStoredTheme(theme: UserTheme): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {}
}
```

### Resolving the system theme

Browsers expose the OS preference via `matchMedia('(prefers-color-scheme: dark)')`.

```ts
function getSystemTheme(): AppTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
```

With that alone if the user changes preference (for example in the OS settings) while your page is loaded, the app won't reflect that change until a full reload occurs. The cool thing is that you can *subscribe* to that.

```ts
function setupPreferredListener() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => handleThemeChange('system');
  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}
```

Why is this function returning a cleanup function? No mistery, we're going to use it inside a useEffect, it's the cleanup function for the event listener to avoid memory leaks.

### Applying the theme to the DOM

The DOM definition of the theme is on a class in the `<html>` element, either `light`, `dark`. If it's `system`, we'll also set that in the `<html>` element.

```ts
function handleThemeChange(userTheme: UserTheme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark', 'system');
  const newTheme = userTheme === 'system' ? getSystemTheme() : userTheme;
  root.classList.add(newTheme);

  if (userTheme === 'system') {
    root.classList.add('system');
  }
}
```

### The ThemeProvider

Probably the most common usecase for React Context, the ThemeProvider component makes it easy to access and update the theme throughout your application.

On mount, set the initial theme from storage and wire the system listener only if `userTheme === 'system'`.

When setting a new theme: update state, persist to storage, and re‑apply classes to `<html>`.

The implementation might be something like:

```tsx
type ThemeContextProps = {
  userTheme: UserTheme;
  appTheme: AppTheme;
  setTheme: (theme: UserTheme) => void;
};
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [userTheme, setUserTheme] = useState<UserTheme>(getStoredUserTheme);

  useEffect(() => {
    if (userTheme !== 'system') return;
    return setupPreferredListener();
  }, [userTheme]);

  const appTheme = userTheme === 'system' ? getSystemTheme() : userTheme;

  const setTheme = (newUserTheme: UserTheme) => {
    setUserTheme(newUserTheme);
    setStoredTheme(newUserTheme);
    handleThemeChange(newUserTheme);
  };

  return (
    <ThemeContext value={{ userTheme, appTheme, setTheme }}>
      <ScriptOnce children={themeScript} />

      {children}
    </ThemeContext>
  );
}

export const useTheme = () => {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### The crucial inline script: no FOUC

If you're already into the cookie vs localStorage debate, you know that in order to make this work you need to inject a tiny inline script that runs immediately, before hydration, to set the correct class on the root element. If you also have a sharp eye you noticed that `<ScriptOnce children={themeScript} />` in the previous snippet.

The easiest way in TanStack Start to inject this inline script is to use the `ScriptOnce` component, which allows you to run a script only once during the initial render.

One tiny annoyance with inline scripts is that you write them as plain strings... so here's a magic trick to write it as a proper js function, enjoying linters and all kind of IDE support, then putting it the toString version inside an IIFE

```ts
const themeScript: string = (function () {
  function themeFn() {
    try {
      const storedTheme = localStorage.getItem('ui-theme') || 'system';
      const validTheme = ['light', 'dark', 'system'].includes(storedTheme) ? storedTheme : 'system';

      if (validTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.classList.add(systemTheme, 'system');
      } else {
        document.documentElement.classList.add(validTheme);
      }
    } catch (e) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(systemTheme, 'system');
    }
  }
  return `(${themeFn.toString()})();`;
})();
```

With this tiny bit of logic, that is converted to a string, you make sure *as soon as possible* to add the correct css class.

What happens without this? You'll get a flash: the page loads in the default style, then flips after React mounts. The inline script prevents that by writing the class during the initial HTML paint.

For clarity, here's the "too late" version using only `useEffect` so you can compare the behavior:

```ts
useEffect(() => {
  handleThemeChange(userTheme);
}, []);
```

You do this anywhere in your app? You get a FOUC. That's why we did the inline script magic.

### Let CSS, not JS, drive the toggle UI

Here's the rule number 2 I mentioned earlier.

Because initial values settle before React, UI that depends on JS state will likely flicker as the server renders something (e.g. the icon for the light theme) but then on the client it gets overridden by the actual state and replaced with the dark theme... because you're using the dark theme, right?

The safest approach is to let CSS decide visibility based on the root classes. With Tailwind v4 you can use `:not()` and class selectors to keep it simple.

Here's an example:

```tsx
const themeConfig: Record<UserTheme, { icon: string; label: string }> = {
  light: { icon: '☀️', label: 'Light' },
  dark: { icon: '🌙', label: 'Dark' },
  system: { icon: '💻', label: 'System' },
};

export const ThemeToggle = () => {
  const { userTheme, setTheme } = useTheme();

  const getNextTheme = () => {
    const themes = Object.keys(themeConfig) as UserTheme[];
    const currentIndex = themes.indexOf(userTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    return themes[nextIndex];
  };

  return (
    <Button onClick={() => setTheme(getNextTheme())} className="w-28">
      <span className="not-system:light:inline hidden">
        {themeConfig.light.label}
        <span className="ml-1">{themeConfig.light.icon}</span>
      </span>
      <span className="not-system:dark:inline hidden">
        {themeConfig.dark.label}
        <span className="ml-1">{themeConfig.dark.icon}</span>
      </span>
      <span className="system:inline hidden">
        {themeConfig.system.label}
        <span className="ml-1">{themeConfig.system.icon}</span>
      </span>
    </Button>
  );
};
```

You can `userTheme` the theme coming from the hook at any *other* time, for example to cycle between themes on user click, but on the *initial render* you can't. CSS will drive your button.

## TanStack Start primitives: clientOnly and createIsomorphicFn

To avoid manual `typeof window !== 'undefined'` checks, you can use the Start utilities so you can define client‑only logic or dual client/server logic without sprinkling conditions everywhere.

- `clientOnly(fn)`: throws on server, runs on client
- `createIsomorphicFn({ server, client })`: given the isomorphic nature of some functions, lets you define different behaviors on client and server

They're perfect for storage helpers and DOM‑touching functions, look at how expressive the code becomes:

```ts
const getStoredUserTheme = createIsomorphicFn()
  .server((): UserTheme => 'system')
  .client((): UserTheme => {
    try {
      const stored = localStorage.getItem(themeStorageKey);
      return stored && themes.includes(stored as UserTheme) ? (stored as UserTheme) : 'system';
    } catch {
      return 'system';
    }
  });

const setStoredTheme = clientOnly((theme: UserTheme) => {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {}
});
```

## Validate with Zod

Instead of hand‑checking strings from storage, define a Zod enum with a `catch('system')`. Then call `schema.parse(value)` and you're guaranteed a valid `UserTheme`.

```ts
const UserThemeSchema = z.enum(['light', 'dark', 'system']).catch('system');
const AppThemeSchema = z.enum(['light', 'dark']).catch('light');

export type UserTheme = z.infer<typeof UserThemeSchema>;
export type AppTheme = z.infer<typeof AppThemeSchema>;

const getStoredUserTheme = createIsomorphicFn()
  .server((): UserTheme => 'system')
  .client((): UserTheme => {
    const stored = localStorage.getItem(themeStorageKey);
    return UserThemeSchema.parse(stored);
  });

const setStoredTheme = clientOnly((theme: UserTheme) => {
  const validatedTheme = UserThemeSchema.parse(theme);
  localStorage.setItem(themeStorageKey, validatedTheme);
});
```

## Cookies vs LocalStorage (and when to use them)

To be honest I don't have clear evidence that one approach is absolutely superior than the other as they both come with their own trade-offs. In most cases it doesn't matter that much anyway, just pick the approach that seems more reasonable and you'll be fine.

The localStorage approach lives in the browser only which is good but requires js to run (on hydration) and you have to do those CSS tricks to control the initial render. Besides, the server has no knowledge of the user's preference.

The cookie approach makes the server aware of the theme, but it also means the browser has to deal with the server for each theme change that should just be a client function.

In any case, on the same repo you can find in the commit history a version with the cookie approach: https://github.com/Balastrong/start-theme-demo/tree/077010bee3ca25ba775a4d452d55244cf8971637

## Wrap‑up

So here's the full flow:

1. Keep UserTheme ('light'|'dark'|'system') separate from AppTheme ('light'|'dark') and derive the latter.
2. Use safe storage helpers that default on the server and validate localStorage values on the client.
3. Write classes on document.documentElement (light/dark and optional system) whenever the theme changes.
4. Provide userTheme, appTheme, and setTheme via Context and listen to prefers-color-scheme when on system.
5. Inject a tiny inline script to set the initial html class before hydration to eliminate FOUC.
6. Let CSS driven by root classes control the toggle UI so it renders correctly on first paint.
7. Optionally use TanStack Start clientOnly/createIsomorphicFn and Zod enums to simplify and validate logic.

Before going, here some useful links:

- Live Demo: https://tanstack-start-theme-demo.netlify.app/
- GitHub Repository: https://github.com/Balastrong/start-theme-demo
- Walkthrough Video: https://youtu.be/NoxvbjkyLAg

Now some homework for you, feel free to leave a star to the repo and like the video and... enjoy!

Also any comment or feedback, please, let me know!

---

Thanks for reading this article, I hope you found it interesting!

Let's connect more: https://leonardomontini.dev/newsletter

Do you like my content? You might consider subscribing to my YouTube channel! It means a lot to me ❤️
You can find it here:
[![YouTube](https://img.shields.io/badge/YouTube:%20Dev%20Leonardo-FF0000?style=for-the-badge\&logo=youtube\&logoColor=white)](https://www.youtube.com/c/@DevLeonardo?sub_confirmation=1)

Feel free to follow me to get notified when new articles are out ;)

<!-- ::user id="balastrong" -->
