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
