import { useEffect, useLayoutEffect } from "react";

export const isBrowser = () => typeof window !== "undefined";

export const useIsomorphicLayoutEffect = isBrowser()
  ? useLayoutEffect
  : useEffect;
