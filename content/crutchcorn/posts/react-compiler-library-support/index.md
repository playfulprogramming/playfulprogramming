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
  const position = useState(() => ({ current: null }))[0];

  // `useScroll` is a hook that subscribes to scroll events
  // and gives the current scroll position
  position.current = useScroll();

  return position;
}
```

When this hook is used in a parent component:

```jsx
export default function ScrollPosition() {
  const position = usePosition();

  return <div style={{ position: 'fixed', top: '1rem', left: '1rem' }}>
    <p>
      {position.current.scrollY}
    </p>
  </div>;
}
```

Things seem to work fine, even with the React Compiler enabled.

However, move the `position` to a child component:

```jsx
function ShowScroll({ position }) {
  return (
    <p>
      {position.current.scrollY}
    </p>
  );
}

export default function ScrollPosition() {
  const position = usePosition();

  return <div style={{ position: 'fixed', top: '1rem', left: '1rem' }}>
    <ShowScroll position={position} />
  </div>;
}

```

And suddenly the `position.current.scrollY` doesn't update anymore.

<iframe data-frame-title="Broken Scroll Demo - StackBlitz" src="pfp-code:./broken-scroll?template=node&embed=1&file=src%2FApp.jsx"></iframe>

If we look at a minimal version of this code [compiled through the React Compiler](https://playground.react.dev/), we get:

```jsx
import { c as _c } from "react/compiler-runtime";
import { usePosition } from "./useScroll";

function ShowScroll(t0) {
  const $ = _c(2);
  const { position } = t0;
  let t1;
  if ($[0] !== position.current.scrollY) {
    t1 = <p>{position.current.scrollY}</p>;
    $[0] = position.current.scrollY;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export default function ScrollPosition() {
  const $ = _c(2);
  const position = usePosition();
  let t0;
  if ($[0] !== position) {
    t0 = <ShowScroll position={position} />;
    $[0] = position;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}
```

If we then focus on `ScrollPosition`:

```jsx {5-7,10,12}
export default function ScrollPosition() {
  const $ = _c(2);
  const position = usePosition();
  let t0;
  if ($[0] !== position) {
    t0 = <ShowScroll position={position} />;
    $[0] = position;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}
```

We can see that `t0` is defined as a memoized `<ShowScroll>` element that is not updated until `position`'s [referencial stability](/posts/object-mutation#mutation) has changed.

Compare and contrast to the code generated when we have:

```jsx
import { usePosition } from './useScroll';

export default function ScrollPosition() {
  const position = usePosition();

   return (
    <p>
      {position.current.scrollY}
    </p>
  );
}
```

```jsx {8}
import { c as _c } from "react/compiler-runtime";
import { usePosition } from "./useScroll";

export default function ScrollPosition() {
  const $ = _c(2);
  const position = usePosition();
  let t0;
  if ($[0] !== position.current.scrollY) {
    t0 = <p>{position.current.scrollY}</p>;
    $[0] = position.current.scrollY;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}
```

Here, we see that `position.current.scrollY` itself is being compared by reference rather than the `position` object.

This explains why our code broke in some edgecases but not others.

## Why didn't ESLint catch this?

While this particular instance is flagged by ESLint:

```shell
Modifying a value returned from 'useState()', which should not be modified directly. Use the setter function to update instead.

  34 |   const position = useState(() => ({ current: null }))[0];
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
