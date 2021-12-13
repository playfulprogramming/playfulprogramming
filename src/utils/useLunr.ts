import lunr from "lunr";
import { useEffect, useRef, useState } from "react";

interface LunrStore {
  index: lunr.Index;
  store: Record<string, any>;
}

function getSearchResults(
  lunrIndex: LunrStore | null | undefined,
  query: string
) {
  if (!query || !lunrIndex) return [];
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

interface LunrProps {
  exportedIndex: string;
}

/**
 *
 * @param [language]
 * @returns {object}
 * results - an array of matches {slug: string}[]
 * onSearch - A `onChange` event or a callback to pass a string
 */
export const useLunr = ({ exportedIndex }: LunrProps) => {
  const [results, setResults] = useState<any[] | null>(null);

  const lunrRef = useRef<LunrStore>();

  useEffect(() => {
    const index = JSON.parse(exportedIndex);

    lunrRef.current = {
      index: lunr.Index.load(index.index),
      store: index.store,
    };
  }, [exportedIndex]);

  const searchUsingLunr = (str: string) => {
    const eventVal = str;
    if (!eventVal) {
      setResults(null);
      return;
    }
    const results = getSearchResults(lunrRef.current, eventVal);
    setResults(results);
  };

  return { searchUsingLunr, results };
};
