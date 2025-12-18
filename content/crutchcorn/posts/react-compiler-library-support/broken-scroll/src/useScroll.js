import { useState, useSyncExternalStore } from 'react';

let cache = {
  scrollY: 0,
  scrollX: 0,
};

function subscribe(callback) {
  window.addEventListener('scroll', callback);
  return () => {
    window.removeEventListener('scroll', callback);
  };
}

function getSnapshot() {
  if (cache.scrollY !== window.scrollY || cache.scrollX !== window.scrollX) {
    cache = {
      scrollY: window.scrollY,
      scrollX: window.scrollX,
    };
  }
  return cache;
}

function getServerSnapshot() {
  return cache;
}

function useScroll() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function usePosition() {
  const position = useState(() => ({ current: null }));

  position.current = useScroll();

  return position;
}
