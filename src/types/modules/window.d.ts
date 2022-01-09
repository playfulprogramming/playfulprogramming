import lunr from "lunr";

declare global {
  interface Window {
    __LUNR__: {
      index: lunr.Index;
      store: Record<string, any>;
      __loaded: boolean | Promise<void>;
    };
  }
}
