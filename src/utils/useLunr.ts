import lunr from "lunr";
import { useEffect, useState } from "react";

function loadLunr() {
  if (typeof window !== "undefined") {
    window.__LUNR__ = window.__LUNR__ || {};
    if (!window.__LUNR__?.__loaded) {
      // TODO: Handle subpath deploys
      window.__LUNR__.__loaded =
        typeof fetch !== "undefined" &&
        fetch(`/search_index.json`, {
          credentials: "same-origin",
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (fullIndex) {
            window.__LUNR__ = {
              index: lunr.Index.load(fullIndex.index),
              store: fullIndex.store,
              __loaded: window.__LUNR__.__loaded,
            };
          })
          .catch((e) => {
            console.log("Failed fetch search index");
            throw e;
          });
    }
  }
}

function getSearchResults(query: string) {
  if (!query || !(window as any)?.__LUNR__) return [];
  const lunrIndex = (window as any).__LUNR__;
  // you can customize your search, see https://lunrjs.com/guides/searching.html
  // Escape the lunr regex, add `*`s to partially match to act more like typical search
  const escapedStr = query.replace(/[-/\\^$*+?.()|[\]{}:]/g, "\\$&");
  // FIXME: This is super lazy and bad, please fix me I'm non-performant
  const lazyResults = lunrIndex.index.search(`*${escapedStr}*`);
  const fullResults = lunrIndex.index.search(escapedStr);
  const refs = new Set([
    ...lazyResults.map(({ ref }: { ref: any }) => ref),
    ...fullResults.map(({ ref }: { ref: any }) => ref),
  ]);

  return Array.from(refs).map(
    (ref) => lunrIndex.store[ref] as { title: string; slug: string }
  );
}

/**
 *
 * @returns {object}
 * results - an array of matches {slug: string}[]
 * onSearch - A `onChange` event or a callback to pass a string
 */
export const useLunr = () => {
  const [results, setResults] = useState<any[] | null>(null);

  useEffect(() => {
    loadLunr();
  }, []);

  const searchUsingLunr = (str: string) => {
    const eventVal = str;
    if (!eventVal) {
      setResults(null);
      return;
    }
    const results = getSearchResults(eventVal);
    setResults(results);
  };

  return { searchUsingLunr, results };
};
