---
{
    title: "Component Reference",
    description: "",
    published: '2023-01-01T22:12:03.284Z',
    authors: ['crutchcorn'],
    tags: ['webdev'],
    attached: [],
}
---





















------------------------------------------------------------------------------









- Component reference
  - `ref`/`forwardRef` / `useImperativeHandle` React
    - Array of refs
  - ViewChild/Angular
    - `ViewChildren`
  - `ref` / Vue
    - Array of refs
  - Element reference
  - Component reference



Element reference first, introduce alternative to `onClick` using `document.addEventListener()`

`element.focus()` example



Then, move to component reference to introduce calling component method/data.

https://stackblitz.com/edit/react-ts-gpjzsm?file=index.tsx





<!-- tabs:start -->

# React

https://stackblitz.com/edit/react-ts-gpjzsm?file=components%2Futils.ts

```tsx
import { MouseEventHandler, useState, useRef, useEffect } from 'react';
import { render } from 'react-dom';

export const debounce = <T extends (...args: any) => any>(
  func: T,
  time: number
): T => {
  let timeout: any;
  return ((...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, time);
  }) as any;
};

interface DragHandlerProps {
  moveX: (relativeX: number) => void;
}

export const DragHandler = ({ moveX }: DragHandlerProps) => {
  const elRef = useRef<HTMLElement | null>(null);

  const onMouseMove = React.useMemo(
    () =>
      debounce((e) => {
        if (!elRef.current) return;
        const boundingBox = elRef.current.getBoundingClientRect();
        const relativeX = e.clientX - boundingBox.x;
        moveX(relativeX);
      }, 1),
    [elRef]
  );

  const onMouseUp = React.useCallback(() => {
    document.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  React.useEffect(() => {
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  React.useEffect(() => {
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [onMouseUp]);

  const onMouseDown: MouseEventHandler = (e) => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      ref={elRef as any}
      style={{ width: '2px', backgroundColor: 'red', cursor: 'col-resize' }}
      onMouseDown={onMouseDown}
    />
  );
};

const App = () => {
  const [width, setWidth] = useState(100);

  // Callback ref
  const homeRef = (props) => {
    // Comment these out for different behavior
    if (!props) return;
    setWidth(props.width);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
      <div style={{ width: `${width}px` }}>
        <Home ref={homeRef} />
      </div>
      <DragHandler moveX={(val) => setWidth((w) => w + val)} />
      <div>
        <Home />
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
```

# Angular

// TODO

# Vue

// TODO: Add

<!-- tabs:end -->