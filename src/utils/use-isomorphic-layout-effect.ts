import { useEffect, useLayoutEffect } from "preact/compat";

export const isBrowser = () => typeof window !== "undefined";

export const useIsomorphicLayoutEffect = isBrowser()
  ? useLayoutEffect
  : useEffect;
