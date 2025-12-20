---
{
  title: "Nuances in React Compiler Library Support",
  description: "",
  published: "2026-07-07T05:12:03.284Z",
  tags: ["react", "javascript", "webdev"],
  license: "cc-by-nc-sa-4",
}
---

Being the lead maintainer of TanStack Form, I wanted to make sure that we supported the then-upcoming release of React Compiler properly.

While it required us to [rethink some strategies we were relying on for internal code authoring](https://github.com/TanStack/form/pull/1035), it seemed to me that we were successful in that endeavor after some testing and user feedback.

After all, we could test against our examples and didn't see any issues present. It wasn't until much later when [we got a report of an issue with turnaries and compiler issues](https://github.com/TanStack/form/issues/1832) that we took a second look at things to revalidate our Compiler support.

# Foundation

Without going too far into our codebase, this is the gist of what we were doing wrong, recontextualized as a scroll listener hook:

```jsx
export function usePosition() {
  const position = useState(() => ({ current: null }));

  // `useScroll` is a hook that subscribes to scroll events
  // and gives the current scroll position
  position.current = useScroll();

  return position;
}
```







<iframe data-frame-title="Broken Scroll Demo - StackBlitz" src="pfp-code:./broken-scroll?template=node&embed=1&file=src%2FApp.jsx"></iframe>

## Why didn't ESLint catch this?

While this particular instance is flagged by ESLint:

```shell
Modifying a value returned from 'useState()', which should not be modified directly. Use the setter function to update instead.

  34 |   const position = useState(() => ({ current: null }));
  35 |
> 36 |   position.current = useScroll();
     |   ^^^^^^^^ value cannot be modified
  37 |
  38 |   return position;
  39 | }  react-hooks/immutability
```

The way our code was written did not seem to be covered by React's ESLint rules at the time.

```
import { useLayoutEffect, useMemo, useReducer } from 'react';

class ScrollHandler {
  scrollX = 0;
  scrollY = 0;

  cb = () => {};

  constructor(cb) {
    this.cb = cb;
  }

  listener = () => {
    this.scrollY = window.scrollY;
    this.scrollX = window.scrollX;
    this.cb();
  }

  mount = () => {
    window.addEventListener('scroll', this.listener);

    return () => {
      window.removeEventListener('scroll', this.listener);
    }
  }
}

export function usePosition() {
  const [_, rerender] = useReducer(() => ({}), {});
  const scrollHandler = useMemo(() => ({current: new ScrollHandler(rerender)}), [rerender]);

  useLayoutEffect(() => {
    const cleanup = scrollHandler.current.mount();
    return () => cleanup();
  }, [scrollHandler]);

  return scrollHandler;
}
```



------



- Use `panicThreshold` in compiler to validate functionality and see where things are skipped
- `exclude` files to simulate files being part of a library
- The long-term fix is to allow for mutations to `position` when things are changing.
